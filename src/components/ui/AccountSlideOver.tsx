import React, { useState, useEffect } from "react";
import { X, Check, Trash2, Edit2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    accountId: string;
    name: string;
    institution: string;
    balance: number;
    colorHex: string;
}

export function AccountSlideOver({
    isOpen,
    onClose,
    accountId,
    name,
    institution,
    balance,
    colorHex,
}: AccountSlideOverProps) {
    const [activeTab, setActiveTab] = useState<"ajuste" | "historico" | "config">("ajuste");
    const [adjustedBalance, setAdjustedBalance] = useState(balance.toString());
    const [swipeLeftId, setSwipeLeftId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Mocked recent transactions
    const transactions = [
        { id: "1", date: "Hoje", description: "Compra iFood", amount: -65.9, category: "Alimentação" },
        { id: "2", date: "Ontem", description: "Pix João", amount: -150.0, category: "Transferências" },
        { id: "3", date: "Ontem", description: "Recebimento de Salário", amount: 5400.0, category: "Renda" },
        { id: "4", date: "24 Fev", description: "Uber", amount: -24.5, category: "Transporte" },
    ];

    const handleSyncBalance = () => {
        // Logic to sync the balance would go here
        console.log(`Syncing balance to ${adjustedBalance}`);
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-zinc-950/40 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Slide-Over Drawer */}
            <div
                className={cn(
                    "fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-zinc-950/80 backdrop-blur-xl border-l border-zinc-800 shadow-2xl transform transition-transform duration-500 ease-out flex flex-col",
                    isOpen ? "translate-x-0" : "translate-x-full",
                )}
            >
                {/* Glow behind the sidebar */}
                <div
                    className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-10 blur-[100px] pointer-events-none"
                    style={{ backgroundColor: colorHex }}
                />

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-800/50">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-semibold text-zinc-100">{name}</h2>
                        <p className="text-sm text-zinc-400">{institution}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 pt-4 gap-6 border-b border-zinc-800/50">
                    {(["ajuste", "historico", "config"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "pb-3 text-sm font-medium transition-colors relative",
                                activeTab === tab ? "text-primary" : "text-zinc-500 hover:text-zinc-300",
                            )}
                        >
                            {tab === "ajuste" && "Sincronizar"}
                            {tab === "historico" && "Histórico"}
                            {tab === "config" && "Ajustes"}
                            {activeTab === tab && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
                    {activeTab === "ajuste" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center space-y-2">
                                <p className="text-zinc-400 text-sm">Saldo real no app do banco</p>
                                <div className="relative inline-block">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-2xl">
                                        R$
                                    </span>
                                    <input
                                        type="number"
                                        value={adjustedBalance}
                                        onChange={(e) => setAdjustedBalance(e.target.value)}
                                        className="w-full text-center text-4xl sm:text-5xl font-bold bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-700 w-[280px]"
                                    />
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex gap-3 text-sm">
                                <Zap className="text-primary w-5 h-5 flex-shrink-0" />
                                <p className="text-zinc-300">
                                    O Finiza criará automaticamente uma transação de{" "}
                                    <strong className="text-primary">Ajuste de Balanço</strong> para resolver a
                                    diferença sem quebrar suas estatísticas.
                                </p>
                            </div>

                            <button
                                onClick={handleSyncBalance}
                                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                            >
                                <Check size={20} />
                                Sincronizar Saldo Agora
                            </button>
                        </div>
                    )}

                    {activeTab === "historico" && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="text-zinc-400 text-sm font-medium mb-4">Últimas 10 movimentações</h3>

                            {transactions.map((t) => (
                                <div
                                    key={t.id}
                                    className="relative overflow-hidden group rounded-lg"
                                    onTouchStart={() => {
                                        /* Touch logic for mobile swipe */
                                    }}
                                >
                                    {/* Fake background for swipe action */}
                                    <div className="absolute inset-y-0 right-0 w-16 bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center rounded-r-lg">
                                        <Trash2 size={18} />
                                    </div>

                                    <div
                                        className={cn(
                                            "relative bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 flex justify-between items-center transition-transform hover:bg-zinc-800",
                                            swipeLeftId === t.id && "-translate-x-16",
                                        )}
                                        onClick={() => setSwipeLeftId(swipeLeftId === t.id ? null : t.id)}
                                    >
                                        <div>
                                            <p className="text-zinc-200 font-medium">{t.description}</p>
                                            <div className="flex gap-2 text-xs text-zinc-500 mt-1">
                                                <span>{t.date}</span>
                                                <span>•</span>
                                                <span>{t.category}</span>
                                            </div>
                                        </div>
                                        <div
                                            className={cn(
                                                "font-medium",
                                                t.amount > 0 ? "text-emerald-400" : "text-zinc-100",
                                            )}
                                        >
                                            {t.amount > 0 ? "+" : ""}
                                            {t.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "config" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2 block">
                                    Nome da Conta
                                </label>
                                <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg focus-within:border-zinc-700 transition-colors">
                                    <input
                                        type="text"
                                        defaultValue={name}
                                        className="flex-1 bg-transparent px-4 py-3 outline-none text-zinc-100"
                                    />
                                    <button className="px-4 text-zinc-500 hover:text-zinc-300">
                                        <Edit2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2 block">
                                    Identidade Visual
                                </label>
                                <div className="flex gap-4 items-center">
                                    <div
                                        className="w-12 h-12 rounded-xl border border-zinc-800 flex items-center justify-center"
                                        style={{ backgroundColor: `${colorHex}20` }}
                                    >
                                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colorHex }} />
                                    </div>
                                    <button className="text-sm text-zinc-400 hover:text-zinc-200 underline decoration-zinc-700 underline-offset-4">
                                        Trocar instituição
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2 block">
                                    Sincronia Doméstica
                                </label>
                                <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300 text-center uppercase">
                                                EU
                                            </div>
                                            <div className="text-sm">
                                                <span className="text-zinc-200">Você</span>{" "}
                                                <span className="text-zinc-500">(Proprietário)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-sm text-primary hover:text-primary/80 font-medium">
                                        + Adicionar pessoa
                                    </button>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-zinc-800/50">
                                <button className="text-sm text-red-400 hover:text-red-300 font-medium w-full text-left flex items-center gap-2">
                                    <Trash2 size={16} /> Deletar Conta e Histórico
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
