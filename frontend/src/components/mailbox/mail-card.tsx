import React from 'react'
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useEmailStore } from '@/store/emailStore';
import { Email } from '@/types/email';
import { cn } from '@/lib/utils';


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
        case 'Promotion':
            return 'bg-pink-100 dark:bg-pink-200 text-pink-700 dark:text-pink-800';
        case 'Social':
            return 'bg-blue-100 dark:bg-blue-200 text-blue-700 dark:text-blue-800';
        case 'Spam':
            return 'bg-gray-100 dark:bg-gray-200 text-gray-700 dark:text-gray-800';
        case 'Not Interested':
            return 'bg-red-100 dark:bg-red-200 text-red-700 dark:text-red-700';
        default:
            return 'bg-gray-100 dark:bg-gray-200 text-gray-700 dark:text-gray-800';
    }
}


const MailCard: React.FC<{ email: Email }> = ({ email }) => {
    const { selectEmail } = useEmailStore();

    const handleClick = () => {
        selectEmail(email);
    };

    return (
        <Tooltip>
            <Card
                className={cn(
                    'gap-1 p-2.5 rounded-sm border-y-0 border-r-0 border-l-4',
                    email.account === 'Account 1' ? 'border-green-500' : 'border-violet-500'
                )}
                onClick={handleClick}
            >
                <TooltipTrigger>
                    <div className="flex justify-between items-center gap-2">
                        <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate max-w-[65%]">
                            {email.subject}
                        </p>
                        <Badge
                            variant="outline"
                            className={`${getCategoryColors(email.category)} text-[11px] px-1.5 py-0 flex-shrink-0 max-w-[35%] truncate`}
                            title={email.category}
                        >
                            {email.category}
                        </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{email.text}</p>
                    <p className='text-xs text-end'>{formatDate(email.date)}</p>
                </TooltipTrigger>
            </Card>
            <TooltipContent><p>{email.account}</p></TooltipContent>
        </Tooltip>
    );
};

export default MailCard;
