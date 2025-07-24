import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Converts a file URL to a file path.
 * 
 * This function is used to convert the URL of the current file to a file path.
 * 
 * @returns {string} The file path of the current file.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Defines the path to the last UIDs file.
 * 
 * This constant specifies the file path where the last UIDs are stored.
 */
const UID_FILE = path.join(__dirname, 'lastUids.json');
/**
 * Defines the path to the temporary file used for atomic file operations.
 * 
 * This constant specifies the file path used for temporary storage during atomic file operations.
 */
const TEMP_FILE = path.join(__dirname, 'lastUids.json.tmp');

/**
 * Represents a map of account names to their corresponding UIDs.
 * 
 * This interface defines a map where the keys are account names and the values are their corresponding UIDs.
 */
interface UidMap {
    [accountName: string]: number;
}

/**
 * Caches the last read UIDs.
 * 
 * This variable stores the last read UIDs from the file to improve performance by reducing the need for file reads.
 */
let uidCache: UidMap | null = null;
/**
 * Stores the last time the UID file was read.
 * 
 * This variable keeps track of the last time the UID file was read to determine if the cache is stale.
 */
let lastFileRead = 0;

/**
 * Manages write operations to ensure they are executed sequentially.
 * 
 * This variable is used to manage write operations to the UID file, ensuring that they are executed one after the other to prevent data corruption.
 */
let writeMutex = Promise.resolve();

/**
 * Ensures the directory for the UID file exists.
 * 
 * This function checks if the directory for the UID file exists and creates it if it does not.
 * 
 * @returns {Promise<void>} A promise that resolves when the directory is ensured.
 */
async function ensureDirectory(): Promise<void> {
    const dir = path.dirname(UID_FILE);
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
            throw error;
        }
    }
}

/**
 * Loads UIDs from the file with caching.
 * 
 * This function loads UIDs from the file and caches them for future use. It checks if the cache is stale based on the file modification time.
 * 
 * @returns {Promise<UidMap>} A promise that resolves to the loaded UIDs.
 */
async function loadUids(): Promise<UidMap> {
    try {
        const stats = await fs.stat(UID_FILE);
        const fileModTime = stats.mtime.getTime();
        
        if (uidCache && fileModTime <= lastFileRead) {
            return uidCache;
        }
        
        const data = await fs.readFile(UID_FILE, 'utf-8');
        const uids: UidMap = JSON.parse(data);
        
        if (typeof uids !== 'object' || uids === null) {
            throw new Error('Invalid UID file format');
        }
        
        for (const [account, uid] of Object.entries(uids)) {
            if (typeof uid !== 'number' || uid < 0 || !Number.isInteger(uid)) {
                throw new Error(`Invalid UID for account ${account}: ${uid}`);
            }
        }        
        uidCache = uids;
        lastFileRead = fileModTime;
        return uids;

    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            uidCache = {};
            lastFileRead = Date.now();
            return {};
        }
        throw error;
    }
}

/**
 * Saves UIDs to the file atomically.
 * 
 * This function saves UIDs to the file in an atomic manner to ensure data integrity. It first writes to a temporary file and then renames it to the actual file.
 * 
 * @param {UidMap} uids - The UIDs to save to the file.
 * @returns {Promise<void>} A promise that resolves when the UIDs are saved.
 */
async function saveUids(uids: UidMap): Promise<void> {
    await ensureDirectory();
    const data = JSON.stringify(uids, null, 2);
    
    await fs.writeFile(TEMP_FILE, data, 'utf-8');
    await fs.rename(TEMP_FILE, UID_FILE);

    uidCache = { ...uids };
    lastFileRead = Date.now();
}

/**
 * Reads the last UID for a specific account.
 * 
 * This function reads the last UID for a given account name from the cached UIDs or the file if the cache is stale.
 * 
 * @param {string} accountName - The name of the account to read the last UID for.
 * @returns {Promise<number | null>} A promise that resolves to the last UID for the account, or null if the account does not exist.
 */
export async function readLastUid(accountName: string): Promise<number | null> {
    if (!accountName || typeof accountName !== 'string') {
        throw new Error('Account name must be a non-empty string');
    }
    
    try {
        const uids = await loadUids();
        return uids[accountName] || null;
    } catch (error) {
        console.error(`Error reading UID for account ${accountName}:`, error);
        return null;
    }
}

/**
 * Writes the last UID for a specific account.
 * 
 * This function writes the last UID for a given account name. It ensures that the write operation is executed sequentially to prevent data corruption.
 * 
 * @param {string} accountName - The name of the account to write the last UID for.
 * @param {number} uid - The last UID to write for the account.
 * @returns {Promise<void>} A promise that resolves when the UID is written.
 */
export async function writeLastUid(accountName: string, uid: number): Promise<void> {
    if (!accountName || typeof accountName !== 'string') {
        throw new Error('Account name must be a non-empty string');
    }
    
    if (typeof uid !== 'number' || uid < 0 || !Number.isInteger(uid)) {
        throw new Error(`UID must be a positive integer, got: ${uid}`);
    }
    
    writeMutex = writeMutex.then(async () => {
        try {
            const uids = await loadUids();            
            if (uids[accountName] === uid) {
                return;
            }            
            uids[accountName] = uid;
            await saveUids(uids);
        } catch (error) {
            console.error(`Error writing UID for account ${accountName}:`, error);
            throw error;
        }
    });
    
    await writeMutex;
}

/**
 * Gets all stored UIDs.
 * 
 * This function retrieves all stored UIDs from the cache or the file if the cache is stale.
 * 
 * @returns {Promise<UidMap>} A promise that resolves to all stored UIDs.
 */
export async function getAllUids(): Promise<UidMap> {
    try {
        return await loadUids();
    } catch (error) {
        console.error('Error reading all UIDs:', error);
        return {};
    }
}

/**
 * Removes UID tracking for a specific account.
 * 
 * This function removes the UID tracking for a given account name. It ensures that the operation is executed sequentially to prevent data corruption.
 * 
 * @param {string} accountName - The name of the account to remove the UID tracking for.
 * @returns {Promise<void>} A promise that resolves when the account's UID tracking is removed.
 */
export async function removeAccount(accountName: string): Promise<void> {
    if (!accountName || typeof accountName !== 'string') {
        throw new Error('Account name must be a non-empty string');
    }
    
    writeMutex = writeMutex.then(async () => {
        try {
            const uids = await loadUids();
            delete uids[accountName];
            await saveUids(uids);
        } catch (error) {
            console.error(`Error removing account ${accountName}:`, error);
            throw error;
        }
    });
    
    await writeMutex;
}

/**
 * Clears all UID data.
 * 
 * This function clears all UID data by writing an empty object to the file. It is useful for testing purposes.
 * 
 * @returns {Promise<void>} A promise that resolves when all UID data is cleared.
 */
export async function clearAllUids(): Promise<void> {
    writeMutex = writeMutex.then(async () => {
        try {
            await saveUids({});
        } catch (error) {
            console.error('Error clearing all UIDs:', error);
            throw error;
        }
    });
    
    await writeMutex;
}