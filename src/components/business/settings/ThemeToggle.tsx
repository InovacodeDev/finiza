"use client";

import * as React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-[140px] md:w-[180px] bg-zinc-950/50 border-white/5 rounded-xl h-11 focus:ring-primary/20">
                <SelectValue placeholder="Selecione o tema" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/5 rounded-xl shadow-2xl backdrop-blur-xl">
                <SelectItem value="light" className="rounded-lg focus:bg-white/10">
                    <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-amber-400" />
                        <span className="text-sm">Claro</span>
                    </div>
                </SelectItem>
                <SelectItem value="dark" className="rounded-lg focus:bg-white/10">
                    <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4 text-blue-400" />
                        <span className="text-sm">Escuro</span>
                    </div>
                </SelectItem>
                <SelectItem value="system" className="rounded-lg focus:bg-white/10">
                    <div className="flex items-center gap-2">
                        <Laptop className="h-4 w-4 text-zinc-400" />
                        <span className="text-sm">Sistema</span>
                    </div>
                </SelectItem>
            </SelectContent>
        </Select>
    );
}
