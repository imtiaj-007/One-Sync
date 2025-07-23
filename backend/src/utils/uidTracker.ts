import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UID_FILE = path.join(__dirname, 'lastUids.json');
const TEMP_FILE = path.join(__dirname, 'lastUids.json.tmp');

interface UidMap {
    [accountName: string]: number;
}

// In-memory cache to reduce file I/O
let uidCache: UidMap | null = null;
let lastFileRead = 0;

// Mutex to prevent concurrent file operations
let writeMutex = Promise.resolve();

/**
 * Ensures the UID file directory exists
 */
async function ensureDirectory(): Promise<void> {
    const dir = path.dirname(UID_FILE);
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch (error) {
        // Directory might already exist, ignore EEXIST errors
        if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
            throw error;
        }
    }
}

/**
 * Loads UIDs from file with caching
 */
async function loadUids(): Promise<UidMap> {
    try {
        const stats = await fs.stat(UID_FILE);
        const fileModTime = stats.mtime.getTime();
        
        // Use cache if file hasn't changed
        if (uidCache && fileModTime <= lastFileRead) {
            return uidCache;
        }
        
        const data = await fs.readFile(UID_FILE, 'utf-8');
        const uids: UidMap = JSON.parse(data);
        
        // Validate the data
        if (typeof uids !== 'object' || uids === null) {
            throw new Error('Invalid UID file format');
        }
        
        // Validate all UIDs are positive numbers
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
            // File doesn't exist, return empty map
            uidCache = {};
            lastFileRead = Date.now();
            return {};
        }
        throw error;
    }
}

/**
 * Saves UIDs to file atomically
 */
async function saveUids(uids: UidMap): Promise<void> {
    await ensureDirectory();
    
    const data = JSON.stringify(uids, null, 2);
    
    // Write to temporary file first, then rename (atomic operation)
    await fs.writeFile(TEMP_FILE, data, 'utf-8');
    await fs.rename(TEMP_FILE, UID_FILE);
    
    // Update cache
    uidCache = { ...uids };
    lastFileRead = Date.now();
}

/**
 * Reads the last UID for a specific account
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
 * Writes the last UID for a specific account
 */
export async function writeLastUid(accountName: string, uid: number): Promise<void> {
    if (!accountName || typeof accountName !== 'string') {
        throw new Error('Account name must be a non-empty string');
    }
    
    if (typeof uid !== 'number' || uid < 0 || !Number.isInteger(uid)) {
        throw new Error(`UID must be a positive integer, got: ${uid}`);
    }
    
    // Use mutex to prevent concurrent writes
    writeMutex = writeMutex.then(async () => {
        try {
            const uids = await loadUids();
            
            // Only write if UID has actually changed
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
 * Gets all stored UIDs
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
 * Removes UID tracking for a specific account
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
 * Clears all UID data (useful for testing)
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