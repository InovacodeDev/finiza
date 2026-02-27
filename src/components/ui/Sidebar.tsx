"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { LayoutDashboard, Wallet, Receipt, TrendingUp, Settings } from "lucide-react";

const MENU_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Contas", href: "/accounts", icon: Wallet },
    { label: "Faturas", href: "/invoices", icon: Receipt },
    { label: "Investimentos", href: "/investments", icon: TrendingUp },
    { label: "Configurações", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <aside
            className={twMerge(
                "hidden lg:flex flex-col w-64 h-screen sticky top-0 left-0 pt-28 pb-8 z-40 transition-all duration-500 ease-out",
                isScrolled ? "bg-zinc-950/80 border-r border-white/5 backdrop-blur-xl shadow-lg" : "bg-transparent",
            )}
        >
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={twMerge(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm group relative",
                                isActive
                                    ? "text-zinc-50 bg-white/5 border border-white/10"
                                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent",
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active-indicator"
                                    className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            )}
                            <Icon
                                className={twMerge(
                                    "w-5 h-5 transition-colors",
                                    isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300",
                                )}
                            />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
