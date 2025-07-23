import * as dotenv from 'dotenv';
dotenv.config();

import { startEmailSync } from './imap/emailService.js'

async function bootstrap() {        
    try {
        await startEmailSync();
        console.log('Email sync service started successfully');
    } catch (error) {
        console.error('Failed to start email sync service:', error);
        process.exit(1);
    }
}

bootstrap();