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
    TrendingUp,
    PlusCircle,
    ShoppingBag,
    Heart,
    BookOpen,
    Gamepad,
    Tv,
    PawPrint,
    Plane,
    Gift,
    FileText,
    MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
    "trending-up": TrendingUp,
    "plus-circle": PlusCircle,
    "shopping-bag": ShoppingBag,
    heart: Heart,
    "book-open": BookOpen,
    gamepad: Gamepad,
    tv: Tv,
    "paw-print": PawPrint,
    plane: Plane,
    gift: Gift,
    "file-text": FileText,
    "more-horizontal": MoreHorizontal,
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
    isSystemReadonly?: boolean;
    creditCardName?: string;
    onClick?: () => void;
    isSelected?: boolean;
    onToggleSelection?: (e: React.MouseEvent) => void;
    isSelectionMode?: boolean;
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
    isSystemReadonly,
    creditCardName,
    onClick,
    isSelected = false,
    onToggleSelection,
    isSelectionMode = false,
}: TransactionItemProps) {
    const IconComponent = categoryIconSlug ? iconMap[categoryIconSlug] || DollarSign : DollarSign;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
    };

    const isIncome = type === "income";
    const isTransfer = type === "transfer";
    const isAdjustment = type === "adjustment";

    const handleItemClick = (e: React.MouseEvent) => {
        if (isSelectionMode && onToggleSelection) {
            e.stopPropagation();
            onToggleSelection(e);
            return;
        }
        if (onClick) onClick();
    };

    return (
        <div className="flex items-center gap-2 group w-full">
            {/* Left: Checkbox (Visible in selection mode or on hover) */}
            <AnimatePresence mode="popLayout">
                {isSelectionMode && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, width: 0 }}
                        animate={{ opacity: 1, scale: 1, width: "auto" }}
                        exit={{ opacity: 0, scale: 0.8, width: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="flex items-center justify-center pl-2"
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onToggleSelection) onToggleSelection(e);
                            }}
                            className={cn(
                                "w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center",
                                isSelected 
                                    ? "bg-primary border-primary text-primary-foreground" 
                                    : "border-zinc-700 bg-zinc-900 group-hover:border-zinc-500"
                            )}
                        >
                            {isSelected && <Check size={14} strokeWidth={3} />}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={handleItemClick}
                className={cn(
                    "flex-1 flex items-center gap-4 p-4 transition-all rounded-2xl group text-left",
                    isSelected ? "bg-primary/5 border border-primary/20" : "hover:bg-zinc-900/50 border border-transparent"
                )}
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

                        {creditCardName && (
                            <>
                                <span className="opacity-50">•</span>
                                <span className="truncate font-semibold text-zinc-400">{creditCardName}</span>
                            </>
                        )}

                        {isTransfer && targetAccountName && (
                            <>
                                <ArrowRightLeft size={10} className="mx-1 opacity-50" />
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: targetAccountColorHex }} />
                                <span className="truncate">{targetAccountName}</span>
                            </>
                        )}

                        {isSystemReadonly && (
                            <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-zinc-800 text-zinc-400">
                                Auto
                            </span>
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
        </div>
    );
}

