import React, { useState } from "react";
import { X, Check, Aperture } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";

interface CreateAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onCreate: (account: any) => void;
}

const CATEGORIES = [
    { value: "checking", label: "Conta Corrente" },
    { value: "savings", label: "Conta Poupança" },
    { value: "wallet", label: "Carteira (Dinheiro)" },
    { value: "vault", label: "Cofre / Investimento" },
    { value: "credit", label: "Cartão de Crédito" },
];

const COLORS = [
    "#8A05BE", // Nubank Purple
    "#EC7000", // Itaú Orange
    "#10B981", // Emerald Green
    "#005CA9", // Caixa Blue
    "#FF7A00", // Inter Orange
    "#E11138", // Bradesco Red
    "#F4D03F", // Banco do Brasil Yellow
    "#34495E", // Dark Gray
];

export function CreateAccountModal({ isOpen, onClose, onCreate }: CreateAccountModalProps) {
    const [name, setName] = useState("");
    const [institution, setInstitution] = useState("");
    const [category, setCategory] = useState<"checking" | "savings" | "wallet" | "vault" | "credit">("checking");
    const [colorHex, setColorHex] = useState(COLORS[0]);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [initialBalance, setInitialBalance] = useState("");

    // Credit specific fields
    const [creditLimit, setCreditLimit] = useState("");
    const [creditClosingDays, setCreditClosingDays] = useState("5");

    if (!isOpen) return null;

    const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
        const value = e.target.value.replace(/\D/g, "");
        if (!value) {
            setter("");
            return;
        }
        const numericValue = parseInt(value, 10) / 100;
        const formatted = new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericValue);
        setter(formatted);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const parseValue = (val: string) => parseFloat(val.replace(/\./g, "").replace(",", ".")) || 0;

        const balanceNum = parseValue(initialBalance);
        const creditLimitNum = category === "credit" ? parseValue(creditLimit) : undefined;
        const closingDaysNum = category === "credit" ? parseInt(creditClosingDays) || 0 : undefined;

        const newAccount = {
            id: Math.random().toString(36).substring(7),
            name,
            institution,
            category,
            colorHex,
            balance: category === "credit" ? 0 : balanceNum, // Balance is 0 for credit card, "balance" here acts as total limit maybe, but we use creditUsed instead
            creditLimit: creditLimitNum,
            creditUsed: category === "credit" ? 0 : undefined,
            creditClosingDays: closingDaysNum,
            lastSyncedAt: new Date(),
            members: [{ id: "u1", name: "Você", role: "owner" }],
            initialTransactionAmount: category !== "credit" ? balanceNum : 0, // Useful for creating the initial transaction
        };

        onCreate(newAccount);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-zinc-100">Nova Conta</h3>
                        <p className="text-sm text-zinc-400">Adicione uma nova conta ou cartão ao seu painel.</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-zinc-400">Nome da Conta</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="ex: Conta Nu"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-700 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-zinc-400">Instituição</label>
                            <input
                                type="text"
                                required
                                value={institution}
                                onChange={(e) => setInstitution(e.target.value)}
                                placeholder="ex: Nubank"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-700 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-zinc-400">Tipo de Conta</label>
                        <select
                            value={category}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            onChange={(e) => setCategory(e.target.value as any)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2 relative">
                        <label className="text-sm font-medium text-zinc-400">Cor de Identificação</label>
                        <div className="flex flex-wrap gap-3">
                            {COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => {
                                        setColorHex(color);
                                        setIsColorPickerOpen(false);
                                    }}
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                        colorHex === color && !isColorPickerOpen
                                            ? "ring-2 ring-offset-2 ring-offset-zinc-900 ring-zinc-100 scale-110"
                                            : "hover:scale-110",
                                    )}
                                    style={{ backgroundColor: color }}
                                >
                                    {colorHex === color && !isColorPickerOpen && (
                                        <Check size={16} className="text-white mix-blend-difference" />
                                    )}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all bg-zinc-900 border border-zinc-800",
                                    isColorPickerOpen || !COLORS.includes(colorHex)
                                        ? "ring-2 ring-offset-2 ring-offset-zinc-900 ring-zinc-100 scale-110"
                                        : "hover:scale-110",
                                )}
                                style={
                                    !COLORS.includes(colorHex) && !isColorPickerOpen
                                        ? { backgroundColor: colorHex }
                                        : {}
                                }
                            >
                                <Aperture
                                    strokeWidth={1.5}
                                    size={20}
                                    className={cn(
                                        "text-zinc-400",
                                        !COLORS.includes(colorHex) && !isColorPickerOpen
                                            ? "text-white mix-blend-difference"
                                            : "",
                                    )}
                                />
                            </button>
                        </div>
                        {isColorPickerOpen && (
                            <div className="absolute top-full left-0 mt-3 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl z-50 animate-in fade-in zoom-in-95">
                                <HexColorPicker color={colorHex} onChange={setColorHex} className="!w-48 !h-48" />
                            </div>
                        )}
                    </div>

                    {category === "credit" ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-zinc-400">Limite de Crédito</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">R$</span>
                                    <input
                                        type="text"
                                        required
                                        inputMode="numeric"
                                        value={creditLimit}
                                        onChange={(e) => handleBalanceChange(e, setCreditLimit)}
                                        placeholder="0,00"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-zinc-100 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-zinc-400">Dias para Fechar Fatura</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max="31"
                                    value={creditClosingDays}
                                    onChange={(e) => setCreditClosingDays(e.target.value)}
                                    placeholder="ex: 5"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-zinc-400">Saldo Inicial</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">R$</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={initialBalance}
                                    onChange={(e) => handleBalanceChange(e, setInitialBalance)}
                                    placeholder="0,00"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-zinc-100 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                />
                            </div>
                            <p className="text-xs text-zinc-500">Isso criará uma transação de lançamento inicial.</p>
                        </div>
                    )}

                    <div className="pt-4 mt-2 border-t border-zinc-800">
                        <button
                            type="submit"
                            disabled={!name || !institution}
                            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                        >
                            Criar Conta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
