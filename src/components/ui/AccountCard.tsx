import React from "react";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AccountMember {
    id: string;
    name: string;
    avatarUrl?: string;
    role: "owner" | "editor" | "viewer";
}

interface AccountCardProps {
    id: string;
    name: string;
    institution: string;
    balance: number;
    projectedBalance?: number; // Only for Contas de Giro
    category: "checking" | "savings" | "wallet" | "vault" | "credit";
    colorHex: string;
    iconSlug?: string;
    members: AccountMember[];
    lastSyncedAt?: Date;
    onClick?: () => void;
    // Specific for credit or vault
    creditLimit?: number;
    creditUsed?: number;
    creditClosingDays?: number;
    vaultYieldRate?: string;
    vaultHistoryData?: number[]; // Simple array for sparkline
    draggable?: boolean;
    onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function AccountCard({
    name,
    institution,
    balance,
    projectedBalance,
    category,
    colorHex,
    members,
    lastSyncedAt,
    onClick,
    creditLimit,
    creditUsed,
    creditClosingDays,
    vaultYieldRate,
    draggable,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
}: AccountCardProps) {
    // Sync Status logic
    const isSyncedRecently = lastSyncedAt && new Date().getTime() - lastSyncedAt.getTime() < 24 * 60 * 60 * 1000; // 24 hours

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
    };

    const syncStatusColor = isSyncedRecently ? "bg-emerald-500" : "bg-yellow-500";
    const syncStatusText = isSyncedRecently
        ? "Sincronizado hoje"
        : lastSyncedAt
          ? `Atualizado ${lastSyncedAt.toLocaleDateString("pt-BR")}`
          : "Não sincronizado";

    return (
        <GlassCard
            onClick={onClick}
            draggable={draggable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={cn(
                "relative overflow-hidden cursor-pointer group transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-900/40",
                "flex flex-col gap-4 p-5",
            )}
        >
            {/* Background glow based on institution color */}
            <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-30"
                style={{ backgroundColor: colorHex }}
            />

            <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-3">
                    {/* Institutional Icon Placeholder with Color */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-900/50 border border-zinc-800">
                        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: colorHex }} />
                    </div>
                    <div>
                        <h3 className="text-zinc-100 font-medium text-base">{name}</h3>
                        <p className="text-zinc-400 text-xs">{institution}</p>
                    </div>
                </div>

                {/* Domestic Sync Avatar(s) */}
                <div className="flex -space-x-2">
                    {members.slice(0, 3).map((member, i) => (
                        <div
                            key={member.id}
                            className="w-7 h-7 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center overflow-hidden z-10"
                            style={{ zIndex: 10 - i }}
                            title={`${member.name} (${member.role})`}
                        >
                            {member.avatarUrl ? (
                                <Image
                                    src={member.avatarUrl}
                                    alt={member.name}
                                    width={28}
                                    height={28}
                                    className="object-cover"
                                />
                            ) : (
                                <span className="text-[10px] text-zinc-300 font-medium">{member.name.charAt(0)}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-10 mt-2">
                {category === "credit" ? (
                    <div>
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                                Fatura Atual
                            </span>
                            <span className="text-2xl font-bold text-zinc-100">{formatCurrency(creditUsed || 0)}</span>
                        </div>
                        {/* Limit Progress */}
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                            <div
                                className="h-full bg-zinc-400 rounded-full transition-all"
                                style={{ width: `${Math.min(((creditUsed || 0) / (creditLimit || 1)) * 100, 100)}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-zinc-500 text-xs">Limite: {formatCurrency(creditLimit || 0)}</span>
                            {creditClosingDays !== undefined && (
                                <span
                                    className={cn(
                                        "text-xs font-medium",
                                        creditClosingDays <= 5 ? "text-red-400" : "text-emerald-400",
                                    )}
                                >
                                    Fecha em {creditClosingDays} dias
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="text-3xl font-semibold text-zinc-50 tabular-nums tracking-tight">
                            {formatCurrency(balance)}
                        </div>

                        {/* Differential: Projection for Checking/Wallet */}
                        {(category === "checking" || category === "wallet") && projectedBalance !== undefined && (
                            <div className="flex items-center gap-1.5 mt-2 text-zinc-400 text-sm">
                                <span className="text-zinc-500">➔</span>
                                <span>Previsto dia 30:</span>
                                <span
                                    className={cn(
                                        "font-medium",
                                        projectedBalance >= balance ? "text-emerald-400/90" : "text-zinc-300",
                                    )}
                                >
                                    {formatCurrency(projectedBalance)}
                                </span>
                            </div>
                        )}

                        {/* Differential: Vault extras */}
                        {category === "vault" && vaultYieldRate && (
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                                    {vaultYieldRate}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Sync Status Footer */}
            <div className="relative z-10 flex items-center gap-1.5 mt-2 pt-3 border-t border-zinc-800/50">
                <div className="relative flex h-2 w-2">
                    {isSyncedRecently && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400"></span>
                    )}
                    <span className={cn("relative inline-flex rounded-full h-2 w-2", syncStatusColor)}></span>
                </div>
                <span className="text-xs text-zinc-500">{syncStatusText}</span>
            </div>
        </GlassCard>
    );
}
