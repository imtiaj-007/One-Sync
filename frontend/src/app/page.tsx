"use client"
import MailFilters from "@/components/mailbox/mail-filters";
import MailLists from "@/components/mailbox/mail-lists";
import { MailIcon, PlusIcon } from "lucide-react";


export default function Home() {
    return (
        <div className="w-full h-full grid grid-cols-12">
            {/* Filters and Labels Section */}
            <div className="col-span-2 border-r-2 overflow-y-auto">
                <MailFilters />
            </div>

            {/* Inbox section with list of Mails */}
            <div className="col-span-3 border-r-2 overflow-y-auto">
                <MailLists />
            </div>

            {/* Mail Display Area */}
            <div className="col-span-7 flex items-center justify-center h-full overflow-y-auto">
                <div className="flex flex-col items-center justify-center">
                    <div className="bg-indigo-200 dark:bg-indigo-400 rounded-full p-6 mb-6 shadow-sm">
                        <MailIcon className="size-8" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No Email</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                        Your inbox is empty. When you receive emails, they will appear here.<br />
                        <span className="inline-flex items-center gap-1 mt-2 text-indigo-500 font-medium">
                            <PlusIcon />
                            Stay tuned!
                        </span>
                    </p>
                </div>
            </div>
        </div>        
    );
}
