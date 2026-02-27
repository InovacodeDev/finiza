"use client";

import React, { useState } from "react";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { AccountCard } from "@/components/ui/AccountCard";
import { AccountSlideOver } from "@/components/ui/AccountSlideOver";
import { ArrowRight, X } from "lucide-react";

// Mock Data
const MOCK_GIRO = [
    {
        id: "1",
        name: "Conta Corrente",
        institution: "Nubank",
        category: "checking" as const,
        balance: 2450.0,
        projectedBalance: 1250.0,
        colorHex: "#8A05BE",
        lastSyncedAt: new Date(),
        members: [{ id: "u1", name: "Você", role: "owner" as const }],
    },
    {
        id: "2",
        name: "Conta Conjunta",
        institution: "Itaú",
        category: "checking" as const,
        balance: 8400.0,
        projectedBalance: 4100.0,
        colorHex: "#EC7000",
        lastSyncedAt: new Date(),
        members: [
            { id: "u1", name: "Você", role: "owner" as const },
            {
                id: "u2",
                name: "Esposa",
                role: "editor" as const,
                avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
            },
        ],
    },
    {
        id: "3",
        name: "Carteira Física",
        institution: "Dinheiro",
        category: "wallet" as const,
        balance: 150.0,
        projectedBalance: 150.0,
        colorHex: "#10B981",
        members: [{ id: "u1", name: "Você", role: "owner" as const }],
    },
];

const MOCK_CREDIT = [
    {
        id: "4",
        name: "Cartão Platinum",
        institution: "Nubank",
        category: "credit" as const,
        balance: 0,
        creditLimit: 12000,
        creditUsed: 3450.9,
        creditClosingDays: 4,
        colorHex: "#8A05BE",
        lastSyncedAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
        members: [{ id: "u1", name: "Você", role: "owner" as const }],
    },
];

const MOCK_VAULT = [
    {
        id: "5",
        name: "Reserva de Emergência",
        institution: "Caixa",
        category: "vault" as const,
        balance: 25000.0,
        vaultYieldRate: "100% CDI",
        colorHex: "#005CA9",
        members: [{ id: "u1", name: "Você", role: "owner" as const }],
    },
    {
        id: "6",
        name: "Viagem 2027",
        institution: "Inter",
        category: "vault" as const,
        balance: 4500.0,
        vaultYieldRate: "CDB 110%",
        colorHex: "#FF7A00",
        members: [
            { id: "u1", name: "Você", role: "owner" as const },
            {
                id: "u2",
                name: "Esposa",
                role: "editor" as const,
                avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
            },
        ],
    },
];

// Helper Accordion Component
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

export default function AccountsPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedAccount, setSelectedAccount] = useState<any | null>(null);

    // Drag and Drop State
    const [draggedAccountId, setDraggedAccountId] = useState<string | null>(null);
    const [dragOverId, setDragOverId] = useState<string | null>(null);
    const [transferIntent, setTransferIntent] = useState<{ sourceId: string; targetId: string } | null>(null);
    const [transferValue, setTransferValue] = useState("");

    const [giroAccounts, setGiroAccounts] = useState(MOCK_GIRO);
    const [creditAccounts, setCreditAccounts] = useState(MOCK_CREDIT);
    const [vaultAccounts, setVaultAccounts] = useState(MOCK_VAULT);

    const totalGiro = giroAccounts.reduce((acc, curr) => acc + curr.balance, 0);
    const totalCreditBills = creditAccounts.reduce((acc, curr) => acc + (curr.creditUsed || 0), 0);
    const realLiquidity = totalGiro - totalCreditBills;

    const totalReserves = vaultAccounts.reduce((acc, curr) => acc + curr.balance, 0);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
    };

    // Parallax Background Setup
    const { scrollY } = useScroll();
    const yBg1 = useTransform(scrollY, [0, 1000], [0, 400]);
    const yBg2 = useTransform(scrollY, [0, 1000], [0, -400]);

    // Helper functions for Drag and Drop
    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedAccountId(id);
        // Optional: set drag image or effect
    };

    const handleDragOver = (e: React.DragEvent, id: string) => {
        e.preventDefault(); // Necessary to allow dropping
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
            const tempAll = [...giroAccounts, ...creditAccounts, ...vaultAccounts];
            const targetAccount = tempAll.find((a) => a.id === targetId);

            if (targetAccount?.category === "credit") {
                alert(
                    "Não é possível transferir saldo para um Cartão de Crédito. Ele deve estar vinculado a uma conta corrente.",
                );
                setDraggedAccountId(null);
                return;
            }

            setTransferIntent({ sourceId: draggedAccountId, targetId });
        }
        setDraggedAccountId(null);
    };

    // Combine all mock data to find specific accounts for the transfer modal
    const ALL_ACCOUNTS = [...giroAccounts, ...creditAccounts, ...vaultAccounts];

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

        const updateBalance = (id: string, amount: number) => {
            setGiroAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, balance: a.balance + amount } : a)));
            setCreditAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, balance: a.balance + amount } : a)));
            setVaultAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, balance: a.balance + amount } : a)));
        };

        updateBalance(sourceId, -value);
        updateBalance(targetId, value);

        setTransferIntent(null);
        setTransferValue("");
    };

    return (
        <div className="relative min-h-[calc(100vh-64px)] w-full p-6 md:p-8 lg:p-12 pb-32">
            {/* Subtle Background Glow w/ Parallax */}
            <motion.div
                style={{ y: yBg1 }}
                className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"
            />
            <motion.div
                style={{ y: yBg2 }}
                className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"
            />

            {/* Header Macro Context */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                <div className="flex flex-col gap-1">
                    <p className="text-zinc-400 font-medium">Liquidez Imediata</p>
                    <div className="flex items-baseline gap-3">
                        <h1 className="text-4xl md:text-5xl font-bold text-zinc-50 tabular-nums tracking-tight">
                            {formatCurrency(realLiquidity)}
                        </h1>
                        <span className="text-xs text-zinc-500 bg-zinc-900/50 px-2 py-1 rounded-md border border-zinc-800">
                            Livre de faturas fechadas
                        </span>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-zinc-400">
                        <p className="text-sm">Patrimônio Alocado (Reservas):</p>
                        <span className="font-semibold">{formatCurrency(totalReserves)}</span>
                    </div>
                </div>

                <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 w-full md:w-auto justify-center group">
                    <Plus size={20} className="transition-transform group-hover:rotate-90" />
                    Nova Movimentação
                </button>
            </div>

            {/* Accordions */}
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

                <AccountSection title="Passivos Circulantes">
                    {creditAccounts.map((account) => (
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

            {/* Slide Over */}
            {selectedAccount && (
                <AccountSlideOver
                    isOpen={!!selectedAccount}
                    onClose={() => setSelectedAccount(null)}
                    accountId={selectedAccount.id}
                    name={selectedAccount.name}
                    institution={selectedAccount.institution}
                    balance={selectedAccount.balance}
                    colorHex={selectedAccount.colorHex}
                    category={selectedAccount.category}
                />
            )}

            {/* Transfer Intent Modal */}
            {transferIntent &&
                (() => {
                    const source = ALL_ACCOUNTS.find((a) => a.id === transferIntent.sourceId);
                    const target = ALL_ACCOUNTS.find((a) => a.id === transferIntent.targetId);

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
        </div>
    );
}
