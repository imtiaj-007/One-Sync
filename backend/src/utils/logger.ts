/**
 * Logger utility for logging messages at different levels.
 * 
 * This utility provides methods for logging messages at different levels of severity, including debug, info, warn, and error.
 * Each method logs a message to the console with a prefix indicating the level of the message.
 * 
 * @example
 * log.debug('This is a debug message');
 * log.info('This is an info message');
 * log.warn('This is a warning message');
 * log.error('This is an error message');
 */
export const log = {
    /**
     * Logs a message at the debug level.
     * 
     * @param {...any[]} args - The arguments to log. These can be any type of value.
     */
    debug: (...args: any[]) => console.debug('[DEBUG]', ...args),
    /**
     * Logs a message at the info level.
     * 
     * @param {...any[]} args - The arguments to log. These can be any type of value.
     */
    info: (...args: any[]) => console.log('[INFO]', ...args),
    /**
     * Logs a message at the warn level.
     * 
     * @param {...any[]} args - The arguments to log. These can be any type of value.
     */
    warn: (...args: any[]) => console.warn('[WARN]', ...args),
    /**
     * Logs a message at the error level.
     * 
     * @param {...any[]} args - The arguments to log. These can be any type of value.
     */
    error: (...args: any[]) => console.error('[ERROR]', ...args),
};
