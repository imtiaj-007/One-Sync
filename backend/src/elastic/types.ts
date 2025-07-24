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

export interface SearchFilters {
    q?: string;
    from?: string;
    to?: string;
    category?: string;
    folder?: string;
    account?: string;
    startDate?: string;
    endDate?: string;
}