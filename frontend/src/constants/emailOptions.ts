import { Email, MailboxFilters, MailboxLabels } from '@/types/email';
import { ArchiveIcon, InboxIcon, MailIcon, SendIcon } from 'lucide-react';


export const mailboxLabels: MailboxLabels = [
    { name: 'All', value: 'all', icon: InboxIcon },
    { name: 'Unread', value: 'unread', icon: MailIcon },
    { name: 'Sent', value: 'sent', icon: SendIcon },
    { name: 'Archive', value: 'archive', icon: ArchiveIcon },
];

export const mailboxFilters: MailboxFilters = [
    { name: 'All Status', value: 'All', circleColor: 'bg-blue-400' },
    { name: 'Interested', value: 'Interested', circleColor: 'bg-emerald-400' },
    { name: 'Meeting Booked', value: 'Meeting Booked', circleColor: 'bg-indigo-400' },
    { name: 'Out of Office', value: 'Out of Office', circleColor: 'bg-amber-400' },
    { name: 'Spam', value: 'Spam', circleColor: 'bg-gray-400' },
    { name: 'Not Interested', value: 'Not Interested', circleColor: 'bg-red-400' },
];

export const sampleEmails: Email[] = [
    {
        id: '1',
        subject: 'Welcome to the Platform!',
        from: 'support@example.com',
        to: ['user1@example.com'],
        text: 'Thank you for joining our platform. We are excited to have you!',
        html: '<p>Thank you for joining our platform. We are excited to have you!</p>',
        folder: 'Inbox',
        account: 'Account_1',
        date: '2024-06-01T09:00:00Z',
        category: 'Interested',
    },
    {
        id: '2',
        subject: 'Meeting Confirmation',
        from: 'meetings@company.com',
        to: ['user1@example.com'],
        text: 'Your meeting has been booked for June 5th at 10:00 AM.',
        html: '<p>Your meeting has been booked for June 5th at 10:00 AM.</p>',
        folder: 'Inbox',
        account: 'Account_1',
        date: '2024-06-02T14:30:00Z',
        category: 'Meeting Booked',
    },
    {
        id: '3',
        subject: 'Out of Office Auto-Reply',
        from: 'colleague@company.com',
        to: ['user1@example.com'],
        text: 'I am currently out of the office and will respond upon my return.',
        html: '<p>I am currently out of the office and will respond upon my return.</p>',
        folder: 'Inbox',
        account: 'Account_2',
        date: '2024-06-03T08:15:00Z',
        category: 'Out of Office',
    },
    {
        id: '4',
        subject: 'Special Offer Just for You!',
        from: 'promo@spammy.com',
        to: ['user1@example.com'],
        text: 'Congratulations! You have won a free cruise. Click here to claim.',
        html: '<p>Congratulations! You have won a free cruise. <a href="#">Click here</a> to claim.</p>',
        folder: 'Spam',
        account: 'Account_2',
        date: '2024-06-04T11:45:00Z',
        category: 'Spam',
    },
    {
        id: '5',
        subject: 'Thank you for your time',
        from: 'hr@company.com',
        to: ['user1@example.com'],
        text: 'We appreciate your interest, but we have decided to move forward with other candidates.',
        html: '<p>We appreciate your interest, but we have decided to move forward with other candidates.</p>',
        folder: 'Inbox',
        account: 'Account_1',
        date: '2024-06-05T16:20:00Z',
        category: 'Not Interested',
    },
];