import express from 'express';
import { searchEmails } from '../elastic/emailIndex.js';

const router = express.Router();

/**
 * Handles searching emails with various filters.
 *
 * @route GET /api/search
 * @group Search
 * @summary Search emails with filters
 * @param {string} [q] - Full-text search query. Matches against subject, text, and html fields.
 * @param {string} [from] - Sender email address to filter by.
 * @param {string} [to] - Receiver email address to filter by.
 * @param {string} [category] - Email category (e.g., "Interested", "Spam", etc.).
 * @param {string} [folder] - Email folder to filter by (e.g., "Inbox", "Spam").
 * @param {string} [account] - Email account identifier to filter by.
 * @param {string} [startDate] - Start date (ISO 8601 string) for filtering emails by date.
 * @param {string} [endDate] - End date (ISO 8601 string) for filtering emails by date.
 * @returns {object} 200 - An array of email documents matching the search criteria.
 * @returns {object} 500 - Internal Server Error
 * @example
 * // GET /api/search?q=meeting&from=alice@example.com&category=Interested
 * // Returns emails matching the query "meeting" from Alice in the "Interested" category.
 */
router.get('/', async (req, res) => {
    try {
        const {
            q,
            from,
            to,
            category,
            folder,
            account,
            startDate,
            endDate
        } = req.query;

        const result = await searchEmails({
            q: q as string,
            from: from as string,
            to: to as string,
            category: category as string,
            folder: folder as string,
            account: account as string,
            startDate: startDate as string,
            endDate: endDate as string,
        });

        res.json(result);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
