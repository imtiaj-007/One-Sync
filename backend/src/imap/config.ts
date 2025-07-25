import { EmailAccountConfig } from "./types.js";

/**
 * Object containing environment variable keys for email account configurations
 */
export const ACCOUNT_KEYS = {
    EMAIL_USER_1: 'EMAIL_USER_1',
    EMAIL_PASS_1: 'EMAIL_PASS_1',
    EMAIL_USER_2: 'EMAIL_USER_2',
    EMAIL_PASS_2: 'EMAIL_PASS_2',
} as const;

/**
 * Type representing the keys of ACCOUNT_KEYS object
 */
export type AccountKeys = keyof typeof ACCOUNT_KEYS;

/**
 * Configures email accounts by reading from environment variables
 * @returns {EmailAccountConfig[]} Array of configured email accounts
 * @throws {Error} When environment is not initialized or account configuration fails
 */
function configEmailAccounts(): EmailAccountConfig[] {
    if (!process.env) {
        throw new Error("Env is not initialized");
    }

    let accounts: EmailAccountConfig[] = [];

    try {
        accounts = accounts.concat([
            {
                name: 'Account 1',
                user: process.env[ACCOUNT_KEYS.EMAIL_USER_1] as string,
                password: process.env[ACCOUNT_KEYS.EMAIL_PASS_1] as string,
                host: 'imap.gmail.com',
                port: 993,
                tls: true,
                folders: ['INBOX'],
                fetchOnStartup: true,
            },
            {
                name: 'Account 2',
                user: process.env[ACCOUNT_KEYS.EMAIL_USER_2] as string,
                password: process.env[ACCOUNT_KEYS.EMAIL_PASS_2] as string,
                host: 'imap.gmail.com',
                port: 993,
                tls: true,
                folders: ['INBOX'],
                fetchOnStartup: true,
            }
        ]);

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

/**
 * Gets the configured email accounts, initializing them if not already done
 * @returns {EmailAccountConfig[]} Array of configured email accounts
 */
export function getEmailAccounts(): EmailAccountConfig[] {
    if (!_emailAccounts) {
        _emailAccounts = configEmailAccounts();
    }
    return _emailAccounts;
};
