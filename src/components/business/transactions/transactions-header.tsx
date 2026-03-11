import React from "react";
import { Search, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

interface TransactionsHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    totalAmount?: number;
    onAddTransaction?: () => void;
}

export function TransactionsHeader({ searchQuery, setSearchQuery, totalAmount, onAddTransaction }: TransactionsHeaderProps) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
    };

    return (
        <PageHeader
            subtitle="Extrato Financeiro"
            className="mb-0"
            title={
                totalAmount !== undefined ? (
                    <span className="tabular-nums tracking-tight">{formatCurrency(totalAmount)}</span>
                ) : (
                    "Transações"
                )
            }
            action={
                <div className="flex items-center gap-3 w-full md:w-auto">
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
                    {onAddTransaction && (
                        <button
                            onClick={onAddTransaction}
                            className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] shrink-0 font-medium whitespace-nowrap"
                        >
                            <Plus className="h-5 w-5" />
                            <span className="hidden sm:inline">Nova Transação</span>
                        </button>
                    )}
                </div>
            }
        />
    );
}
