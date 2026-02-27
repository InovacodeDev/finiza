import { twMerge } from "tailwind-merge";

export function FinizaIcon({ className }: { className?: string }) {
    return (
        <div
            className={twMerge(
                "flex items-center justify-center font-bold tracking-tight select-none",
                "bg-zinc-950 rounded-xl border border-white/10",
                className,
            )}
        >
            <span className="text-zinc-100">F</span>
            <span className="text-emerald-500">.</span>
        </div>
    );
}
