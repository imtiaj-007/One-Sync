import { getAIModel } from './geminiClient.js';
import { EmailCategory } from './types.js';

/**
 * Categorizes an email based on its content using an AI model.
 * 
 * This function takes the text content of an email and uses an AI model to categorize it into one of the following categories:
 * - Interested
 * - Meeting Booked
 * - Out of Office
 * - Not Interested
 * - Promotion
 * - Social
 * - Spam
 * 
 * It constructs a prompt for the AI model, sends it to the model, and then processes the response to determine the category.
 * 
 * @param {string} text - The text content of the email to be categorized.
 * @returns {Promise<EmailCategory>} A promise that resolves to the category of the email.
 */
export async function categorizeEmailAI(text: string): Promise<EmailCategory> {
    const prompt = `
You are an email assistant. Categorize the following email content into one of these categories:
- Interested
- Meeting Booked
- Out of Office
- Not Interested
- Promotion
- Social
- Spam

Respond with only the category name (no explanations).

---

Email Content:
${text}
`;
    try {
        const geminiClient = await getAIModel();
        const result = await geminiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        const response = result.text;
        if (!response) {
            throw new Error(`No category response from model: "${response}"`);
        }

        const validCategories: EmailCategory[] = [
            'Interested',
            'Not Interested',
            'Meeting Booked',
            'Out of Office',
            'Promotion',
            'Social',
            'Spam',
        ];

        const match = validCategories.find(
            (cat) => response.toLowerCase() === cat.toLowerCase()
        );

        if (!match) {
            throw new Error(`Unexpected category response: "${response}"`);
        }
        return match;

    } catch (error) {
        throw new Error(
            `Failed to categorize email: ${error instanceof Error
                ? error.message
                : String(error)
            }`
        );
    }
}
