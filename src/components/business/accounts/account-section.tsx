"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountSectionProps {
    title: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}

export function AccountSection({
    title,
    defaultOpen = true,
    children,
}: AccountSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="flex flex-col gap-4">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 group w-fit">
                <div className="text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
                <h2 className="text-xl font-semibold text-zinc-100">{title}</h2>
            </button>

            <div
                className={cn(
                    "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-all duration-300 origin-top overflow-hidden",
                    isOpen ? "opacity-100 scale-y-100 h-auto" : "opacity-0 scale-y-0 h-0",
                )}
            >
                {children}
            </div>
        </div>
    );
}
