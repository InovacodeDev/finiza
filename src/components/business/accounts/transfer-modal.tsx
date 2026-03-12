"use client";

import React from "react";
import { X, ArrowRight } from "lucide-react";

interface TransferModalProps {
    source: { name: string; colorHex: string };
    target: { name: string; colorHex: string };
    transferValue: string;
    onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onConfirm: () => void;
    onClose: () => void;
}

export function TransferModal({
    source,
    target,
    transferValue,
    onValueChange,
    onConfirm,
    onClose,
}: TransferModalProps) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-zinc-100">Transferência Rápida</h3>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800 mb-6">
                    <div className="text-center flex-1">
                        <p className="text-xs text-zinc-500 mb-1">De</p>
                        <p className="text-sm font-semibold text-zinc-200" style={{ color: source.colorHex }}>
                            {source.name}
                        </p>
                    </div>
                    <ArrowRight className="text-zinc-600 w-5 h-5" />
                    <div className="text-center flex-1">
                        <p className="text-xs text-zinc-500 mb-1">Para</p>
                        <p className="text-sm font-semibold text-zinc-200" style={{ color: target.colorHex }}>
                            {target.name}
                        </p>
                    </div>
                </div>

                <div className="mb-8">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2 block text-center">
                        Valor a transferir
                    </label>
                    <div className="relative flex justify-center">
                        <span className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-500 text-2xl">R$</span>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={transferValue}
                            onChange={onValueChange}
                            autoFocus
                            className="w-full text-center text-5xl font-bold bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-800"
                            placeholder="0,00"
                        />
                    </div>
                </div>

                <button
                    onClick={onConfirm}
                    disabled={!transferValue || parseFloat(transferValue.replace(/\./g, "").replace(",", ".")) <= 0}
                    className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                >
                    Confirmar Transferência
                </button>
            </div>
        </div>
    );
}
