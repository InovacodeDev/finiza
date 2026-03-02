"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Plus, CreditCard as CreditCardIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { CreateCreditCardModal } from "@/components/ui/CreateCreditCardModal";
import { fetchAccounts } from "@/app/actions/accountActions";
import { fetchCreditCards, createCreditCard } from "@/app/actions/creditCardActions";
import { fetchInvoices, payInvoice } from "@/app/actions/invoiceActions";

export default function CreditCardsPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [cards, setCards] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [accounts, setAccounts] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [invoices, setInvoices] = useState<any[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        setIsLoading(true);
        const [accs, ccs, invs] = await Promise.all([fetchAccounts(), fetchCreditCards(), fetchInvoices()]);
        setAccounts(accs);
        setCards(ccs);
        setInvoices(invs);
        setIsLoading(false);
    };

    useEffect(() => {
        // Actually, fetchAccounts from transactionActions was never exposed. Let's create an accountActions.ts if missing,
        // OR wait, transactionActions doesn't have fetchAccounts exposed, but let's check it.
        // For now, assume it throws if not found, I'll fix fetchAccounts in next step if it's missing.
        loadData();
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCreateCard = async (data: any) => {
        const res = await createCreditCard(data);
        if (res.success) {
            loadData();
        } else {
            alert(res.error);
        }
    };

    const handlePayInvoice = async (invoiceId: string) => {
        if (!confirm("Tem certeza que deseja pagar esta fatura agora?")) return;
        const res = await payInvoice(invoiceId);
        if (res.success) {
            loadData();
        } else {
            alert(res.error);
        }
    };

    return (
        <main className="relative min-h-[calc(100vh-64px)] w-full pb-32">
            <PageHeader title="Cartões de Crédito" subtitle="A verdadeira bússola do seu fluxo de caixa." />

            <div className="flex justify-end mb-8">
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/20"
                >
                    <Plus size={20} />
                    <span className="hidden sm:inline">Adicionar Cartão</span>
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
            ) : cards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-950/30">
                    <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                        <CreditCardIcon className="w-8 h-8 text-zinc-600" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-100 mb-2">Nenhum cartão cadastrado</h3>
                    <p className="text-zinc-500 max-w-md mb-6">
                        Adicione seu primeiro cartão de crédito para acompanhar as faturas e projetar o seu fluxo de
                        caixa no futuro.
                    </p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-zinc-100 hover:bg-white text-zinc-900 font-semibold py-2 px-6 rounded-xl transition-all"
                    >
                        Criar meu primeiro cartão
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {cards.map((card) => {
                        const cardInvoices = invoices.filter((inv) => inv.credit_card_id === card.id);
                        // Find current open invoice
                        const currentInvoice = cardInvoices.find((inv) => inv.status === "pending");

                        return (
                            <GlassCard
                                key={card.id}
                                className="flex flex-col p-6 border border-zinc-800/60 transition-colors hover:border-zinc-700/80"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-inner">
                                            <CreditCardIcon className="w-6 h-6 text-zinc-300" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-zinc-100">{card.name}</h3>
                                            <p className="text-xs text-zinc-500 flex items-center gap-1">
                                                Conta vinculada:{" "}
                                                <span className="font-semibold text-zinc-400">
                                                    {card.account?.name || "Desconhecida"}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 mb-6">
                                    <div className="flex justify-between items-end border-b border-zinc-800/50 pb-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">
                                                Fatura Atual
                                            </span>
                                            <span className="text-3xl font-bold text-zinc-100">
                                                R${" "}
                                                {currentInvoice
                                                    ? currentInvoice.amount.toLocaleString("pt-BR", {
                                                          minimumFractionDigits: 2,
                                                      })
                                                    : "0,00"}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs text-zinc-500 mb-1">Limite</span>
                                            <span className="text-sm font-semibold text-emerald-500">
                                                R${" "}
                                                {card.limit_amount.toLocaleString("pt-BR", {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-zinc-950/50 border border-zinc-800 p-3 rounded-xl flex flex-col">
                                            <span className="text-xs text-zinc-500 mb-1">Fechamento</span>
                                            <span className="text-sm font-medium text-zinc-300">
                                                Dia {card.closing_day}
                                            </span>
                                        </div>
                                        <div className="bg-zinc-950/50 border border-zinc-800 p-3 rounded-xl flex flex-col">
                                            <span className="text-xs text-zinc-500 mb-1">Vencimento</span>
                                            <span className="text-sm font-medium text-zinc-300">
                                                Dia {card.due_day}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-2">
                                    {currentInvoice ? (
                                        <button
                                            onClick={() => handlePayInvoice(currentInvoice.id)}
                                            className="w-full bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-emerald-500/20"
                                        >
                                            Pagar Fatura R${" "}
                                            {currentInvoice.amount.toLocaleString("pt-BR", {
                                                minimumFractionDigits: 2,
                                            })}
                                        </button>
                                    ) : (
                                        <button
                                            disabled
                                            className="w-full bg-zinc-900 text-zinc-500 font-semibold py-3 rounded-xl transition-all cursor-not-allowed border border-zinc-800 border-dashed"
                                        >
                                            Nenhuma fatura em aberto
                                        </button>
                                    )}
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>
            )}

            <CreateCreditCardModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                accounts={accounts}
                onCreate={handleCreateCard}
            />
        </main>
    );
}
