import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import { EmailAccountConfig, ParsedEmail } from './types.js';
import { readLastUid, writeLastUid } from '../utils/uidTracker.js';
import { log } from '../utils/logger.js';


export async function createImapClient(account: EmailAccountConfig): Promise<ImapFlow> {
    return new ImapFlow({
        host: account.host,
        port: account.port,
        secure: account.tls,
        auth: {
            user: account.user,
            pass: account.password,
        },
    });
}

export async function parseEmailMessage(source: string, accountName: string): Promise<ParsedEmail> {
    const parsed = await simpleParser(source);
    return {
        subject: parsed.subject || '',
        from: parsed.from?.text || '',
        to: Array.isArray(parsed.to)
            ? parsed.to.flatMap(addr => addr.value.map((r: any) => r.address || ''))
            : parsed.to?.value.map((r: any) => r.address || '') || [],
        date: parsed.date || new Date(),
        text: parsed.text || '',
        html: parsed.html || '',
        messageId: parsed.messageId || '',
        account: accountName,
    };
}

export async function processMessages(
    client: ImapFlow,
    account: EmailAccountConfig,
    onEmail: (email: ParsedEmail) => void,
    isStartup: boolean = false
) {
    const lock = await client.getMailboxLock('INBOX');
    try {
        const lastUid = await readLastUid(account.name);
        let searchCriteria;

        if (isStartup) {
            const maxMessages = account.maxMessages || 5;
            
            if (account.dateRange) {
                const searchOptions: any = {};
                if (account?.dateRange?.since) searchOptions.since = account.dateRange.since;
                if (account?.dateRange?.before) searchOptions.before = account.dateRange.before;
                
                const searchResults = await client.search(searchOptions);
                if (Array.isArray(searchResults) && searchResults.length > 0) {
                    searchCriteria = searchResults.slice(-maxMessages);
                } else {
                    searchCriteria = [];
                }
            } else {
                const mailboxStatus = await client.status('INBOX', { messages: true });
                const totalMessages = mailboxStatus.messages;
                const startSeq = Math.max(1, (totalMessages || 0) - maxMessages + 1);
                searchCriteria = `${startSeq}:${totalMessages}`;
            }
            log.info(`[${account.name}] Startup sync: processing last ${maxMessages} messages`);

        } else {
            if (!lastUid) {
                log.error(`[${account.name}] No lastUid found for incremental sync, skipping`);
                return;
            }

            if (account.dateRange) {
                const searchOptions: any = {
                    uid: `${lastUid + 1}:*`
                };
                if (account?.dateRange?.since) searchOptions.since = account.dateRange.since;
                if (account?.dateRange?.before) searchOptions.before = account.dateRange.before;

                const searchResults = await client.search(searchOptions);
                searchCriteria = Array.isArray(searchResults) && searchResults.length > 0 ? searchResults : [];
            } else {
                searchCriteria = `${lastUid + 1}:*`;
            }
            log.info(`[${account.name}] Incremental sync: processing messages with UID > ${lastUid}`);
        }

        if (Array.isArray(searchCriteria) && searchCriteria.length === 0) {
            log.info(`[${account.name}] No new messages to process`);
            return;
        }

        const messages = await client.fetch(searchCriteria, {
            envelope: true,
            source: true,
            uid: true
        });

        let maxUid = lastUid ?? 0;
        let messageCount = 0;

        const messagesArray = [];
        for await (const msg of messages) {
            messagesArray.push(msg);
        }
        log.info(`[${account.name}] Found ${messagesArray.length} messages to process`);
        
        messagesArray.sort((a, b) => a.uid - b.uid);

        for (const msg of messagesArray) {
            if (isStartup && messageCount >= (account.maxMessages || 5)) {
                log.info(`[${account.name}] Startup: reached max message limit (${account.maxMessages || 5})`);
                break;
            }

            try {
                const email = await parseEmailMessage(msg.source!.toString(), account.name);
                await onEmail(email);
                messageCount++;

                if (msg.uid > maxUid) {
                    maxUid = msg.uid;
                }
                log.info(`[${account.name}] Processed message UID: ${msg.uid}, Subject: ${email.subject}`);

            } catch (error) {
                log.error(`[${account.name}] Failed to process message UID ${msg.uid}:`, error);
                continue;
            }
        }

        if (maxUid > (lastUid ?? 0)) {
            await writeLastUid(account.name, maxUid);
            log.info(`[${account.name}] Updated lastUid to: ${maxUid}`);
        }

        log.info(`[${account.name}] Processed ${messageCount} messages`);

    } finally {
        lock.release();
    }
}

export async function startImapClient(
    account: EmailAccountConfig,
    onEmail: (email: ParsedEmail) => void
) {
    const client = await createImapClient(account);

    client.on('error', (err) => {
        log.error(`IMAP error (${account.name}):`, err);
    });

    await client.connect();
    log.info(`IMAP connected: ${account.name}`);

    await client.mailboxOpen('INBOX');

    if (account.fetchOnStartup ?? true) {
        log.info(`[${account.name}] Starting initial sync...`);
        await processMessages(client, account, onEmail, true);
    }

    client.on('exists', async () => {
        log.info(`[${account.name}] New message(s) detected, processing...`);
        await processMessages(client, account, onEmail, false);
    });

    await client.idle();
}