export type EmailCategory =
    | 'Interested'
    | 'Meeting Booked'
    | 'Out of Office'
    | 'Not Interested'
    | 'Promotion'
    | 'Social'
    | 'Spam'

export type StatusFilter = EmailCategory | 'All';
export type LabelFilter = 'all' | 'unread' | 'sent' | 'archive';

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

export interface Filters {
    name: string;
    value: StatusFilter;
    circleColor: string;
};

export type MailboxFilters = Filters[];

export interface Labels {
    name: string;
    value: LabelFilter;
    icon: React.ElementType;
};

export type MailboxLabels = Labels[];