import * as dotenv from 'dotenv';
dotenv.config();

import { startEmailSync } from './imap/emailService.js'

/**
 * Initializes the application by starting the email synchronization service.
 * 
 * This function attempts to start the email synchronization service. If the service starts successfully, it logs a success message to the console. If the service fails to start, it logs an error message to the console and exits the process with a status code of 1.
 */
async function bootstrap() {        
    try {
        await startEmailSync();
        console.log('Email sync service started successfully');
    } catch (error) {
        console.error('Failed to start email sync service:', error);
        process.exit(1);
    }
}

/**
 * Entry point of the application.
 * 
 * This function is the entry point of the application. It calls the bootstrap function to initialize the application.
 */
bootstrap();