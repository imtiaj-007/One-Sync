import { create } from 'zustand';
import axios, { isAxiosError } from 'axios';
import { Email, LabelFilter, MailboxFilters, MailboxLabels, StatusFilter } from '@/types/email';
import { mailboxFilters, mailboxLabels, sampleEmails } from '@/constants/emailOptions';


interface EmailStore {
    selectedStatus: StatusFilter;
    selectedLabel: LabelFilter;
    filters: MailboxFilters;
    labels: MailboxLabels;

    emails: Email[];
    selectedEmail: Email | null;    
    activeInbox: string;
    searchQuery: string;
    activeTab: 'primary' | 'others';

    isLoading: boolean;
    error: string | null;

    isStatusActive: (value: StatusFilter) => boolean;
    isLabelActive: (value: LabelFilter) => boolean;
    selectStatus: (value: StatusFilter) => void;
    selectLabel: (value: LabelFilter) => void;

    setActiveInbox: (inbox: string) => void;
    setSearchQuery: (query: string) => void;
    setActiveTab: (tab: 'primary' | 'others') => void;
    
    setEmails: (emails: Email[]) => void;
    selectEmail: (email: Email | null) => void;

    fetchEmails: () => Promise<void>;
}

export const useEmailStore = create<EmailStore>((set, get) => ({
    selectedStatus: 'All',
    selectedLabel: 'all',
    activeInbox: 'all',
    searchQuery: '',
    activeTab: 'primary',

    filters: mailboxFilters,
    labels: mailboxLabels,
    emails: sampleEmails,
    selectedEmail: null,

    isLoading: false,
    error: null,

    isStatusActive: (value) => get().selectedStatus === value,
    isLabelActive: (value) => get().selectedLabel === value,

    selectStatus: (value) => set({ selectedStatus: value }),
    selectLabel: (value) => set({ selectedLabel: value }),

    setActiveInbox: (inbox) => set({ activeInbox: inbox }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setActiveTab: (tab) => set({ activeTab: tab }),    
    
    setEmails: (emails) => set({ emails }),
    selectEmail: (email) => set({ selectedEmail: email }),

    fetchEmails: async () => {
        const { selectedStatus, activeInbox, searchQuery } = get();
        set({ isLoading: true, error: null });

        try {
            const response = await axios.get('http://localhost:8000/api/search', {
                params: {
                    q: searchQuery,
                    ...(selectedStatus !== 'All' ? { category: selectedStatus } : {}),
                    ...(activeInbox !== 'all' ? { account: activeInbox } : {})
                },
            });
            set({ emails: response.data.emails, isLoading: false });

        } catch (error: unknown) {
            const errMessage = isAxiosError(error) ? error.message : 'Error fetching emails';
            set({ error: errMessage, isLoading: false });
        }
    },
}));
