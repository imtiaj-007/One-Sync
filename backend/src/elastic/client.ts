/**
 * Imports the Client class from the '@elastic/elasticsearch' package.
 * 
 * This import is used to create a new instance of the Client class.
 */
import { Client } from '@elastic/elasticsearch';

/**
 * Creates a new instance of the Client class.
 * 
 * This instance is created with the node option set to 'http://localhost:9200'.
 */
export const elasticClient = new Client({
    node: 'http://localhost:9200',
});
