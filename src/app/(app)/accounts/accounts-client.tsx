"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AccountCard } from "@/components/business/accounts/account-card";
import { EditAccountSlideOver } from "@/components/business/accounts/edit-account-slide-over";
import { PageHeader } from "@/components/ui/PageHeader";
import { CreateAccountModal } from "@/components/business/accounts/create-account-modal";
import { TransferModal } from "@/components/business/accounts/transfer-modal";
import { AccountSection } from "@/components/business/accounts/account-section";
import {
    createAccountAction,
    updateAccountAction,
    deleteAccountAction,
    transferBalanceAction,
} from "@/app/actions/account-actions";
import { ActionResponse } from "@/types/actions";

export interface Account {
    id: string;
    name: string;
    institution: string;
    category: "checking" | "savings" | "wallet" | "vault" | "credit";
    balance: number;
    colorHex: string;
    lastSyncedAt: Date;
    members: { id: string; name: string; role: "owner" | "editor" | "viewer" }[];
}

interface AccountsClientProps {
    initialAccounts: Account[];
}

export function AccountsClient({ initialAccounts }: AccountsClientProps) {
    const router = useRouter();
    const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Drag and Drop State
    const [draggedAccountId, setDraggedAccountId] = useState<string | null>(null);
    const [dragOverId, setDragOverId] = useState<string | null>(null);
    const [transferIntent, setTransferIntent] = useState<{ sourceId: string; targetId: string } | null>(null);
    const [transferValue, setTransferValue] = useState("");

    const giroAccounts = accounts.filter((a) => ["checking", "wallet"].includes(a.category));
    const vaultAccounts = accounts.filter((a) => ["savings", "vault"].includes(a.category));

    const totalGiro = giroAccounts.reduce((acc, curr) => acc + curr.balance, 0);
    const totalReserves = vaultAccounts.reduce((acc, curr) => acc + curr.balance, 0);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
    };

    // Parallax Background Setup
    const { scrollY } = useScroll();
    const yBg1 = useTransform(scrollY, [0, 1000], [0, 400]);
    const yBg2 = useTransform(scrollY, [0, 1000], [0, -400]);

    const handleDragStart = (_e: React.DragEvent, id: string) => {
        setDraggedAccountId(id);
    };

    const handleDragOver = (e: React.DragEvent, id: string) => {
        e.preventDefault();
        if (draggedAccountId && draggedAccountId !== id) {
            setDragOverId(id);
        }
    };

    const handleDragLeave = () => {
        setDragOverId(null);
    };

    const handleDrop = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        setDragOverId(null);
        if (draggedAccountId && draggedAccountId !== targetId) {
            const targetAccount = accounts.find((a) => a.id === targetId);
            if (targetAccount?.category === "credit") {
                return;
            }
            setTransferIntent({ sourceId: draggedAccountId, targetId });
        }
        setDraggedAccountId(null);
    };

    const handleTransferValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        if (!value) {
            setTransferValue("");
            return;
        }
        const numericValue = parseInt(value, 10) / 100;
        const formatted = new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericValue);
        setTransferValue(formatted);
    };

    const executeTransfer = async () => {
        const value = parseFloat(transferValue.replace(/\./g, "").replace(",", "."));
        if (isNaN(value) || value <= 0 || !transferIntent) return;

        const { sourceId, targetId } = transferIntent;

        // Optimistic update
        const previousAccounts = [...accounts];
        setAccounts((prev) => 
            prev.map((a) => {
                if (a.id === sourceId) return { ...a, balance: a.balance - value };
                if (a.id === targetId) return { ...a, balance: a.balance + value };
                return a;
            })
        );

        setTransferIntent(null);
        setTransferValue("");

        const res = await transferBalanceAction(sourceId, targetId, value);
        if (!res.success) {
            setError(res.error || "Erro ao realizar transferência.");
            setAccounts(previousAccounts);
        } else {
            router.refresh();
        }
    };

    const handleUpdateAccount = async (id: string, updates: Omit<Partial<Account>, "category"> & { color_hex?: string, category?: string }): Promise<ActionResponse> => {
        const res = await updateAccountAction(id, updates);
        if (res.success && res.data) {
            setAccounts((prev) => prev.map((a) => (a.id === id ? { 
                ...a, 
                ...updates, 
                category: updates.category ? (updates.category as Account["category"]) : a.category,
                colorHex: updates.color_hex || a.colorHex,
                lastSyncedAt: new Date()
            } : a)));
            
            if (selectedAccount?.id === id) {
                setSelectedAccount(prev => prev ? { 
                    ...prev, 
                    ...updates, 
                    category: updates.category ? (updates.category as Account["category"]) : prev.category,
                    colorHex: updates.color_hex || prev.colorHex 
                } : null);
            }
            router.refresh();
        }
        return res;
    };

    const handleDeleteAccount = async (id: string): Promise<ActionResponse> => {
        const res = await deleteAccountAction(id);
        if (res.success) {
            setAccounts((prev) => prev.filter((a) => a.id !== id));
            setSelectedAccount(null);
            router.refresh();
        }
        return res;
    };

    const handleCreateAccount = async (
        newAccountData: Omit<Account, "id" | "lastSyncedAt" | "members"> & { colorHex: string; initialTransactionAmount?: number }
    ) => {
        const accountInsert = {
            name: newAccountData.name,
            institution: newAccountData.institution,
            category: newAccountData.category,
            balance: newAccountData.balance || 0,
            color_hex: newAccountData.colorHex,
        };
        setError(null);
        const res = await createAccountAction(accountInsert);

        if (res.success && res.data) {
            const dbAccount: Account = {
                id: res.data.id,
                name: res.data.name,
                institution: res.data.institution || "",
                category: res.data.category as Account["category"],
                balance: res.data.balance,
                colorHex: res.data.color_hex || "#8A05BE",
                lastSyncedAt: new Date(res.data.updated_at),
                members: [{ id: "u1", name: "Você", role: "owner" }],
            };
            setAccounts((prev) => [...prev, dbAccount]);
            setIsCreateModalOpen(false);
            router.refresh();
        } else {
            setError(res.error || "Erro ao criar conta.");
        }
    };

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

            {error && (
                <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-3">
                        <X size={20} className="shrink-0" />
                        <p>{error}</p>
                    </div>
                    <button onClick={() => setError(null)} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                        <X size={16} />
                    </button>
                </div>
            )}

            <div className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md pt-2 pb-6 -mx-6 px-6 -mt-6 rounded-b-xl border-b border-zinc-900 shadow-sm mb-6">
                <PageHeader
                    subtitle="Liquidez Imediata"
                    className="mb-0"
                    title={<span className="tabular-nums tracking-tight">{formatCurrency(totalGiro)}</span>}
                    action={
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] w-full md:w-auto justify-center group"
                        >
                            <Plus size={20} className="transition-transform group-hover:rotate-90" />
                            Nova Conta
                        </button>
                    }
                >
                    <div className="flex items-center gap-2 text-zinc-400">
                        <p className="text-sm">Patrimônio Alocado (Reservas):</p>
                        <span className="font-semibold">{formatCurrency(totalReserves)}</span>
                    </div>
                </PageHeader>
            </div>

            <div className="flex flex-col gap-12">
                <AccountSection title="Contas de Giro">
                    {giroAccounts.map((account) => (
                        <div
                            key={account.id}
                            className={cn("transition-transform", dragOverId === account.id && "scale-105 opacity-80")}
                        >
                            <AccountCard
                                {...account}
                                onClick={() => setSelectedAccount(account)}
                                draggable
                                onDragStart={(e) => handleDragStart(e, account.id)}
                                onDragOver={(e) => handleDragOver(e, account.id)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, account.id)}
                            />
                        </div>
                    ))}
                </AccountSection>

                <AccountSection title="Reservas e Cofres" defaultOpen={false}>
                    {vaultAccounts.map((account) => (
                        <div
                            key={account.id}
                            className={cn("transition-transform", dragOverId === account.id && "scale-105 opacity-80")}
                        >
                            <AccountCard
                                {...account}
                                onClick={() => setSelectedAccount(account)}
                                draggable
                                onDragStart={(e) => handleDragStart(e, account.id)}
                                onDragOver={(e) => handleDragOver(e, account.id)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, account.id)}
                            />
                        </div>
                    ))}
                </AccountSection>
            </div>

            {selectedAccount && (
                <EditAccountSlideOver
                    isOpen={!!selectedAccount}
                    onClose={() => setSelectedAccount(null)}
                    accountId={selectedAccount.id}
                    name={selectedAccount.name}
                    institution={selectedAccount.institution}
                    balance={selectedAccount.balance}
                    colorHex={selectedAccount.colorHex}
                    category={selectedAccount.category}
                    onUpdate={handleUpdateAccount}
                    onDelete={handleDeleteAccount}
                />
            )}

            {transferIntent &&
                (() => {
                    const source = accounts.find((a) => a.id === transferIntent.sourceId);
                    const target = accounts.find((a) => a.id === transferIntent.targetId);

                    if (!source || !target) return null;

                    return (
                        <TransferModal
                            source={source}
                            target={target}
                            transferValue={transferValue}
                            onValueChange={handleTransferValueChange}
                            onConfirm={executeTransfer}
                            onClose={() => setTransferIntent(null)}
                        />
                    );
                })()}

            <CreateAccountModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateAccount}
                error={error}
            />
        </div>
    );
}
