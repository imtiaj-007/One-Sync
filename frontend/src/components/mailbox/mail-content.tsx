import React from 'react';
import { useEmailStore } from '@/store/emailStore';
import { MailIcon, PlusIcon } from 'lucide-react';


const MailContent: React.FC = () => {
    const { selectedEmail } = useEmailStore();

    if (!selectedEmail) {
        return (
            <div className="flex flex-col items-center justify-center">
                <div className="bg-indigo-200 dark:bg-indigo-400 rounded-full p-6 mb-6 shadow-sm">
                    <MailIcon className="size-8" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No Email</h2>
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                    Please click a email from inbox. When you select an email, it will appear here.<br />
                    <span className="inline-flex items-center gap-1 mt-2 text-indigo-500 font-medium">
                        <PlusIcon />
                        Stay tuned!
                    </span>
                </p>
            </div>
        )
    }

    return (
        <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow p-8 h-[80vh] flex flex-col">
            <div className="mb-6 flex-shrink-0">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{selectedEmail.subject}</h3>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    From: <span>{selectedEmail.from}</span>
                </p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    To: <span>{selectedEmail.to.join(', ')}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {new Date(selectedEmail.date).toLocaleString()}
                </p>
            </div>
            <div
                className="flex-1 overflow-auto min-h-0"
                style={{ maxHeight: 'calc(90vh - 7.5rem)' }}
            >
                {selectedEmail.html ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedEmail.html }} />
                ) : (
                    <pre className="whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200">{selectedEmail.text}</pre>
                )}
            </div>
        </div>
    )
}

export default MailContent;
