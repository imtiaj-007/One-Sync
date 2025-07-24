import React from 'react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmailStore } from '@/store/emailStore';

const CircleDot: React.FC<{ color: string }> = ({ color }) => (
    <span className={cn('h-3 w-3 size-3 rounded-full', color)} />
);

const MailFilters: React.FC = () => {
    const {
        filters,
        labels,
        isStatusActive,
        isLabelActive,
        selectStatus,
        selectLabel,
    } = useEmailStore();

    return (
        <ScrollArea className="h-full w-full">
            <div className="p-6 cursor-pointer">
                <h3 className="mb-4 leading-none font-semibold">Filters</h3>
                <Separator className="my-2" />

                <ul className="space-y-2 p-2 mb-4">
                    {filters.map((filter) => (
                        <li
                            key={filter.value}
                            className={cn(
                                "flex items-center gap-3 text-xs font-semibold border px-4 py-2 rounded-md",
                                isStatusActive(filter.value) && "bg-gray-200 dark:bg-slate-800"
                            )}
                            onClick={() => selectStatus(filter.value)}
                        >
                            <CircleDot color={filter.circleColor} />
                            {filter.name}
                        </li>
                    ))}
                </ul>

                <h3 className="mb-4 leading-none font-semibold flex items-center justify-between">
                    Custom Labels
                    <PlusIcon className='size-4' />
                </h3>
                <Separator className="my-2" />

                <ul className="space-y-2 p-2 mb-4">
                    {labels.map((label) => (
                        <li
                            key={label.value}
                            className={cn(
                                "flex items-center gap-3 text-xs font-semibold px-4 py-2 rounded-md",
                                isLabelActive(label.value) && "bg-gray-200 dark:bg-slate-800"
                            )}
                            onClick={() => selectLabel(label.value)}
                        >
                            <label.icon className="size-4" />
                            {label.name}
                        </li>
                    ))}
                </ul>
            </div>
            <ScrollBar orientation='vertical' />
        </ScrollArea>
    );
};

export default MailFilters;
