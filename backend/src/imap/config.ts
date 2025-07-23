import { EmailAccountConfig } from "./types.js";

export const ACCOUNT_KEYS = {
    EMAIL_USER_1: 'EMAIL_USER_1',
    EMAIL_PASS_1: 'EMAIL_PASS_1',
    EMAIL_USER_2: 'EMAIL_USER_2',
    EMAIL_PASS_2: 'EMAIL_PASS_2',
} as const;

export type AccountKeys = keyof typeof ACCOUNT_KEYS;


function configEmailAccounts(): EmailAccountConfig[] {
    if (!process.env) {
        throw new Error("Env is not initialized");
    }

    const accounts: EmailAccountConfig[] = [];

    try {
        accounts.push({
            name: 'Account 1',
            user: process.env[ACCOUNT_KEYS.EMAIL_USER_1]!,
            password: process.env[ACCOUNT_KEYS.EMAIL_PASS_1]!,
            host: 'imap.gmail.com',
            port: 993,
            tls: true,

            maxMessages: 5,
            dateRange: {
                since: '2025-07-21',
                before: '2025-07-24'
            },
            folders: ['INBOX'],
            fetchOnStartup: true,
        });

        if (accounts.length === 0) {
            throw new Error('No valid email accounts configured');
        }

        return accounts;
    } catch (error) {
        throw new Error(`Failed to initialize email accounts: ${error instanceof Error
                ? error.message
                : String(error)
            }`
        );
    }
}

let _emailAccounts: EmailAccountConfig[] | null = null;

export function getEmailAccounts(): EmailAccountConfig[] {
    if (!_emailAccounts) {
        _emailAccounts = configEmailAccounts();
    }
    return _emailAccounts;
};
