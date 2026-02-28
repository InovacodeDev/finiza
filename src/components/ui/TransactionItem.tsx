import React from "react";
import {
    Check,
    Clock,
    ArrowRightLeft,
    DollarSign,
    Wallet,
    ShoppingCart,
    Coffee,
    Home,
    Car,
    Zap,
    User,
} from "lucide-react";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
    "dollar-sign": DollarSign,
    wallet: Wallet,
    "shopping-cart": ShoppingCart,
    coffee: Coffee,
    home: Home,
    car: Car,
    zap: Zap,
    adjustment: ArrowRightLeft,
};

interface TransactionItemProps {
    id: string;
    description: string;
    amount: number;
    type: "income" | "expense" | "transfer" | "adjustment";
    status: "paid" | "pending";
    categoryIconSlug?: string;
    categoryColorHex?: string;
    accountName: string;
    accountColorHex?: string;
    targetAccountName?: string;
    targetAccountColorHex?: string;
    userName?: string;
    userAvatarUrl?: string;
    onClick?: () => void;
}

export function TransactionItem({
    description,
    amount,
    type,
    status,
    categoryIconSlug,
    categoryColorHex = "#52525b", // zinc-600
    accountName,
    accountColorHex = "#a1a1aa", // zinc-400
    targetAccountName,
    targetAccountColorHex,
    userName,
    userAvatarUrl,
    onClick,
}: TransactionItemProps) {
    const IconComponent = categoryIconSlug ? iconMap[categoryIconSlug] || DollarSign : DollarSign;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
    };

    const isIncome = type === "income";
    const isTransfer = type === "transfer";
    const isAdjustment = type === "adjustment";

    const displayAmount = isIncome ? amount : -amount; // Could be used if needed logically

    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-4 p-4 hover:bg-zinc-900/50 transition-colors rounded-2xl group text-left"
        >
            {/* Left: Icon */}
            <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${categoryColorHex}20`, color: categoryColorHex }}
            >
                {isTransfer ? <ArrowRightLeft size={20} /> : <IconComponent size={20} />}
            </div>

            {/* Center: Details */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2">
                    <p className="font-semibold text-zinc-100 truncate">{description}</p>
                    {/* Sincronia Doméstica: mini-avatar */}
                    {userName && (
                        <div
                            className="flex items-center gap-1 bg-zinc-800/50 px-2 py-0.5 rounded-full"
                            title={`Adicionado por ${userName}`}
                        >
                            {userAvatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={userAvatarUrl} alt={userName} className="w-4 h-4 rounded-full opacity-80" />
                            ) : (
                                <User size={12} className="text-zinc-400" />
                            )}
                            <span className="text-[10px] text-zinc-400 truncate max-w-[60px]">
                                {userName.split(" ")[0]}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accountColorHex }} />
                    <span className="truncate">{accountName}</span>

                    {isTransfer && targetAccountName && (
                        <>
                            <ArrowRightLeft size={10} className="mx-1 opacity-50" />
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: targetAccountColorHex }} />
                            <span className="truncate">{targetAccountName}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Right: Value & Status */}
            <div className="flex flex-col items-end gap-1 shrink-0">
                <p
                    className={cn(
                        "font-bold tabular-nums",
                        isIncome ? "text-emerald-500" : isTransfer || isAdjustment ? "text-zinc-400" : "text-zinc-100",
                    )}
                >
                    {isIncome ? "+" : ""}
                    {formatCurrency(Math.abs(amount))}
                </p>

                <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider">
                    {status === "paid" ? (
                        <span className="text-emerald-500 flex items-center gap-1">
                            <Check size={12} /> Efetivado
                        </span>
                    ) : (
                        <span className="text-zinc-500 flex items-center gap-1 group-hover:text-primary transition-colors">
                            <Clock size={12} /> Previsto
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
}
