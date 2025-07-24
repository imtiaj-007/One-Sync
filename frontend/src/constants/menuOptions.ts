import {
    UserRoundSearch,
    MailIcon,
    HouseIcon,
    SendIcon,
    InboxIcon,
    ChartColumnDecreasing,
} from "lucide-react";

interface MenuSubItem {
    id: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    href: string;
}

interface MenuItem {
    id: string;
    label: string;
    active: boolean;
    icon?: React.ComponentType<{ className?: string }>;
    href?: string;
    badge?: string | number;
    subItems?: MenuSubItem[];
}

interface MenuGroup {
    id: string;
    label: string;
    items: MenuItem[];
}


export const menuConfig: MenuGroup[] = [
    {
        id: 'home-group',
        label: 'Home Group',
        items: [
            {
                id: 'home',
                label: 'Home',
                icon: HouseIcon,
                href: '/',
                active: false
            }
        ]
    },
    {
        id: 'leads-group',
        label: 'leads Group',        
        items: [
            {
                id: 'leads',
                label: 'Leads',
                icon: UserRoundSearch,
                href: '/',
                active: false
            },
        ]
    },
    {
        id: 'mail-group',
        label: 'Mail Group',
        items: [
            {
                id: 'all-mail',
                label: 'All Mail',
                icon: MailIcon,
                href: '/',
                active: false
            },
        ]
    },
    {
        id: 'campaigns-group',
        label: 'Campaigns',
        items: [
            {
                id: 'campaigns',
                label: 'Campaigns',
                icon: SendIcon,
                href: '/',
                active: false
            },
        ]
    },
    {
        id: 'inbox-group',
        label: 'Inbox Group',        
        items: [
            {
                id: 'inbox',
                label: 'Inbox',
                icon: InboxIcon,
                href: '/',
                active: true
            },
        ]
    },
    {
        id: 'analytics-group',
        label: 'Analytics Group',        
        items: [
            {
                id: 'analytics',
                label: 'Analytics',
                icon: ChartColumnDecreasing,
                href: '/',
                active: false
            },
        ]
    },
];