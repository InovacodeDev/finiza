import React from "react";
import { Search } from "lucide-react";
import { PageHeader } from "./PageHeader";

interface TransactionsHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    totalAmount?: number;
}

export function TransactionsHeader({ searchQuery, setSearchQuery, totalAmount }: TransactionsHeaderProps) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
    };

    return (
        <PageHeader
            subtitle="Extrato Financeiro"
            className="mb-12"
            title={
                totalAmount !== undefined ? (
                    <span className="tabular-nums tracking-tight">{formatCurrency(totalAmount)}</span>
                ) : (
                    "Transações"
                )
            }
            action={
                <div className="relative w-full md:w-80">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-zinc-500" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar transações..."
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>
            }
        />
    );
}
