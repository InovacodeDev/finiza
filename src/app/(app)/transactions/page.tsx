"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TransactionsHeader } from "@/components/ui/TransactionsHeader";
import { TransactionListGroup } from "@/components/ui/TransactionListGroup";
import { TransactionItem } from "@/components/ui/TransactionItem";
import { CreateTransactionModal } from "@/components/ui/CreateTransactionModal";
import {
    fetchTransactions,
    createTransactionAction,
    fetchCategories,
    TransactionInsert,
} from "@/app/actions/transactionActions";
import { fetchAccounts } from "@/app/actions/accountActions";

export default function TransactionsPage() {
    // State
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [transactions, setTransactions] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [accounts, setAccounts] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const [txs, accs, cats] = await Promise.all([fetchTransactions(), fetchAccounts(), fetchCategories()]);
            setTransactions(txs || []);
            setAccounts(accs || []);
            setCategories(cats || []);
            setIsLoading(false);
        }
        loadData();
    }, []);

    // Derived state
    const filteredTransactions = useMemo(() => {
        if (!searchQuery) return transactions;
        return transactions.filter(
            (t) =>
                t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [transactions, searchQuery]);

    const groupedTransactions = useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const groups: Record<string, any[]> = {};
        filteredTransactions.forEach((t) => {
            const dateStr = t.transaction_date;
            if (!groups[dateStr]) groups[dateStr] = [];
            groups[dateStr].push(t);
        });
        // Sort keys descending
        return Object.keys(groups)
            .sort((a, b) => b.localeCompare(a))
            .map((date) => ({
                date,
                items: groups[date],
            }));
    }, [filteredTransactions]);

    const totalAmount = useMemo(() => {
        return filteredTransactions.reduce((acc, curr) => {
            if (curr.type === "income") return acc + curr.amount;
            if (curr.type === "expense") return acc - curr.amount;
            return acc; // Transfer and adjustment don't affect this naive total directly
        }, 0);
    }, [filteredTransactions]);

    const handleCreateTransaction = async (newTx: Omit<TransactionInsert, "user_id">) => {
        const res = await createTransactionAction(newTx);
        if (res.success) {
            // Optimistic update wrapper or reload. Reload is simpler and robust for now.
            const txs = await fetchTransactions();
            setTransactions(txs || []);
        } else {
            alert("Erro ao criar transação: " + res.error);
        }
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
                                    // Normally we would get userName from a joined profiles table based on tx.user_id
                                    userName={undefined}
                                    userAvatarUrl={undefined}
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
                onClose={() => setIsCreateModalOpen(false)}
                accounts={accounts}
                categories={categories}
                onCreate={handleCreateTransaction}
            />
        </div>
    );
}
