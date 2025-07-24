import React from 'react'
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Email } from '@/types/email';


function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function getCategoryColors(category: Email['category']) {
    switch (category) {
        case 'Interested':
            return 'bg-emerald-100 dark:bg-emerald-200 text-emerald-700 dark:text-emerald-800';
        case 'Meeting Booked':
            return 'bg-indigo-100 dark:bg-indigo-200 text-indigo-700 dark:text-indigo-800';
        case 'Out of Office':
            return 'bg-amber-100 dark:bg-amber-200 text-amber-700 dark:text-amber-800';
        case 'Spam':
            return 'bg-gray-100 dark:bg-gray-200 text-gray-700 dark:text-gray-800';
        case 'Not Interested':
            return 'bg-red-100 dark:bg-red-200 text-red-700 dark:text-red-700';
        default:
            return 'bg-gray-100 dark:bg-gray-200 text-gray-700 dark:text-gray-800';
    }
}


const MailCard: React.FC<{ email: Email }> = ({ email }) => {

    const handleClick = () => {
        // TODO: Implement select/open mail logic
    };

    return (
        <Card className='gap-1 p-2.5 rounded-sm' >
            <p className="font-semibold flex justify-between items-center text-sm text-gray-900 dark:text-gray-100 truncate">
                {email.subject}
                <Badge variant="outline" className={getCategoryColors(email.category)}>{email.category}</Badge>
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{email.text}</p>
            <p className='text-xs text-end'>{formatDate(email.date)}</p>
        </Card>
    );
};

export default MailCard;
