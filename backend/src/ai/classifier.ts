import { getAIModel } from './geminiClient.js';
import { EmailCategory } from './types.js';


export async function categorizeEmailAI(text: string): Promise<EmailCategory> {
    const prompt = `
You are an email assistant. Categorize the following email content into one of these categories:
- Interested
- Meeting Booked
- Not Interested
- Spam
- Out of Office

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
