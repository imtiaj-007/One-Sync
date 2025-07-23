import { elasticClient } from './client.js';
import { EmailDocument } from './types.js';
import { log } from '../utils/logger.js';

const INDEX_NAME = 'emails';

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

export async function indexEmail(email: EmailDocument) {
    await elasticClient.index({
        index: INDEX_NAME,
        id: email.id,
        document: email,
    });
}

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