// src/components/ui/GlassCard.tsx
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div
            className={twMerge(
                clsx(
                    "relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-2xl",
                    className,
                ),
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <div className="relative z-10">{children}</div>
        </div>
    );
}
