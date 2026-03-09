/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { X, ArrowDown, ArrowUp, ArrowRightLeft, Settings2 } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TransactionInsert } from "@/app/actions/transactionActions";

interface CreateTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    accounts: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    creditCards?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transactionToEdit?: any | null;
    onSave: (transaction: Omit<TransactionInsert, "user_id">, installments?: number, id?: string) => void;
    onDelete?: (id: string, isGroup: boolean) => void;
}

const TYPES = [
    { id: "income" as const, label: "Receita", icon: ArrowUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: "expense" as const, label: "Despesa", icon: ArrowDown, color: "text-red-500", bg: "bg-red-500/10" },
    {
        id: "transfer" as const,
        label: "Transferência",
        icon: ArrowRightLeft,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    { id: "adjustment" as const, label: "Ajuste", icon: Settings2, color: "text-zinc-400", bg: "bg-zinc-800" },
];

export function CreateTransactionModal({
    isOpen,
    onClose,
    accounts,
    categories,
    creditCards = [],
    transactionToEdit,
    onSave,
    onDelete,
}: CreateTransactionModalProps) {
    const shouldReduceMotion = useReducedMotion();

    const modalVariants = {
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

    const backdropVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 }
    };

    const [type, setType] = useState<"income" | "expense" | "transfer" | "adjustment">("expense");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    const [categoryId, setCategoryId] = useState("");
    const [accountId, setAccountId] = useState("");
    const [destinationAccountId, setDestinationAccountId] = useState("");

    const [isCreditCard, setIsCreditCard] = useState(false);
    const [creditCardId, setCreditCardId] = useState("");
    const [installments, setInstallments] = useState("1");

    const [isRecurring, setIsRecurring] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (transactionToEdit) {
                setType(transactionToEdit.type);
                setAmount(
                    new Intl.NumberFormat("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(transactionToEdit.amount),
                );
                setDescription(transactionToEdit.description);
                setDate(transactionToEdit.transaction_date);
                setCategoryId(transactionToEdit.category_id || "");
                setAccountId(transactionToEdit.account_id || "");
                setDestinationAccountId(transactionToEdit.destination_account_id || "");

                if (transactionToEdit.credit_card_id) {
                    setIsCreditCard(true);
                    setCreditCardId(transactionToEdit.credit_card_id);
                } else {
                    setIsCreditCard(false);
                    setCreditCardId("");
                }

                setInstallments("1");
                setIsRecurring(transactionToEdit.is_recurring || false);
            } else {
                setType("expense");
                setAmount("");
                setDescription("");
                setDate(new Date().toISOString().split("T")[0]);
                setCategoryId("");
                setAccountId("");
                setDestinationAccountId("");
                setIsCreditCard(false);
                setCreditCardId("");
                setInstallments("1");
                setIsRecurring(false);
            }
        }
    }, [isOpen, transactionToEdit]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        if (!value) {
            setAmount("");
            return;
        }
        const numericValue = parseInt(value, 10) / 100;
        const formatted = new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericValue);
        setAmount(formatted);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const numericAmount = parseFloat(amount.replace(/\./g, "").replace(",", ".")) || 0;

        const transaction: Omit<TransactionInsert, "user_id"> = {
            type,
            amount: numericAmount,
            description,
            transaction_date: date,
            account_id: accountId,
            status: "paid", // Simplify for now
            is_recurring: isRecurring,
        };

        if (type === "transfer") {
            transaction.destination_account_id = destinationAccountId;
        } else if (type === "adjustment") {
            // Find adjustment category
            const adjCat = categories.find((c) => c.is_system && c.name === "Ajuste de Saldo");
            if (adjCat) transaction.category_id = adjCat.id;
        } else {
            transaction.category_id = categoryId || null;
            if (type === "expense" && isCreditCard && creditCardId) {
                transaction.credit_card_id = creditCardId;
                // Set the account_id to the credit card's linked account
                const cc = creditCards.find((c) => c.id === creditCardId);
                if (cc) transaction.account_id = cc.account_id;
            }
        }

        const parsedInstallments = isCreditCard && !transactionToEdit ? parseInt(installments, 10) || 1 : 1;

        onSave(transaction, parsedInstallments, transactionToEdit?.id);
        onClose();
    };

    const isTransfer = type === "transfer";
    const isAdjustment = type === "adjustment";
    const isEditing = !!transactionToEdit;
    const isCreditCardDisabled = isEditing && !!transactionToEdit?.credit_card_id;

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
                        className="relative bg-zinc-900 border border-zinc-800 p-6 rounded-3xl w-full max-w-lg shadow-2xl my-8"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-zinc-100">
                                {isEditing ? "Editar Transação" : "Nova Transação"}
                            </h3>
                            <div className="flex items-center gap-2">
                                {isEditing && onDelete && (
                                    <button
                                        type="button"
                                        onClick={() => onDelete(transactionToEdit.id, !!transactionToEdit.group_id)}
                                        className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-xl transition-all"
                                        title="Excluir Transação"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M3 6h18" />
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        </svg>
                                    </button>
                                )}
                                <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors p-2">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            {/* Types */}
                            <div className="flex bg-zinc-950/50 p-1 rounded-2xl border border-zinc-800">
                                {TYPES.map((t) => {
                                    const Icon = t.icon;
                                    const isActive = type === t.id;
                                    return (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => setType(t.id)}
                                            disabled={isEditing}
                                            className={cn(
                                                "flex-1 flex flex-col items-center justify-center py-3 gap-1 rounded-xl transition-all",
                                                isActive ? "bg-zinc-800 shadow-md" : "hover:bg-zinc-900",
                                                isEditing && !isActive ? "opacity-30 cursor-not-allowed" : "",
                                            )}
                                        >
                                            <Icon size={18} className={isActive ? t.color : "text-zinc-500"} />
                                            <span
                                                className={cn(
                                                    "text-xs font-semibold",
                                                    isActive ? "text-zinc-100" : "text-zinc-500",
                                                )}
                                            >
                                                {t.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Amount */}
                            <div className="flex flex-col items-center justify-center py-4">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Valor</label>
                                <div className="flex items-center justify-center w-full">
                                    <span className="text-zinc-500 text-2xl mr-2 mb-1">R$</span>
                                    <div className="relative flex items-center justify-center">
                                        {/* Invisible span to dictate the dynamic width of the container */}
                                        <span className="text-5xl font-bold opacity-0 pointer-events-none min-w-[3ch] px-1 whitespace-pre">
                                            {amount || "0,00"}
                                        </span>
                                        <input
                                            type="text"
                                            required
                                            inputMode="numeric"
                                            value={amount}
                                            disabled={isCreditCardDisabled}
                                            onChange={handleAmountChange}
                                            placeholder="0,00"
                                            className={cn(
                                                "absolute inset-0 w-full text-center text-5xl font-bold bg-transparent border-none outline-none placeholder:text-zinc-800 transition-colors",
                                                isCreditCardDisabled ? "opacity-60 cursor-not-allowed" : "",
                                                type === "income"
                                                    ? "text-emerald-500"
                                                    : type === "expense"
                                                      ? "text-red-500"
                                                      : "text-zinc-100",
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Fields Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-zinc-400">Descrição</label>
                                    <input
                                        type="text"
                                        required
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="ex: Mercado Livre"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-zinc-400">Data</label>
                                    <input
                                        type="date"
                                        required
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-primary/50 transition-all [color-scheme:dark]"
                                    />
                                </div>

                                {/* Account Origin */}
                                <div className={cn("flex flex-col gap-2", isTransfer ? "col-span-1" : "col-span-2")}>
                                    {type === "expense" ? (
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-medium text-zinc-400">Origem do Pagamento</label>
                                            <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCreditCard(false)}
                                                    className={cn(
                                                        "px-3 py-1 text-xs font-semibold rounded-md transition-all",
                                                        !isCreditCard
                                                            ? "bg-zinc-800 text-zinc-100"
                                                            : "text-zinc-500 hover:text-zinc-300",
                                                    )}
                                                >
                                                    Conta
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCreditCard(true)}
                                                    className={cn(
                                                        "px-3 py-1 text-xs font-semibold rounded-md transition-all",
                                                        isCreditCard
                                                            ? "bg-zinc-800 text-zinc-100"
                                                            : "text-zinc-500 hover:text-zinc-300",
                                                    )}
                                                >
                                                    Cartão
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="text-sm font-medium text-zinc-400 mb-2">
                                            {isTransfer ? "Origem" : type === "income" ? "Destino" : "Conta"}
                                        </label>
                                    )}

                                    {!isCreditCard || type !== "expense" ? (
                                        <select
                                            required
                                            value={accountId}
                                            onChange={(e) => setAccountId(e.target.value)}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-primary/50 transition-all appearance-none"
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
                                    ) : (
                                        <select
                                            required
                                            value={creditCardId}
                                            onChange={(e) => setCreditCardId(e.target.value)}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-emerald-500/50 transition-all appearance-none"
                                        >
                                            <option value="" disabled>
                                                Selecione um cartão
                                            </option>
                                            {creditCards.map((cc) => (
                                                <option key={cc.id} value={cc.id}>
                                                    {cc.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                {/* Account Destination (Transfer) */}
                                {isTransfer && (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-zinc-400">Destino</label>
                                        <select
                                            required
                                            value={destinationAccountId}
                                            onChange={(e) => setDestinationAccountId(e.target.value)}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-primary/50 transition-all appearance-none"
                                        >
                                            <option value="" disabled>
                                                Selecione uma conta
                                            </option>
                                            {accounts
                                                .filter((a) => a.id !== accountId)
                                                .map((acc) => (
                                                    <option key={acc.id} value={acc.id}>
                                                        {acc.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                )}

                                {/* Category (Income/Expense) */}
                                {!isTransfer && !isAdjustment && (
                                    <div className="flex flex-col gap-2 col-span-2">
                                        <label className="text-sm font-medium text-zinc-400">Categoria</label>
                                        <select
                                            required
                                            value={categoryId}
                                            onChange={(e) => setCategoryId(e.target.value)}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-primary/50 transition-all appearance-none"
                                        >
                                            <option value="" disabled>
                                                Selecione uma categoria
                                            </option>
                                            {categories
                                                .filter((c) => {
                                                    if (c.is_system) return false;
                                                    const incomeCats = [
                                                        "Salário",
                                                        "Rendimentos",
                                                        "Renda Extra",
                                                        "Vendas",
                                                        "Outros",
                                                    ];
                                                    if (type === "income") return incomeCats.includes(c.name);
                                                    if (type === "expense")
                                                        return !incomeCats.includes(c.name) || c.name === "Outros";
                                                    return true;
                                                })
                                                .map((cat) => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                )}

                                {type === "expense" && isCreditCard && !isEditing && (
                                    <div className="flex flex-col gap-2 col-span-2">
                                        <label className="text-sm font-medium text-zinc-400">Parcelas</label>
                                        <input
                                            type="number"
                                            min="1"
                                            required
                                            value={installments}
                                            onChange={(e) => setInstallments(e.target.value)}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-emerald-500/50 transition-all"
                                        />
                                    </div>
                                )}
                            </div>

                            {!isTransfer && !isAdjustment && (
                                <div className="flex items-center gap-3 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800">
                                    <input
                                        type="checkbox"
                                        id="recurring"
                                        checked={isRecurring}
                                        onChange={(e) => setIsRecurring(e.target.checked)}
                                        className="w-5 h-5 rounded border-zinc-700 text-primary focus:ring-primary/50 bg-zinc-900"
                                    />
                                    <div className="flex flex-col">
                                        <label
                                            htmlFor="recurring"
                                            className="text-sm font-semibold text-zinc-200 cursor-pointer"
                                        >
                                            Repetir mensalmente
                                        </label>
                                        <p className="text-xs text-zinc-500">Ajuda a formar a Bússola Temporal</p>
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 mt-2 border-t border-zinc-800">
                                <button
                                    type="submit"
                                    disabled={
                                        !amount ||
                                        !description ||
                                        (!isCreditCard && !accountId) ||
                                        (isCreditCard && type === "expense" && !creditCardId) ||
                                        (isTransfer && !destinationAccountId) ||
                                        (!isTransfer && !isAdjustment && !categoryId)
                                    }
                                    className={cn(
                                        "w-full py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white",
                                        type === "income"
                                            ? "bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                            : type === "expense"
                                              ? "bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                                              : type === "transfer"
                                                ? "bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                                                : "bg-zinc-700 hover:bg-zinc-600 shadow-[0_0_20px_rgba(113,113,122,0.2)]",
                                    )}
                                >
                                    Salvar {TYPES.find((t) => t.id === type)?.label}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
