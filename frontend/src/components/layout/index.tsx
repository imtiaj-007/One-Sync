'use client'

import { ReactNode } from "react"
import { Header } from "@/components/layout/header"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"


interface LayoutProps {
    children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <SidebarProvider defaultOpen={false}>
            <div className="flex h-screen w-full bg-gray-100 dark:bg-background">
                <AppSidebar />
                <div className="relative flex-1 flex flex-col">
                    <div className="sticky top-0 z-50">
                        <Header />
                    </div>
                    <main className="flex-1 overflow-hidden">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}
