import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    badge?: React.ReactNode;
    children?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}

export function PageHeader({ title, subtitle, badge, children, action, className }: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12", className)}>
            <div className="flex flex-col gap-1">
                {subtitle && <p className="text-zinc-400 font-medium">{subtitle}</p>}

                <div className="flex items-baseline gap-3">
                    <h1 className="text-4xl md:text-5xl font-bold text-zinc-50 tracking-tight">{title}</h1>
                    {badge && (
                        <span className="text-xs text-zinc-500 bg-zinc-900/50 px-2 py-1 rounded-md border border-zinc-800 shrink-0">
                            {badge}
                        </span>
                    )}
                </div>

                {children && <div className="mt-4">{children}</div>}
            </div>

            {action && <div className="w-full md:w-auto shrink-0">{action}</div>}
        </div>
    );
}
