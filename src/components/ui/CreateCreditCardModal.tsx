/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion, Variants } from "framer-motion";

interface CreateCreditCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    accounts: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cardToEdit?: any | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSave: (card: any, id?: string) => void;
    onDelete?: (id: string) => void;
}

export function CreateCreditCardModal({
    isOpen,
    onClose,
    accounts,
    cardToEdit,
    onSave,
    onDelete,
}: CreateCreditCardModalProps) {
    const shouldReduceMotion = useReducedMotion();

    const modalVariants: Variants = {
      hidden: { 
        opacity: 0, 
        scale: shouldReduceMotion ? 1 : 0.95, 
        y: shouldReduceMotion ? 0 : 20 
      },
      visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { type: "spring", duration: 0.3, bounce: 0 } 
      },
      exit: { 
        opacity: 0, 
        scale: shouldReduceMotion ? 1 : 0.95, 
        y: shouldReduceMotion ? 0 : 20, 
        transition: { duration: 0.2 } 
      }
    };

    const backdropVariants: Variants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 }
    };

    const [name, setName] = useState("");
    const [accountId, setAccountId] = useState("");
    const [closingDay, setClosingDay] = useState("");
    const [dueDay, setDueDay] = useState("");
    const [limitAmount, setLimitAmount] = useState("");

    useEffect(() => {
        if (isOpen) {
            if (cardToEdit) {
                setName(cardToEdit.name);
                setAccountId(cardToEdit.account_id);
                setClosingDay(cardToEdit.closing_day.toString());
                setDueDay(cardToEdit.due_day.toString());
                setLimitAmount(
                    new Intl.NumberFormat("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(cardToEdit.limit_amount),
                );
            } else {
                setName("");
                setAccountId("");
                setClosingDay("");
                setDueDay("");
                setLimitAmount("");
            }
        }
    }, [isOpen, cardToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const numericLimit = parseFloat(limitAmount.replace(/\D/g, "")) / 100 || 0;

        onSave(
            {
                name,
                account_id: accountId,
                closing_day: parseInt(closingDay, 10),
                due_day: parseInt(dueDay, 10),
                limit_amount: numericLimit,
            },
            cardToEdit?.id,
        );

        onClose();
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        if (!value) {
            setLimitAmount("");
            return;
        }
        const numericValue = parseInt(value, 10) / 100;
        const formatted = new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericValue);
        setLimitAmount(formatted);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{ willChange: "opacity" }}
                        onClick={onClose}
                        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{ willChange: "transform, opacity" }}
                        className="relative bg-zinc-900 border border-zinc-800 p-6 rounded-3xl w-full max-w-md shadow-2xl my-8"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-zinc-100">
                                {cardToEdit ? "Editar Cartão" : "Novo Cartão de Crédito"}
                            </h3>
                            <div className="flex items-center gap-2">
                                {cardToEdit && onDelete && (
                                    <button
                                        type="button"
                                        onClick={() => onDelete(cardToEdit.id)}
                                        className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-xl transition-all"
                                        title="Excluir Cartão"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                                <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors p-2">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-zinc-400">Nome do Cartão (ex: Nubank Black)</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nome"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-zinc-400">Limite de Crédito</label>
                                <div className="relative flex items-center w-full">
                                    <span className="absolute left-4 text-zinc-500 font-medium">R$</span>
                                    <input
                                        type="text"
                                        required
                                        inputMode="numeric"
                                        value={limitAmount}
                                        onChange={handleAmountChange}
                                        placeholder="0,00"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-zinc-100 font-semibold outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-800"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-zinc-400">Conta para Pagamento</label>
                                <select
                                    required
                                    value={accountId}
                                    onChange={(e) => setAccountId(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-emerald-500/50 transition-all appearance-none"
                                >
                                    <option value="" disabled>
                                        Selecione uma conta
                                    </option>
                                    {accounts.map((acc) => (
                                        <option key={acc.id} value={acc.id}>
                                            {acc.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-zinc-400">Dia do Fechamento</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        max="31"
                                        value={closingDay}
                                        onChange={(e) => setClosingDay(e.target.value)}
                                        placeholder="ex: 25"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-zinc-400">Dia do Vencimento</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        max="31"
                                        value={dueDay}
                                        onChange={(e) => setDueDay(e.target.value)}
                                        placeholder="ex: 5"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-zinc-800/50 mt-2">
                                <button
                                    type="submit"
                                    disabled={!name || !accountId || !closingDay || !dueDay || !limitAmount}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {cardToEdit ? "Salvar Alterações" : "Salvar Cartão"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
