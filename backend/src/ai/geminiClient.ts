import { GoogleGenAI } from "@google/genai";

/**
 * Represents the singleton instance of the Gemini client.
 * 
 * This variable holds the singleton instance of the Gemini client. It is initially set to null and is lazily initialized when the getAIModel function is called.
 */
let _geminiClient: GoogleGenAI | null = null;

/**
 * Retrieves the singleton instance of the Gemini client.
 * 
 * This function returns the singleton instance of the Gemini client. If the instance is not already created, it attempts to create a new instance using the GEMINI_API_KEY environment variable. If the environment variable is not set or if there's an error during initialization, it throws an error.
 * 
 * @returns {Promise<GoogleGenAI>} A promise that resolves to the singleton instance of the Gemini client.
 * @throws {Error} Throws an error if the GEMINI_API_KEY environment variable is not set or if there's an error during initialization.
 */
export async function getAIModel(): Promise<GoogleGenAI> {
    if (!_geminiClient) {
        try {
            if (!process.env.GEMINI_API_KEY) {
                throw new Error('GEMINI_API_KEY environment variable is not set');
            }
            _geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        } catch (error) {
            throw new Error(
                `Failed to initialize Gemini model: ${error instanceof Error
                    ? error.message
                    : String(error)
                }`
            );
        }
    }
    return _geminiClient;
}
