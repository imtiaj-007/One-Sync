import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import { ParsedEmail } from './types.js';
import { log } from '../utils/logger.js';


export async function startImapClient(account: any, onEmail: (email: ParsedEmail) => void) {
    console.log(account)
    const client = new ImapFlow({
        host: account.host,
        port: account.port,
        secure: account.tls,
        auth: {
            user: account.user,
            pass: account.password,
        },
    });

    client.on('error', (err) => {
        log.error(`IMAP error (${account.name}):`, err);
    });

    await client.connect();
    log.info(`IMAP connected: ${account.name}`);

    await client.mailboxOpen('INBOX');

    client.on('exists', async () => {
        const lock = await client.getMailboxLock('INBOX');
        try {
            const messages = await client.fetch('1:*', { envelope: true, source: true, uid: true });
            for await (const msg of messages) {
                const parsed = await simpleParser(msg.source!);
                const email: ParsedEmail = {
                    subject: parsed.subject || '',
                    from: parsed.from?.text || '',
                    to: Array.isArray(parsed.to) 
                        ? parsed.to.flatMap(addr => addr.value.map((r: any) => r.address || ''))
                        : parsed.to?.value.map((r: any) => r.address || '') || [],
                    date: parsed.date || new Date(),
                    text: parsed.text || '',
                    html: parsed.html || '',
                    messageId: parsed.messageId || '',
                    account: account.name,
                };
                onEmail(email);
            }
        } finally {
            lock.release();
        }
    });

    await client.idle();
}