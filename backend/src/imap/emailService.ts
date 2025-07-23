import { getEmailAccounts } from './config.js';
import { startImapClient } from './imapClient.js';
import { ParsedEmail } from './types.js';

import { indexEmail, ensureEmailIndexExists, emailExists } from '../elastic/emailIndex.js';
import { notifyInterestedEmail } from '../slack/notify.js';
import { categorizeEmailAI } from '../ai/classifier.js';
import { EmailDocument } from '../elastic/types.js';
import { EmailCategory } from '../ai/types.js';
import { log } from '../utils/logger.js';


const processedEmails = new Set<string>();
const MAX_CACHE_SIZE = 1000;


export async function startEmailSync() {
    try {
        await ensureEmailIndexExists();
        const emailAccounts = getEmailAccounts();

        for (const account of emailAccounts) {
            if (!account.user || !account.password) 
                throw new Error('Missing email credentials');

            try {
                await startImapClient(account, async (email: ParsedEmail) => {
                    await processEmail(email);
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

async function processEmail(email: ParsedEmail) {
    const emailId = email.messageId;
    if (processedEmails.has(emailId)) {
        log.warn(`[${email.account}] Email already processed (in cache): ${email.subject}`);
        return;
    }

    try {
        const exists = await emailExists(emailId);
        if (exists) {
            log.info(`[${email.account}] Email already indexed: ${email.subject}`);
            addToProcessedCache(emailId);
            return;
        }
    } catch (error) {
        log.error(`Failed to check if email exists: ${error instanceof Error 
            ? error.message 
            : String(error)}`
        );
    }
    log.info(`[${email.account}] Processing new email: ${email.subject}`);
    
    let category: EmailCategory = 'Spam';    
    try {
        category = await categorizeEmailAI(email.subject + '\n' + email.text);
        log.info(`[${email.account}] Email categorized as: ${category}`);
    } catch (error) {
        log.error(`Failed to categorize email: ${error instanceof Error 
            ? error.message 
            : String(error)}`
        );
    }

    const doc: EmailDocument = {
        id: emailId,
        subject: email.subject,
        from: email.from,
        to: email.to,
        text: email.text,
        html: email.html,
        folder: 'INBOX',
        account: email.account,
        date: email.date.toISOString(),
        category: category
    };

    try {
        await indexEmail(doc);
        log.info(`[${email.account}] Indexed to Elastic`);
        addToProcessedCache(emailId);

        if (category === 'Interested') {
            await notifyInterestedEmail(doc);
            log.info(`[${email.account}] Notified interested parties about email: ${email.subject}`);
        }

    } catch (indexErr) {
        log.error('Failed to index email:', indexErr);
        throw indexErr;
    }
}

function addToProcessedCache(emailId: string) {
    processedEmails.add(emailId);
    
    if (processedEmails.size > MAX_CACHE_SIZE) {
        const entries = Array.from(processedEmails);
        const toRemove = entries.slice(0, entries.length - MAX_CACHE_SIZE + 100);
        toRemove.forEach(id => processedEmails.delete(id));
    }
}