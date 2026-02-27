// src/components/ui/GlassCard.tsx
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function GlassCard({ children, className, onClick, ...props }: GlassCardProps) {
    return (
        <div
            onClick={onClick}
            {...props}
            className={twMerge(
                clsx(
                    "relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-2xl transition-all duration-300",
                    onClick &&
                        "cursor-pointer hover:border-zinc-700/50 hover:bg-zinc-900/40 hover:-translate-y-1 shadow-lg",
                    className,
                ),
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <div className="relative z-10">{children}</div>
        </div>
    );
}
