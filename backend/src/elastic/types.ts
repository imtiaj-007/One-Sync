import { EmailCategory } from "@/ai/types.js";

export interface EmailDocument {
    id: string;
    subject: string;
    from: string;
    to: string[];
    text: string;
    html?: string;
    folder: string;
    account: string;
    date: string;
    category: EmailCategory;
}
