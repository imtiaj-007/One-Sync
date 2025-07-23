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
