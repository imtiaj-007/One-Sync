"use client"
import MailContent from "@/components/mailbox/mail-content";
import MailFilters from "@/components/mailbox/mail-filters";
import MailLists from "@/components/mailbox/mail-lists";

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
            <div className="col-span-7 flex items-center justify-center h-full overflow-hidden">
                <MailContent />
            </div>
        </div>        
    );
}
