"use client";

import { motion } from "framer-motion";
import { HardHat, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface UnderConstructionProps {
    title: string;
}

export function UnderConstruction({ title }: UnderConstructionProps) {
    return (
        <div className="w-full min-h-screen flex flex-col relative overflow-hidden">
            {/* Background glow full width */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(16,185,129,0.12),transparent)] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full flex-1 flex flex-col relative z-10"
            >
                <div className="w-full flex-1 flex flex-col items-center justify-center text-center px-6 sm:px-12 pt-32 pb-24 gap-6 bg-zinc-900/40 border-b border-white/5 backdrop-blur-2xl shadow-2xl">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 mb-2">
                        <HardHat className="w-10 h-10 text-emerald-400" />
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">{title}</h1>

                    <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                        Estamos trabalhando duro para finalizar os detalhes desta seção. Em breve ela estará disponível.
                    </p>

                    <Link
                        href="/"
                        className="mt-6 group relative inline-flex flex-row items-center justify-center gap-2 rounded-full bg-white/5 px-6 py-3 text-zinc-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all active:scale-95 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Voltar para a página inicial
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
