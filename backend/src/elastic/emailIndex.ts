import { elasticClient } from './client.js';
import { EmailDocument, SearchFilters } from './types.js';
import { log } from '../utils/logger.js';

/**
 * The name of the Elasticsearch index for emails.
 */
const INDEX_NAME = 'emails';

/**
 * Ensures the email index exists in Elasticsearch.
 * 
 * This function checks if the email index exists in Elasticsearch. If it does not exist, it creates the index with the specified mappings.
 * 
 * @returns {Promise<void>} A promise that resolves when the index exists.
 */
export async function ensureEmailIndexExists() {
    const exists = await elasticClient.indices.exists({ index: INDEX_NAME });
    if (!exists) {
        await elasticClient.indices.create({
            index: INDEX_NAME,
            mappings: {
                properties: {
                    subject: { type: 'text' },
                    from: { type: 'keyword' },
                    to: { type: 'keyword' },
                    text: { type: 'text' },
                    html: { type: 'text' },
                    folder: { type: 'keyword' },
                    account: { type: 'keyword' },
                    date: { type: 'date' },
                    category: { type: 'keyword' }
                }
            }
        });
    }
}

/**
 * Indexes an email document in Elasticsearch.
 * 
 * This function indexes a given email document in the email index.
 * 
 * @param {EmailDocument} email - The email document to index.
 * @returns {Promise<void>} A promise that resolves when the email is indexed.
 */
export async function indexEmail(email: EmailDocument) {
    await elasticClient.index({
        index: INDEX_NAME,
        id: email.id,
        document: email,
    });
}

/**
 * Checks if an email exists in Elasticsearch.
 * 
 * This function checks if an email with the given ID exists in the email index.
 * 
 * @param {string} emailId - The ID of the email to check.
 * @returns {Promise<boolean>} A promise that resolves to true if the email exists, false otherwise.
 */
export async function emailExists(emailId: string): Promise<boolean> {
    try {
        const response = await elasticClient.exists({
            index: INDEX_NAME,
            id: emailId
        });
        return response;

    } catch (error) {
        if (error instanceof Error && 'status' in error && error.status === 404) return false;
        log.error(`Error checking if email exists: ${error instanceof Error
            ? error.message :
            String(error)}`
        );
        throw error;
    }
}

/**
 * Clears the email index from Elasticsearch.
 * 
 * This function deletes the email index from Elasticsearch.
 * 
 * @returns {Promise<any>} A promise that resolves to the response from Elasticsearch.
 */
export async function clearEmailIndex() {
    try {
        const indexName = 'emails';
        const response = await elasticClient.indices.delete({
            index: indexName,
        });
        log.info(`Deleted Elasticsearch index: ${indexName}`);
        return response;
    } catch (error) {
        if (error instanceof Error && error.message.includes('index_not_found_exception')) {
            log.error('Index does not exist; nothing to delete.');
        } else {
            log.error('Failed to delete Elasticsearch index:', error);
            throw error;
        }
    }
}

export async function searchEmails(filters: SearchFilters) {
    const must: any[] = [];

    if (filters.q && filters.q.trim()) {
        must.push({
            multi_match: {
                query: filters.q,
                fields: ['subject^2', 'text', 'html'],
                fuzziness: 'AUTO',
            }
        });
    }

    if (filters.from) {
        must.push({
            bool: {
                should: [
                    { term: { 'from.keyword': filters.from } },
                    { match: { from: filters.from } }
                ],
                minimum_should_match: 1
            }
        });
    }

    if (filters.to) {
        must.push({
            bool: {
                should: [
                    { term: { 'to.keyword': filters.to } },
                    { match: { to: filters.to } }
                ],
                minimum_should_match: 1
            }
        });
    }

    if (filters.category) {
        must.push({
            bool: {
                should: [
                    { term: { 'category.keyword': filters.category } },
                    { match: { category: filters.category } }
                ],
                minimum_should_match: 1
            }
        });
    }

    if (filters.folder) {
        must.push({
            bool: {
                should: [
                    { term: { 'folder.keyword': filters.folder } },
                    { match: { folder: filters.folder } }
                ],
                minimum_should_match: 1
            }
        });
    }

    if (filters.account) {
        must.push({
            bool: {
                should: [
                    { term: { 'account.keyword': filters.account } },
                    { match: { account: filters.account } }
                ],
                minimum_should_match: 1
            }
        });
    }

    if (filters.startDate || filters.endDate) {
        const dateRange: any = {};
        
        if (filters.startDate) {
            dateRange.gte = filters.startDate;
        }
        
        if (filters.endDate) {
            dateRange.lte = filters.endDate;
        }

        must.push({
            range: {
                date: dateRange
            }
        });
    }

    if (must.length === 0) {
        must.push({ match_all: {} });
    }

    try {
        const response = await elasticClient.search({
            index: INDEX_NAME,
            size: 100,
            query: {
                bool: {
                    must
                }
            },
            sort: [
                { date: { order: 'desc' } }
            ]
        });

        return {
            total: response.hits.total,
            emails: response.hits.hits.map((hit: any) => ({
                id: hit._id,
                score: hit._score,
                ...hit._source,
            }))
        };

    } catch (error: unknown) {
        console.error('Elasticsearch search error:', error);
        throw new Error(`Search failed: ${error instanceof Error 
            ? error.message
            : "Uncaught error in searchEmails."}`
        );
    }
}