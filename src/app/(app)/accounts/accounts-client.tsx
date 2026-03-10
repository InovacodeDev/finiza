"use client";

import React, { useState } from "react";
import { Plus, ChevronDown, ChevronRight, ArrowRight, X } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AccountCard } from "@/components/business/accounts/account-card";
import { EditAccountSlideOver } from "@/components/business/accounts/edit-account-slide-over";
import { PageHeader } from "@/components/ui/PageHeader";
import { CreateAccountModal } from "@/components/business/accounts/create-account-modal";
import {
    createAccountAction,
    updateAccountAction,
    deleteAccountAction,
} from "@/app/actions/account-actions";
import { ActionResponse } from "@/types/actions";

interface Account {
    id: string;
    name: string;
    institution: string;
    category: "checking" | "savings" | "wallet" | "vault" | "credit";
    balance: number;
    colorHex: string;
    lastSyncedAt: Date;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    members: any[];
}

interface AccountsClientProps {
    initialAccounts: Account[];
}

function AccountSection({
    title,
    defaultOpen = true,
    children,
}: {
    title: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
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

    const handleDragStart = (e: React.DragEvent, id: string) => {
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

    const executeTransfer = () => {
        const value = parseFloat(transferValue.replace(/\./g, "").replace(",", "."));
        if (isNaN(value) || value <= 0 || !transferIntent) return;

        const { sourceId, targetId } = transferIntent;

        setAccounts((prev) => 
            prev.map((a) => {
                if (a.id === sourceId) return { ...a, balance: a.balance - value };
                if (a.id === targetId) return { ...a, balance: a.balance + value };
                return a;
            })
        );

        setTransferIntent(null);
        setTransferValue("");
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUpdateAccount = async (id: string, updates: any): Promise<ActionResponse> => {
        const res = await updateAccountAction(id, updates);
        if (res.success && res.data) {
            setAccounts((prev) => prev.map((a) => (a.id === id ? { 
                ...a, 
                ...updates, 
                colorHex: updates.color_hex || a.colorHex,
                lastSyncedAt: new Date()
            } : a)));
            
            // If the currently open account is the one being updated, refresh it
            if (selectedAccount?.id === id) {
                setSelectedAccount(prev => prev ? { 
                    ...prev, 
                    ...updates, 
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCreateAccount = async (newAccount: any) => {
        const accountInsert = {
            name: newAccount.name,
            institution: newAccount.institution,
            category: newAccount.category,
            balance: newAccount.balance || 0,
            color_hex: newAccount.colorHex,
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
        <div className="relative min-h-[calc(100vh-64px)] w-full pb-32">
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

            <PageHeader
                subtitle="Liquidez Imediata"
                className="mb-16"
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
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
                            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-zinc-100">Transferência Rápida</h3>
                                    <button
                                        onClick={() => setTransferIntent(null)}
                                        className="text-zinc-500 hover:text-zinc-300"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800 mb-6">
                                    <div className="text-center flex-1">
                                        <p className="text-xs text-zinc-500 mb-1">De</p>
                                        <p
                                            className="text-sm font-semibold text-zinc-200"
                                            style={{ color: source.colorHex }}
                                        >
                                            {source.name}
                                        </p>
                                    </div>
                                    <ArrowRight className="text-zinc-600 w-5 h-5" />
                                    <div className="text-center flex-1">
                                        <p className="text-xs text-zinc-500 mb-1">Para</p>
                                        <p
                                            className="text-sm font-semibold text-zinc-200"
                                            style={{ color: target.colorHex }}
                                        >
                                            {target.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2 block text-center">
                                        Valor a transferir
                                    </label>
                                    <div className="relative flex justify-center">
                                        <span className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-500 text-2xl">
                                            R$
                                        </span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={transferValue}
                                            onChange={handleTransferValueChange}
                                            autoFocus
                                            className="w-full text-center text-5xl font-bold bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-800"
                                            placeholder="0,00"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={executeTransfer}
                                    disabled={
                                        !transferValue ||
                                        parseFloat(transferValue.replace(/\./g, "").replace(",", ".")) <= 0
                                    }
                                    className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                                >
                                    Confirmar Transferência
                                </button>
                            </div>
                        </div>
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
