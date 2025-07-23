import { GoogleGenAI } from "@google/genai";

let _geminiClient: GoogleGenAI | null = null;

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
