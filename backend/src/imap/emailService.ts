import { getEmailAccounts } from './config.js';
import { startImapClient } from './imapClient.js';
import { ParsedEmail } from './types.js';
import { log } from '../utils/logger.js';


export async function startEmailSync() {
    try {
        const emailAccounts = getEmailAccounts();
        
        for (const account of emailAccounts) {
            if (!account.user || !account.password) {
                throw new Error('Missing email credentials');
            }
            try {
                await startImapClient(account, (email: ParsedEmail) => {
                    log.info(`[${email.account}] New Email: ${email.subject}`);
                    // TODO: Push to DB, Elasticsearch, queue, etc.
                });
            } catch (err) {
                log.error(`Error starting IMAP client for account ${account.name}:`, err);
                continue;
            }
        }
    } catch (err) {
        log.error('Error in email sync service:', err);
        throw err;
    }
}
