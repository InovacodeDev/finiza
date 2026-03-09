"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, Wallet, Receipt, TrendingUp, Settings, ArrowRightLeft, CreditCard } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Contas", href: "/accounts", icon: Wallet },
    { label: "Transações", href: "/transactions", icon: ArrowRightLeft },
    { label: "Cartões", href: "/credit-cards", icon: CreditCard },
    { label: "Faturas", href: "/invoices", icon: Receipt },
    { label: "Investimentos", href: "/investments", icon: TrendingUp },
    { label: "Configurações", href: "/settings", icon: Settings },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon" className="border-r border-white/5 bg-zinc-950 shadow-2xl" {...props}>
            <SidebarHeader className="h-16 flex justify-center items-start px-4 border-b border-white/5 shrink-0">
                <Link href="/dashboard" className="flex items-center h-full group px-2">
                    <span className="text-3xl font-bold tracking-tight text-zinc-100 group-data-[collapsible=icon]:hidden whitespace-nowrap">
                        Finiza<span className="text-emerald-500">.</span>
                    </span>
                </Link>
            </SidebarHeader>

            <SidebarContent className="px-4 py-4">
                <SidebarGroup className="p-0">
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2">
                            {MENU_ITEMS.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                                const Icon = item.icon;

                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.label}
                                            className={cn(
                                                "h-11 px-4 rounded-xl transition-all font-medium text-sm group relative",
                                                isActive
                                                    ? "text-zinc-50 bg-white/5 border border-white/10 shadow-sm"
                                                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent",
                                            )}
                                        >
                                            <Link href={item.href}>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="sidebar-active-indicator"
                                                        className="absolute left-0 w-1 h-5 bg-emerald-500 rounded-r-full"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.2 }}
                                                    />
                                                )}
                                                <Icon
                                                    className={cn(
                                                        "w-5 h-5 transition-colors",
                                                        isActive
                                                            ? "text-emerald-400"
                                                            : "text-zinc-500 group-hover:text-zinc-300",
                                                    )}
                                                />
                                                <span className="transition-all">{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
