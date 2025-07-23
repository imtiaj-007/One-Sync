export type EmailAccountConfig = {
    user: string;
    password: string;
    host: string;
    port: number;
    tls: boolean;
    name: string;
    maxMessages?: number;
    dateRange?: {
        since?: string;
        before?: string;
    },
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
