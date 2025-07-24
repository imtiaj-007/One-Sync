import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import { EmailAccountConfig, ParsedEmail, DateRange, SearchResult } from './types.js';
import { readLastUid, writeLastUid } from '../utils/uidTracker.js';
import { log } from '../utils/logger.js';

/**
 * Creates a new instance of ImapFlow with the provided email account configuration.
 * 
 * @param {EmailAccountConfig} account - The email account configuration.
 * @returns {Promise<ImapFlow>} A promise that resolves to the created ImapFlow instance.
 */
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

/**
 * Parses an email message source into a structured ParsedEmail object.
 * 
 * @param {string} source - The source of the email message.
 * @param {string} accountName - The name of the email account.
 * @returns {Promise<ParsedEmail>} A promise that resolves to the parsed email object.
 */
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

/**
 * Creates a date range object for the last N days.
 * 
 * @param {number} days - The number of days to go back from today. Defaults to 7.
 * @returns {DateRange} A date range object with 'since' and 'before' dates.
 */
function createDateRange(days: number = 7): DateRange {
    const now = new Date();
    const since = new Date();
    since.setDate(now.getDate() - days);
    
    return {
        since,
        before: now
    };
}

/**
 * Builds search criteria for the startup sync process using a date range.
 * 
 * @param {ImapFlow} client - The ImapFlow client instance.
 * @param {DateRange} dateRange - The date range to filter messages by.
 * @returns {Promise<SearchResult>} A promise that resolves to the search result.
 */
async function buildStartupSearchCriteria(
    client: ImapFlow,
    dateRange: DateRange
): Promise<SearchResult> {
    const searchOptions: any = {};
    if (dateRange.since) searchOptions.since = dateRange.since;
    if (dateRange.before) searchOptions.before = dateRange.before;
    
    const searchResults = await client.search(searchOptions);
    
    return {
        criteria: Array.isArray(searchResults) && searchResults.length > 0 ? searchResults : [],
        isEmpty: !Array.isArray(searchResults) || searchResults.length === 0
    };
}

/**
 * Builds search criteria for the incremental sync process using a date range and the last UID.
 * 
 * @param {ImapFlow} client - The ImapFlow client instance.
 * @param {DateRange} dateRange - The date range to filter messages by.
 * @param {number} lastUid - The last UID to start searching from.
 * @returns {Promise<SearchResult>} A promise that resolves to the search result.
 */
async function buildIncrementalSearchCriteria(
    client: ImapFlow,
    dateRange: DateRange,
    lastUid: number
): Promise<SearchResult> {
    const searchOptions: any = {
        uid: `${lastUid + 1}:*`
    };
    if (dateRange.since) searchOptions.since = dateRange.since;
    if (dateRange.before) searchOptions.before = dateRange.before;
    
    const searchResults = await client.search(searchOptions);
    
    return {
        criteria: Array.isArray(searchResults) && searchResults.length > 0 ? searchResults : [],
        isEmpty: !Array.isArray(searchResults) || searchResults.length === 0
    };
}

/**
 * Fetches and sorts messages by UID based on the provided search criteria.
 * 
 * @param {ImapFlow} client - The ImapFlow client instance.
 * @param {number[] | string} searchCriteria - The search criteria to fetch messages by.
 * @returns {Promise<any[]>} A promise that resolves to an array of sorted messages.
 */
async function fetchAndSortMessages(
    client: ImapFlow,
    searchCriteria: number[] | string
): Promise<any[]> {
    const messages = await client.fetch(searchCriteria, {
        envelope: true,
        source: true,
        uid: true
    });

    const messagesArray = [];
    for await (const msg of messages) {
        messagesArray.push(msg);
    }
    
    // Sort messages by UID to process them in order
    messagesArray.sort((a, b) => a.uid - b.uid);
    
    return messagesArray;
}

/**
 * Processes a batch of messages, handling errors and updating the last UID if necessary.
 * 
 * @param {any[]} messages - The array of messages to process.
 * @param {string} accountName - The name of the email account.
 * @param {(email: ParsedEmail) => void} onEmail - The callback to execute for each processed email.
 * @param {number} initialMaxUid - The initial maximum UID to start from. Defaults to 0.
 * @returns {Promise<{ processedCount: number; maxUid: number }>} A promise that resolves to the processing result.
 */
