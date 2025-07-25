/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { CheckIcon, ChevronDown, SearchIcon } from 'lucide-react';
import { useEmailStore } from '@/store/emailStore';
import MailCard from './mail-card';


const MailLists: React.FC = () => {
    const {
        emails,
        activeInbox,
        setActiveInbox,
        searchQuery,
        setSearchQuery,
        activeTab,
        setActiveTab,
        selectedStatus,
        fetchEmails,
        selectEmail,
    } = useEmailStore();


    const inboxes = [
        { name: "All Inbox", value: "all" },
        { name: "Imtiaj Dev's Inbox", value: "Account 1" },
        { name: "Soul Survivour's Inbox", value: "Account 2" }
    ];

    const filteredMails = useMemo(() => {
        if (activeTab === 'primary') {
            return emails.filter(email =>
                ["Interested", "Meeting Booked", "Out of Office", "Promotion", "Not Interested"].includes(email.category)
            );
        } else if (activeTab === 'others') {
            return emails.filter(email =>
                ["Spam", "Social"].includes(email.category)
            );
        }
        return emails;
    }, [emails, activeTab, selectedStatus]);

    useEffect(() => {
        fetchEmails();
        selectEmail(null);
    }, [searchQuery, activeInbox, selectedStatus]);

    return (
        <div className='space-y-4 p-2 h-full flex flex-col'>
            {/* Inbox Selector */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        size="lg"
                        className='w-full justify-between text-lg font-bold text-indigo-500 bg-transparent hover:bg-gray-100 dark:hover:bg-slate-800'
                    >
                        {inboxes.find(i => i.value === activeInbox)?.name || 'All Inbox'}
                        <ChevronDown />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[22rem]" align="start">
                    {inboxes.map(({ name, value }, idx) => (
                        <React.Fragment key={value}>
                            <DropdownMenuItem onClick={() => setActiveInbox(value)}>
                                <CheckIcon className={activeInbox === value ? '' : 'invisible'} />
                                {name}
                                <span className={`size-3 rounded-full ${value === 'Account 1' && 'bg-green-500'} ${value === 'Account 2' && 'bg-violet-500'}`} />
                            </DropdownMenuItem>
                            {idx === 0 && <DropdownMenuSeparator />}
                        </React.Fragment>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Search Input */}
            <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <SearchIcon className='size-5' />
                </span>
                <Input
                    type="search"
                    placeholder="Search mail"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Tabs for Primary / Others */}
            <div className="flex-1 min-h-0 cursor-pointer">
                <Tabs
                    value={activeTab}
                    onValueChange={(val) => setActiveTab(val as 'primary' | 'others')}
                    className="h-full flex flex-col"
                >
                    <TabsList className='w-full'>
                        <TabsTrigger value="primary" className="data-[state=active]:text-white data-[state=active]:bg-indigo-500 dark:data-[state=active]:bg-indigo-500">Primary</TabsTrigger>
                        <TabsTrigger value="others" className="data-[state=active]:text-white data-[state=active]:bg-indigo-500 dark:data-[state=active]:bg-indigo-500">Others</TabsTrigger>
                    </TabsList>
                    <TabsContent
                        value="primary"
                        className='space-y-1 p-2 h-full max-h-[calc(100vh-16rem)] overflow-y-auto'
                        style={{ scrollbarWidth: 'thin' }}
                    >
                        {filteredMails && filteredMails.length > 0 && filteredMails.map(email => (
                            <MailCard key={email.id} email={email} />
                        ))}
                    </TabsContent>
                    <TabsContent
                        value="others"
                        className='space-y-1 p-2 h-full max-h-[calc(100vh-16rem)] overflow-y-auto'
                        style={{ scrollbarWidth: 'thin' }}
                    >
                        {filteredMails && filteredMails.length > 0 && filteredMails.map(email => (
                            <MailCard key={email.id} email={email} />
                        ))}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default MailLists;
