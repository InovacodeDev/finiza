"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TransactionsHeader } from "@/components/business/transactions/transactions-header";
import { TransactionListGroup } from "@/components/business/transactions/transaction-list-group";
import { TransactionItem } from "@/components/business/transactions/transaction-item";
import { BulkActionsBar } from "@/components/business/transactions/bulk-actions-bar";
import { CreateTransactionModal } from "@/components/business/transactions/create-transaction-modal";
import { useTransactions, useAccounts, useCategories, useCreditCards, useBulkUpdateTransactions } from "@/hooks/use-transactions";
import { TransactionWithRelations, TransactionFilters } from "@/types/transactions";
import { format, setMonth, setYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function TransactionsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // State for filters initialized from URL
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [filterType, setFilterType] = useState<string>(searchParams.get("type") || "all");
    const [filterStatus, setFilterStatus] = useState<string>(searchParams.get("status") || "all");
    const [filterAccountId, setFilterAccountId] = useState<string>(searchParams.get("accountId") || "all");
    const [filterCategoryId, setFilterCategoryId] = useState<string>(searchParams.get("categoryId") || "all");
    const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "amount_desc" | "amount_asc">(
        (searchParams.get("sort") as any) || "date_desc"
    );
    
    // Bússola Temporal
    const initialMonth = searchParams.get("month") ? parseInt(searchParams.get("month")!) : new Date().getMonth();
    const initialYear = searchParams.get("year") ? parseInt(searchParams.get("year")!) : new Date().getFullYear();
    const initialTemporal = searchParams.get("temporal") !== "false";

    const [selectedMonth, setSelectedMonth] = useState(initialMonth);
    const [selectedYear, setSelectedYear] = useState(initialYear);
    const [isTemporalFilterActive, setIsTemporalFilterActive] = useState(initialTemporal);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<TransactionWithRelations | null>(null);

    // Bulk selection state
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

    // Sync state with URL
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (searchQuery) params.set("search", searchQuery); else params.delete("search");
        if (filterType !== "all") params.set("type", filterType); else params.delete("type");
        if (filterStatus !== "all") params.set("status", filterStatus); else params.delete("status");
        if (filterAccountId !== "all") params.set("accountId", filterAccountId); else params.delete("accountId");
        if (filterCategoryId !== "all") params.set("categoryId", filterCategoryId); else params.delete("categoryId");
        if (sortBy !== "date_desc") params.set("sort", sortBy); else params.delete("sort");
        
        params.set("month", selectedMonth.toString());
        params.set("year", selectedYear.toString());
        params.set("temporal", isTemporalFilterActive.toString());

        const newQueryString = params.toString();
        if (searchParams.toString() !== newQueryString) {
            router.replace(`${pathname}?${newQueryString}`, { scroll: false });
        }
    }, [searchQuery, filterType, filterStatus, filterAccountId, filterCategoryId, sortBy, selectedMonth, selectedYear, isTemporalFilterActive, pathname, router, searchParams]);

    // Prepare filters for server-side
    const filters = useMemo(() => {
        const f: TransactionFilters = {
            search: searchQuery,
            type: filterType,
            status: filterStatus,
            accountId: filterAccountId,
            categoryId: filterCategoryId,
        };

        if (isTemporalFilterActive) {
            const startDate = new Date(selectedYear, selectedMonth, 1);
            const endDate = new Date(selectedYear, selectedMonth + 1, 0);
            f.startDate = format(startDate, "yyyy-MM-dd");
            f.endDate = format(endDate, "yyyy-MM-dd");
        }

        return f;
    }, [searchQuery, filterType, filterStatus, filterAccountId, filterCategoryId, selectedMonth, selectedYear, isTemporalFilterActive]);

    // TanStack Query Hooks
    const { data: transactions = [], isLoading } = useTransactions(filters);
    const { data: accounts = [] } = useAccounts();
    const { data: categories = [] } = useCategories();
    const { data: creditCards = [] } = useCreditCards();

    const { mutateAsync: bulkUpdateCategory, isPending: isBulkUpdating } = useBulkUpdateTransactions();

    const groupedTransactions = useMemo(() => {
        if (sortBy === "amount_desc" || sortBy === "amount_asc") {
            const sorted = [...transactions].sort((a, b) => {
                const amountA = Math.abs(a.amount);
                const amountB = Math.abs(b.amount);
                return sortBy === "amount_desc" ? amountB - amountA : amountA - amountB;
            });
            return [{ date: "Todas as transações", items: sorted }];
        }

        const groups: Record<string, TransactionWithRelations[]> = {};
        transactions.forEach((t) => {
            const dateStr = t.transaction_date;
            if (!groups[dateStr]) groups[dateStr] = [];
            groups[dateStr].push(t);
        });

        const sortedDates = Object.keys(groups).sort((a, b) =>
            sortBy === "date_desc" ? b.localeCompare(a) : a.localeCompare(b),
        );

        return sortedDates.map((date) => ({
            date,
            items: groups[date],
        }));
    }, [transactions, sortBy]);

    const totalAmount = useMemo(() => {
        return transactions.reduce((acc, curr) => {
            if (curr.type === "income") return acc + curr.amount;
            if (curr.type === "expense") return acc - curr.amount;
            return acc;
        }, 0);
    }, [transactions]);

    const navigateMonth = (delta: number) => {
        let newMonth = selectedMonth + delta;
        let newYear = selectedYear;

        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }

        setSelectedMonth(newMonth);
        setSelectedYear(newYear);
        setIsTemporalFilterActive(true);
    };

    const resetFilters = () => {
        setSearchQuery("");
        setFilterType("all");
        setFilterStatus("all");
        setFilterAccountId("all");
        setFilterCategoryId("all");
        setIsTemporalFilterActive(false);
    };

    const monthName = useMemo(() => {
        const date = setMonth(setYear(new Date(), selectedYear), selectedMonth);
        return format(date, "MMMM", { locale: ptBR });
    }, [selectedMonth, selectedYear]);

    const openEditModal = (tx: TransactionWithRelations) => {
        setEditingTransaction(tx);
        setIsCreateModalOpen(true);
    };

    const closeEditModal = () => {
        setIsCreateModalOpen(false);
        setEditingTransaction(null);
    };

    const toggleSelection = (id: string, isShiftKey: boolean = false) => {
        if (isShiftKey && lastSelectedId) {
            const allVisibleIds = groupedTransactions.flatMap(g => g.items.map(i => i.id));
            const lastIdx = allVisibleIds.indexOf(lastSelectedId);
            const currentIdx = allVisibleIds.indexOf(id);
            
            if (lastIdx !== -1 && currentIdx !== -1) {
                const start = Math.min(lastIdx, currentIdx);
                const end = Math.max(lastIdx, currentIdx);
                const idsInRange = allVisibleIds.slice(start, end + 1);
                
                setSelectedIds(prev => {
                    const newSet = new Set(prev);
                    idsInRange.forEach(rangeId => newSet.add(rangeId));
                    return Array.from(newSet);
                });
                setLastSelectedId(id);
                return;
            }
        }

        setSelectedIds((prev) => {
            const isSelected = prev.includes(id);
            if (isSelected) {
                return prev.filter((i) => i !== id);
            } else {
                return [...prev, id];
            }
        });
        setLastSelectedId(id);
    };

    const clearSelection = () => {
        setSelectedIds([]);
        setIsSelectionMode(false);
    };

    const handleBulkUpdateCategory = async (categoryId: string) => {
        try {
            const res = await bulkUpdateCategory({ ids: selectedIds, categoryId });
            if (res.success) {
                alert("Categorias atualizadas com sucesso!");
                setSelectedIds([]);
                setIsSelectionMode(false);
            } else {
                alert(res.error || "Erro ao atualizar transações.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro de rede ao atualizar transações.");
        }
    };

    // Parallax
    const { scrollY } = useScroll();
    const yBg1 = useTransform(scrollY, [0, 1000], [0, 400]);
    const yBg2 = useTransform(scrollY, [0, 1000], [0, -400]);

    return (
        <div className="relative flex-1 w-full">
            <motion.div
                style={{ y: yBg1 }}
                className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"
            />
            <motion.div
                style={{ y: yBg2 }}
                className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"
            />

            <div className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md pt-2 pb-6 -mx-6 px-6 -mt-6 rounded-b-xl border-b border-zinc-900 shadow-sm mb-6">
                <TransactionsHeader 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery} 
                    totalAmount={totalAmount} 
                    onAddTransaction={() => setIsCreateModalOpen(true)}
                />
            </div>

            {/* Bússola Temporal */}
            <div className="px-4 md:px-8 mb-6">
                <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800 p-2 rounded-2xl">
                    <button 
                        onClick={() => navigateMonth(-1)}
                        className="p-2 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400"
                    >
                        <ChevronDown className="rotate-90" />
                    </button>
                    
                    <button 
                        onClick={() => setIsTemporalFilterActive(!isTemporalFilterActive)}
                        className={`flex flex-col items-center px-4 py-1 rounded-xl transition-all ${isTemporalFilterActive ? "text-zinc-100" : "text-zinc-500 opacity-50"}`}
                    >
                        <span className="text-xs uppercase font-bold tracking-widest text-primary mb-0.5">
                            {selectedYear}
                        </span>
                        <span className="text-lg font-bold leading-tight capitalize">
                            {monthName}
                        </span>
                    </button>

                    <button 
                        onClick={() => navigateMonth(1)}
                        className="p-2 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400"
                    >
                        <ChevronDown className="-rotate-90" />
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="px-4 md:px-8 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex items-center gap-3 min-w-max">
                    <button
                        onClick={resetFilters}
                        className="whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
                    >
                        Limpar
                    </button>

                    <button
                        onClick={() => {
                            const next = !isSelectionMode;
                            setIsSelectionMode(next);
                            if (!next) setSelectedIds([]);
                        }}
                        className={cn(
                            "whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-xl border transition-all",
                            isSelectionMode 
                                ? "bg-primary/20 border-primary text-primary" 
                                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                        )}
                    >
                        {isSelectionMode ? "Sair da Seleção" : "Seleção em Massa"}
                    </button>

                    <div className="w-px h-6 bg-zinc-800 mx-1"></div>

                    <div className="relative flex items-center">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className={`appearance-none bg-zinc-900 border rounded-lg pl-3 pr-10 py-2 text-sm outline-none transition-all cursor-pointer ${filterType !== 'all' ? 'border-primary/50 text-primary' : 'border-zinc-800 text-zinc-300'}`}
                        >
                            <option value="all">Tipo: Todos</option>
                            <option value="income">Receitas</option>
                            <option value="expense">Despesas</option>
                            <option value="transfer">Transferências</option>
                            <option value="adjustment">Ajustes</option>
                        </select>
                        <ChevronDown className="absolute right-3 w-4 h-4 text-zinc-400 pointer-events-none" />
                    </div>

                    <div className="relative flex items-center">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className={`appearance-none bg-zinc-900 border rounded-lg pl-3 pr-10 py-2 text-sm outline-none transition-all cursor-pointer ${filterStatus !== 'all' ? 'border-primary/50 text-primary' : 'border-zinc-800 text-zinc-300'}`}
                        >
                            <option value="all">Status: Todos</option>
                            <option value="paid">Efetivado</option>
                            <option value="pending">Previsto</option>
                        </select>
                        <ChevronDown className="absolute right-3 w-4 h-4 text-zinc-400 pointer-events-none" />
                    </div>

                    <div className="relative flex items-center">
                        <select
                            value={filterAccountId}
                            onChange={(e) => setFilterAccountId(e.target.value)}
                            className={`appearance-none bg-zinc-900 border rounded-lg pl-3 pr-10 py-2 text-sm outline-none transition-all cursor-pointer max-w-[150px] ${filterAccountId !== 'all' ? 'border-primary/50 text-primary' : 'border-zinc-800 text-zinc-300'}`}
                        >
                            <option value="all">Conta: Todas</option>
                            <optgroup label="Contas">
                                {accounts.map((acc) => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.name}
                                    </option>
                                ))}
                            </optgroup>
                            <optgroup label="Cartões">
                                {creditCards.map((cc) => (
                                    <option key={cc.id} value={cc.id}>
                                        {cc.name}
                                    </option>
                                ))}
                            </optgroup>
                        </select>
                        <ChevronDown className="absolute right-3 w-4 h-4 text-zinc-400 pointer-events-none" />
                    </div>

                    <div className="relative flex items-center">
                        <select
                            value={filterCategoryId}
                            onChange={(e) => setFilterCategoryId(e.target.value)}
                            className={`appearance-none bg-zinc-900 border rounded-lg pl-3 pr-10 py-2 text-sm outline-none transition-all cursor-pointer max-w-[150px] ${filterCategoryId !== 'all' ? 'border-primary/50 text-primary' : 'border-zinc-800 text-zinc-300'}`}
                        >
                            <option value="all">Categoria: Todas</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 w-4 h-4 text-zinc-400 pointer-events-none" />
                    </div>

                    <div className="w-px h-6 bg-zinc-800 mx-1"></div>

                    <div className="relative flex items-center">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as "date_desc" | "date_asc" | "amount_desc" | "amount_asc")}
                            className="appearance-none bg-zinc-900 border border-zinc-800 rounded-lg pl-3 pr-10 py-2 text-sm text-zinc-300 outline-none focus:border-primary/50 transition-all cursor-pointer"
                        >
                            <option value="date_desc">Mais recentes</option>
                            <option value="date_asc">Mais antigas</option>
                            <option value="amount_desc">Maior valor</option>
                            <option value="amount_asc">Menor valor</option>
                        </select>
                        <ChevronDown className="absolute right-3 w-4 h-4 text-zinc-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Active Filters Badges */}
            <div className="px-4 md:px-8 mb-6 flex flex-wrap gap-2">
                {filterType !== "all" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                        {filterType === 'income' ? 'Receitas' : filterType === 'expense' ? 'Despesas' : filterType === 'transfer' ? 'Transferências' : 'Ajustes'}
                        <button onClick={() => setFilterType("all")} className="hover:text-white">×</button>
                    </span>
                )}
                {filterStatus !== "all" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                        {filterStatus === 'paid' ? 'Efetivado' : 'Previsto'}
                        <button onClick={() => setFilterStatus("all")} className="hover:text-white">×</button>
                    </span>
                )}
                {filterAccountId !== "all" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                        {accounts.find(a => a.id === filterAccountId)?.name || creditCards.find(c => c.id === filterAccountId)?.name || 'Conta'}
                        <button onClick={() => setFilterAccountId("all")} className="hover:text-white">×</button>
                    </span>
                )}
                {filterCategoryId !== "all" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                        {categories.find(c => c.id === filterCategoryId)?.name || 'Categoria'}
                        <button onClick={() => setFilterCategoryId("all")} className="hover:text-white">×</button>
                    </span>
                )}
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20 text-zinc-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : groupedTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-500 text-center">
                    <p className="text-lg font-medium mb-2">Nenhuma transação encontrada</p>
                    <p className="text-sm">Tente ajustar seus filtros ou cadastre algo novo.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {groupedTransactions.map((group) => (
                        <TransactionListGroup key={group.date} date={group.date}>
                            {group.items.map((tx) => (
                                <TransactionItem
                                    key={tx.id}
                                    id={tx.id}
                                    description={tx.description}
                                    amount={tx.amount}
                                    type={tx.type}
                                    status={tx.status}
                                    categoryIconSlug={tx.category?.icon_slug ?? undefined}
                                    categoryColorHex={tx.category?.color_hex ?? undefined}
                                    accountName={tx.account?.name ?? "Desconhecida"}
                                    accountColorHex={tx.account?.color_hex ?? undefined}
                                    targetAccountName={tx.destination_account?.name ?? undefined}
                                    targetAccountColorHex={tx.destination_account?.color_hex ?? undefined}
                                    isSystemReadonly={tx.is_system_readonly}
                                    creditCardName={tx.credit_card?.name ?? undefined}
                                    userName={undefined}
                                    userAvatarUrl={undefined}
                                    onClick={tx.is_system_readonly ? undefined : () => openEditModal(tx)}
                                    isSelected={selectedIds.includes(tx.id)}
                                    onToggleSelection={(e) => toggleSelection(tx.id, e.shiftKey)}
                                    isSelectionMode={isSelectionMode}
                                />
                            ))}
                        </TransactionListGroup>
                    ))}
                </div>
            )}


            <CreateTransactionModal
                isOpen={isCreateModalOpen}
                onClose={closeEditModal}
                accounts={accounts}
                categories={categories}
                creditCards={creditCards}
                transactionToEdit={editingTransaction}
            />

            <BulkActionsBar
                selectedCount={selectedIds.length}
                onClear={clearSelection}
                categories={categories}
                onApplyCategory={handleBulkUpdateCategory}
                isUpdating={isBulkUpdating}
            />
        </div>
    );
}
