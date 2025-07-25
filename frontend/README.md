# 🌐 OneSync Frontend

This is the frontend application for **OneSync**, a onebox email aggregator. It provides a user-friendly interface to view, search, and filter emails from multiple accounts with AI-generated labels.

---

## 📁 Project Structure

```bash
frontend/
├── src/
│   ├── app/                         # Next.js App Router
│   │   └── page.tsx                 # Main route rendering mail list
│   ├── components/
│   │   ├── layout/                  # Shell, sidebar, header, etc.
│   │   ├── mailbox/                 # Mail-related components
│   │   │   ├── mail-filters.tsx     # Filters (search, dropdowns)
│   │   │   ├── mail-lists.tsx       # Shows primary | others mail groups
│   │   │   ├── mail-card.tsx        # Individual email preview card
│   │   │   └── mail-content.tsx     # Full content view of selected mail
│   │   └── ui/                      # Reusable UI components
│   ├── lib/                         
│   │   ├── utils.ts                 # Utilities
│   ├── hooks/                       # Custom hooks
│   ├── types/                       # Type definitions
│   ├── store/                       # Zustand store for global state
│   │   └── emailStore.ts            # Central logic for fetching, filtering, state
│   ├── constants/                   # UI constants and sample data
├── public/                       # Static assets
├── .env                          # Environment variables
├── next.config.ts                # Next.js configuration
├── package.json                  # NPM dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project documentation
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/imtiaj-007/One-Sync.git
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Make sure this matches your backend host and port.

---

## 🚀 Running the Frontend

Start the development server:

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🔍 Features

* **Multiple Account Support**

  * Toggle between primary inboxes (Account 1, Account 2)

* **Advanced Filters**

  * Filter by sender, category (AI label), and search text

* **AI-Powered Labeling**

  * Emails are tagged with categories like Interested, Meeting Booked, etc.

* **Beautiful UI with State Management**

  * Built with Next.js and Zustand for smooth, reactive performance

---

## 🔧 Tech Stack

* **Next.js (App Router)**
* **TypeScript**
* **Tailwind CSS**
* **Zustand** (state management)
* **Lucide Icons**
* **Custom API integration**

---

## 🔄 How Data Fetching Works

The `emailStore.ts` Zustand store handles:

* Fetching emails from the backend with applied filters
* Managing loading/error states
* Tracking selected inbox and filter values

You can trigger email fetch like this:

```ts
const { fetchEmails, emails } = useEmailStore();
fetchEmails();
```

---

## 📬 Sample Usage

```tsx
<MailList emails={emails.primary} />
<MailList emails={emails.others} />
```

---

## 📌 Notes

* This frontend was built specifically for the ReachInbox OneSync assignment.
* Focused on performance, minimalism, and good UX.
* Easily extendable for authentication, email previews, or replies.

---

## 🧠 Author

**SK Imtiaj Uddin**
Built as part of the ReachInbox backend engineering assignment ☑️
