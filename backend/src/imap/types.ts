export interface DateRange {
    since?: Date;
    before?: Date;
}

export interface SearchResult {
    criteria: number[] | string;
    isEmpty: boolean;
}

export type EmailAccountConfig = {
    user: string;
    password: string;
    host: string;
    port: number;
    tls: boolean;
    name: string;
    maxMessages?: number;
    dateRange?: DateRange,
    folders?: string[];
    fetchOnStartup?: boolean;
};

export interface ParsedEmail {
    subject: string;
    from: string;
    to: string[];
    date: Date;
    text: string;
    html?: string;
    messageId: string;
    account: string;
}
