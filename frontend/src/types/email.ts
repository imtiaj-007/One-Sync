export type EmailCategory =
    | 'Interested'
    | 'Meeting Booked'
    | 'Out of Office'
    | 'Spam'
    | 'Not Interested';

export type Email = {
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
};