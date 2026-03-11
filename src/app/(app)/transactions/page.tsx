"use client";

import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TransactionsHeader } from "@/components/ui/TransactionsHeader";
import { TransactionListGroup } from "@/components/ui/TransactionListGroup";
import { TransactionItem } from "@/components/ui/TransactionItem";
import { CreateTransactionModal } from "@/components/business/transactions/create-transaction-modal";
import { useTransactions, useAccounts, useCategories, useCreditCards } from "@/hooks/use-transactions";
import { TransactionWithRelations } from "@/app/actions/transaction-actions";

export default function TransactionsPage() {
    // State for filters
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterAccountId, setFilterAccountId] = useState<string>("all");
    const [filterCategoryId, setFilterCategoryId] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "amount_desc" | "amount_asc">("date_asc");
    const [filterCurrentMonth, setFilterCurrentMonth] = useState(true);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<TransactionWithRelations | null>(null);

    // TanStack Query Hooks
    const { data: transactions = [], isLoading: isLoadingTxs } = useTransactions();
    const { data: accounts = [] } = useAccounts();
    const { data: categories = [] } = useCategories();
    const { data: creditCards = [] } = useCreditCards();

    const isLoading = isLoadingTxs;

    // Derived state
    const filteredTransactions = useMemo(() => {
        let result = transactions;

        if (filterCurrentMonth) {
            const now = new Date();
            const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
            result = result.filter((t) => t.transaction_date.startsWith(currentMonthStr));
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (t) => t.description.toLowerCase().includes(query) || t.category?.name?.toLowerCase().includes(query),
            );
        }

        if (filterType !== "all") {
            result = result.filter((t) => t.type === filterType);
        }

        if (filterStatus !== "all") {
            result = result.filter((t) => t.status === filterStatus);
        }

        if (filterAccountId !== "all") {
            result = result.filter(
                (t) =>
                    t.account_id === filterAccountId ||
                    t.credit_card_id === filterAccountId ||
                    t.destination_account_id === filterAccountId,
            );
        }

        if (filterCategoryId !== "all") {
            result = result.filter((t) => t.category_id === filterCategoryId);
        }

        return result;
    }, [transactions, searchQuery, filterType, filterStatus, filterAccountId, filterCategoryId, filterCurrentMonth]);

    const groupedTransactions = useMemo(() => {
        if (sortBy === "amount_desc" || sortBy === "amount_asc") {
            const sorted = [...filteredTransactions].sort((a, b) => {
                const amountA = Math.abs(a.amount);
                const amountB = Math.abs(b.amount);
                return sortBy === "amount_desc" ? amountB - amountA : amountA - amountB;
            });
            return [{ date: "Todas as transações", items: sorted }];
        }

        const groups: Record<string, any[]> = {};
        filteredTransactions.forEach((t) => {
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
    }, [filteredTransactions, sortBy]);

    const totalAmount = useMemo(() => {
        return filteredTransactions.reduce((acc, curr) => {
            if (curr.type === "income") return acc + curr.amount;
            if (curr.type === "expense") return acc - curr.amount;
            return acc;
        }, 0);
    }, [filteredTransactions]);

    const openEditModal = (tx: any) => {
        setEditingTransaction(tx);
        setIsCreateModalOpen(true);
    };

    const closeEditModal = () => {
        setIsCreateModalOpen(false);
        setEditingTransaction(null);
    };

    // Parallax
    const { scrollY } = useScroll();
    const yBg1 = useTransform(scrollY, [0, 1000], [0, 400]);
    const yBg2 = useTransform(scrollY, [0, 1000], [0, -400]);

    return (
        <div className="relative min-h-[calc(100vh-64px)] w-full pb-32">
            <motion.div
                style={{ y: yBg1 }}
                className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"
            />
            <motion.div
                style={{ y: yBg2 }}
                className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"
            />

            <TransactionsHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} totalAmount={totalAmount} />

            {/* Filter Bar */}
            <div className="px-4 md:px-8 mb-6 overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex items-center gap-3 min-w-max">
                    <button
                        onClick={() => setFilterCurrentMonth(!filterCurrentMonth)}
                        className={`whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-xl transition-all border ${
                            filterCurrentMonth
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                        }`}
                    >
                        Mês Atual
                    </button>

                    <div className="w-px h-6 bg-zinc-800 mx-1"></div>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none focus:border-primary/50 transition-all cursor-pointer"
                    >
                        <option value="all">Tipo: Todos</option>
                        <option value="income">Receitas</option>
                        <option value="expense">Despesas</option>
                        <option value="transfer">Transferências</option>
                        <option value="adjustment">Ajustes</option>
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none focus:border-primary/50 transition-all cursor-pointer"
                    >
                        <option value="all">Status: Todos</option>
                        <option value="paid">Efetivado</option>
                        <option value="pending">Previsto</option>
                    </select>

                    <select
                        value={filterAccountId}
                        onChange={(e) => setFilterAccountId(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none focus:border-primary/50 transition-all cursor-pointer max-w-[200px]"
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

                    <select
                        value={filterCategoryId}
                        onChange={(e) => setFilterCategoryId(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none focus:border-primary/50 transition-all cursor-pointer max-w-[200px]"
                    >
                        <option value="all">Categoria: Todas</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <div className="w-px h-6 bg-zinc-800 mx-1"></div>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none focus:border-primary/50 transition-all cursor-pointer"
                    >
                        <option value="date_desc">Ordenar: Mais recentes</option>
                        <option value="date_asc">Ordenar: Mais antigas</option>
                        <option value="amount_desc">Ordenar: Maior valor</option>
                        <option value="amount_asc">Ordenar: Menor valor</option>
                    </select>
                </div>
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
                                    categoryIconSlug={tx.category?.icon_slug}
                                    categoryColorHex={tx.category?.color_hex}
                                    accountName={tx.account?.name}
                                    accountColorHex={tx.account?.color_hex}
                                    targetAccountName={tx.destination_account?.name}
                                    targetAccountColorHex={tx.destination_account?.color_hex}
                                    isSystemReadonly={tx.is_system_readonly}
                                    creditCardName={tx.credit_card?.name}
                                    userName={undefined}
                                    userAvatarUrl={undefined}
                                    onClick={tx.is_system_readonly ? undefined : () => openEditModal(tx)}
                                />
                            ))}
                        </TransactionListGroup>
                    ))}
                </div>
            )}

            {/* Fab Button for Mobile & Desktop context */}
            <div className="fixed bottom-8 right-8 z-40">
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:scale-110 transition-all group"
                >
                    <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
            </div>

            <CreateTransactionModal
                isOpen={isCreateModalOpen}
                onClose={closeEditModal}
                accounts={accounts}
                categories={categories}
                creditCards={creditCards}
                transactionToEdit={editingTransaction}
            />
        </div>
    );
}
