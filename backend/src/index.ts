/**
 * @file Entry point for the OneSync backend service.
 * 
 * This file initializes environment variables, sets up the Express server,
 * configures middleware, defines base and health check routes, and starts
 * the email synchronization service.
 */

import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { startEmailSync } from './imap/emailService.js'
import searchRoutes from './routes/search.js';

/**
 * Express application instance.
 */
const app = express();

/**
 * The port on which the server will listen.
 * Defaults to 8000 if not specified in environment variables.
 */
const PORT = process.env.PORT || 8000;

/**
 * Middleware configuration:
 * - Parses incoming JSON requests with a 2MB limit.
 * - Enables CORS with configurable origin and credentials.
 */
app.use(express.json({ limit: '2mb' }));
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

/**
 * Base route.
 * 
 * @route GET /
 * @returns {string} Confirmation message that the backend is running.
 */
app.get('/', (_req, res) => {
    res.send('OneSync Backend is running ✅');
});

/**
 * Health check route.
 * 
 * @route GET /health
 * @returns {object} JSON object with status 'ok'.
 */
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

/**
 * Registers the search routes for email search functionality.
 * 
 * @route /api/search
 * @group Search
 * 
 * This route handles searching emails with various filters such as query, sender, recipient, category, folder, account, and date range.
 * All search-related endpoints are mounted under the /api/search path.
 */
app.use('/api/search', searchRoutes);

/**
 * Initializes and starts the backend services.
 *
 * This function performs the following:
 * - Starts the Express server on the configured port.
 * - Initiates the email synchronization service.
 *
 * If any error occurs during startup, it logs the error and exits the process.
 *
 * @async
 * @function main
 * @returns {Promise<void>} Resolves when the server and email sync service are started.
 */
async function main(): Promise<void> {
    try {
        app.listen(PORT, () => {
            console.log(`🚀 Express server is running at Port:${PORT}`);
        });
        await startEmailSync();
        console.log('📬 Email sync service started successfully');
    } catch (error) {
        console.error('❌ Failed to start services:', error);
        process.exit(1);
    }
}

/**
 * Entry point for starting the backend service.
 */
main();