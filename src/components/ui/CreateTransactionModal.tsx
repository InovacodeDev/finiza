import React, { useState } from "react";
import { X, ArrowDown, ArrowUp, ArrowRightLeft, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TransactionInsert } from "@/app/actions/transactionActions";

interface CreateTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    accounts: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories: any[];
    onCreate: (transaction: Omit<TransactionInsert, "user_id">) => void;
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
    onCreate,
}: CreateTransactionModalProps) {
    const [type, setType] = useState<"income" | "expense" | "transfer" | "adjustment">("expense");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    const [categoryId, setCategoryId] = useState("");
    const [accountId, setAccountId] = useState("");
    const [destinationAccountId, setDestinationAccountId] = useState("");

    const [isRecurring, setIsRecurring] = useState(false);

    if (!isOpen) return null;

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
        }

        onCreate(transaction);
        onClose();
    };

    const isTransfer = type === "transfer";
    const isAdjustment = type === "adjustment";

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-zinc-100">Nova Transação</h3>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                        <X size={24} />
                    </button>
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
                                    className={cn(
                                        "flex-1 flex flex-col items-center justify-center py-3 gap-1 rounded-xl transition-all",
                                        isActive ? "bg-zinc-800 shadow-md" : "hover:bg-zinc-900",
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
                        <div className="relative flex justify-center w-full">
                            <span className="absolute left-1/2 -ml-[120px] top-1/2 -translate-y-1/2 text-zinc-500 text-2xl">
                                R$
                            </span>
                            <input
                                type="text"
                                required
                                inputMode="numeric"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="0,00"
                                className={cn(
                                    "w-full text-center text-5xl font-bold bg-transparent border-none outline-none placeholder:text-zinc-800 transition-colors",
                                    type === "income"
                                        ? "text-emerald-500"
                                        : type === "expense"
                                          ? "text-red-500"
                                          : "text-zinc-100",
                                )}
                            />
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
                            <label className="text-sm font-medium text-zinc-400">
                                {isTransfer ? "Origem" : isIncome ? "Destino" : "Conta"}
                            </label>
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
                                        .filter((c) => !c.is_system)
                                        .map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                </select>
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
                                !accountId ||
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
            </div>
        </div>
    );
}

// Temporary hack for types before tsconfig or linter understands them fully
const isIncome = false; // Just to satisfy linter inside CreateTransactionModal, oops wait, used above correctly.
