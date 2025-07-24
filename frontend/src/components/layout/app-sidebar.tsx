import { Rocket } from "lucide-react";
import {
    Sidebar, SidebarContent, SidebarGroup, SidebarHeader,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar
} from "@/components/ui/sidebar";
import { menuConfig } from "@/constants/menuOptions";


export const AppSidebar: React.FC = () => {
    const { open } = useSidebar();

    return (
        <Sidebar collapsible="icon">
            {/* --- Header (Logo/App Name) --- */}
            <SidebarHeader className="flex items-center gap-2 p-4">
                <Rocket size={32} className="text-indigo-500" />
                {open && <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">One Sync</h1>}
            </SidebarHeader>

            {/* --- Main Navigation Groups --- */}
            <SidebarContent className="pt-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border">
                {menuConfig.map((group) => (
                    <SidebarGroup key={group.id}>
                        <SidebarMenu>
                            {group.items.map((item) => (
                                <SidebarMenuItem key={item.id} className="pl-1">
                                    {item.subItems ? (
                                        <>
                                            <SidebarMenuButton
                                                tooltip={item.label}
                                                isActive={item.active}
                                                asChild
                                                className="h-10 group-data-[collapsible=icon]:size-10!"
                                            >
                                                {item.icon && <item.icon />}
                                            </SidebarMenuButton>
                                            <SidebarMenuSub>
                                                {item.subItems.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.id}>
                                                        <SidebarMenuSubButton href={subItem.href || '#'} >
                                                            {subItem.icon && <subItem.icon />}
                                                            <span>{subItem.label}</span>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </>
                                    ) : (
                                        <SidebarMenuButton
                                            tooltip={item.label}
                                            isActive={item.active} asChild
                                            className="h-10 group-data-[collapsible=icon]:size-10!"
                                        >
                                            {item.icon && <item.icon />}
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>
        </Sidebar>
    );
};