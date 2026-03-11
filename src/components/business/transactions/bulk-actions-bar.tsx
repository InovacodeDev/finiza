import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, Loader2, ChevronDown, Check } from "lucide-react";
import { Database } from "@/types/supabase";
import { cn } from "@/lib/utils";

type Category = Database["public"]["Tables"]["categories"]["Row"];

interface BulkActionsBarProps {
    selectedCount: number;
    onClear: () => void;
    categories: Category[];
    onApplyCategory: (categoryId: string) => Promise<void>;
    isUpdating?: boolean;
}

export function BulkActionsBar({
    selectedCount,
    onClear,
    categories,
    onApplyCategory,
    isUpdating = false,
}: BulkActionsBarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <AnimatePresence>
            {selectedCount > 0 && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl"
                >
                    <div className="bg-zinc-950/90 backdrop-blur-xl border border-primary/20 shadow-2xl rounded-2xl p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary text-primary-foreground w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">
                                {selectedCount}
                            </div>
                            <p className="text-zinc-100 font-medium hidden sm:block">
                                {selectedCount === 1 ? "Transação selecionada" : "Transações selecionadas"}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    disabled={isUpdating}
                                    className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-zinc-100 px-4 py-2 rounded-xl text-sm font-semibold transition-all border border-zinc-800"
                                >
                                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />}
                                    <span className="hidden sm:inline">Alterar Categoria</span>
                                    <ChevronDown className={cn("w-4 h-4 transition-transform", isMenuOpen && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {isMenuOpen && (
                                        <>
                                            {/* Backdrop for closing the menu */}
                                            <div 
                                                className="fixed inset-0 z-[-1]" 
                                                onClick={() => setIsMenuOpen(false)} 
                                            />
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: -8, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute bottom-full right-0 mb-2 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto z-50"
                                            >
                                                <div className="p-2 flex flex-col gap-1">
                                                    <p className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                                        Selecionar Categoria
                                                    </p>
                                                    {categories.map((cat) => (
                                                        <button
                                                            key={cat.id}
                                                            onClick={() => {
                                                                onApplyCategory(cat.id);
                                                                setIsMenuOpen(false);
                                                            }}
                                                            className="flex items-center gap-3 w-full p-2 hover:bg-zinc-800 rounded-xl transition-colors text-left"
                                                        >
                                                            <div 
                                                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white"
                                                                style={{ backgroundColor: `${cat.color_hex}20`, color: cat.color_hex || '#fff' }}
                                                            >
                                                                <Tag size={16} />
                                                            </div>
                                                            <span className="text-sm font-medium text-zinc-200 truncate">{cat.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                onClick={onClear}
                                disabled={isUpdating}
                                className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl transition-all"
                                title="Limpar seleção"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
