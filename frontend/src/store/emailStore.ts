import { create } from 'zustand'

export type EmailStatus =
    | 'Interested'
    | 'Not Interested'
    | 'Meeting Booked'
    | 'Spam'
    | 'Out of Office';

export type Email = {
    id: string
    subject: string
    body: string
    from: string
    to: string
    date: string
    label: EmailStatus
}

type EmailStore = {
    emails: Email[]
    selectedStatus: EmailStatus | 'All'
    selectedEmail: Email | null

    setEmails: (emails: Email[]) => void
    selectStatus: (status: EmailStatus | 'All') => void
    setSelectedEmail: (email: Email | null) => void
}

export const useEmailStore = create<EmailStore>((set) => ({
    emails: [],
    selectedStatus: 'All',
    selectedEmail: null,

    setEmails: (emails) => set({ emails }),
    selectStatus: (status) => set({ selectedStatus: status }),
    setSelectedEmail: (email) => set({ selectedEmail: email }),
}))