async function processMessageBatch(
    messages: any[],
    accountName: string,
    onEmail: (email: ParsedEmail) => void,
    initialMaxUid: number = 0
): Promise<{ processedCount: number; maxUid: number }> {
    let maxUid = initialMaxUid;
    let processedCount = 0;

    for (const msg of messages) {
        try {
            const email = await parseEmailMessage(msg.source!.toString(), accountName);
            await onEmail(email);
            processedCount++;

            if (msg.uid > maxUid) {
                maxUid = msg.uid;
            }
            
            log.info(`[${accountName}] Processed message UID: ${msg.uid}, Subject: ${email.subject}`);
        } catch (error) {
            log.error(`[${accountName}] Failed to process message UID ${msg.uid}:`, error);
            continue;
        }
    }

    return { processedCount, maxUid };
}

/**
 * Updates the last UID for an account if it has changed.
 * 
 * @param {string} accountName - The name of the email account.
 * @param {number} newMaxUid - The new maximum UID.
 * @param {number | null} currentLastUid - The current last UID or null if not set.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
async function updateLastUidIfNeeded(
    accountName: string,
    newMaxUid: number,
    currentLastUid: number | null
): Promise<void> {
    if (newMaxUid > (currentLastUid ?? 0)) {
        await writeLastUid(accountName, newMaxUid);
        log.info(`[${accountName}] Updated lastUid to: ${newMaxUid}`);
    }
}

/**
 * Main function to process messages with a date range filter.
 * 
 * @param {ImapFlow} client - The ImapFlow client instance.
 * @param {EmailAccountConfig} account - The email account configuration.
 * @param {(email: ParsedEmail) => void} onEmail - The callback to execute for each processed email.
 * @param {boolean} isStartup - Indicates if this is a startup sync. Defaults to false.
 * @param {DateRange} dateRange - The date range to filter messages by. Defaults to the last 7 days.
 */
export async function processMessages(
    client: ImapFlow,
    account: EmailAccountConfig,
    onEmail: (email: ParsedEmail) => void,
    isStartup: boolean = false,
    dateRange: DateRange = createDateRange(7),
) {
    const lock = await client.getMailboxLock('INBOX');
    
    try {
        const lastUid = await readLastUid(account.name);
        let searchResult: SearchResult;

        if (isStartup) {
            log.info(`[${account.name}] Startup sync: processing messages from date range`);
            searchResult = await buildStartupSearchCriteria(client, dateRange);
        } else {
            if (!lastUid) {
                log.error(`[${account.name}] No lastUid found for incremental sync, skipping`);
                return;
            }
            
            log.info(`[${account.name}] Incremental sync: processing messages with UID > ${lastUid} within date range`);
            searchResult = await buildIncrementalSearchCriteria(client, dateRange, lastUid);
        }

        if (searchResult.isEmpty) {
            log.info(`[${account.name}] No new messages to process`);
            return;
        }

        const messages = await fetchAndSortMessages(client, searchResult.criteria);
        log.info(`[${account.name}] Found ${messages.length} messages to process`);

        const { processedCount, maxUid } = await processMessageBatch(
            messages,
            account.name,
            onEmail,
            lastUid ?? 0
        );

        await updateLastUidIfNeeded(account.name, maxUid, lastUid);
        log.info(`[${account.name}] Processed ${processedCount} messages`);

    } finally {
        lock.release();
    }
}

/**
 * Utility function to create date ranges for common periods.
 */
export const DateRangePresets = {
    /**
     * Creates a date range for the last week.
     * @returns {DateRange} A date range object for the last week.
     */
    lastWeek: () => createDateRange(7),
    /**
     * Creates a date range for the last month.
     * @returns {DateRange} A date range object for the last month.
     */
    lastMonth: () => createDateRange(30),
    /**
     * Creates a date range for the last three months.
     * @returns {DateRange} A date range object for the last three months.
     */
    lastThreeMonths: () => createDateRange(90),
    /**
     * Creates a custom date range for a specified number of days.
     * 
     * @param {number} days - The number of days to go back from today.
     * @returns {DateRange} A date range object for the specified number of days.
     */
    custom: (days: number) => createDateRange(days)
};

/**
 * Starts the IMAP client and sets up event listeners for new messages.
 * 
 * @param {EmailAccountConfig} account - The email account configuration.
 * @param {(email: ParsedEmail) => void} onEmail - The callback to execute for each processed email.
 */
export async function startImapClient(
    account: EmailAccountConfig,
    onEmail: (email: ParsedEmail) => void
) {
    const client = await createImapClient(account)
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