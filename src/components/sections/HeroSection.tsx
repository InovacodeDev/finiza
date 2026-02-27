"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export function HeroSection() {
    const router = useRouter();
    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center p-6 pt-32 sm:p-12 sm:pt-40 lg:p-24 lg:pt-48 overflow-hidden">
            {/* Luzes Flutuantes */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[128px] pointer-events-none -translate-x-1/2 -translate-y-1/2"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px] pointer-events-none translate-x-1/2 translate-y-1/2"
            />

            <div className="relative z-10 max-w-4xl flex flex-col items-center">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-8xl text-zinc-100"
                >
                    Pare de olhar pelo retrovisor. <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-500">
                        Descubra hoje
                    </span>{" "}
                    o seu saldo do mês que vem.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                    className="mt-8 max-w-2xl text-lg sm:text-xl text-zinc-400"
                >
                    O seu banco mostra onde o seu dinheiro morreu. O Finiza projeta para onde ele vai. Assuma o controle
                    do futuro com a bússola temporal definitiva para as suas finanças.
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                    onClick={() => router.push("/auth")}
                    className="mt-10 group relative inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500/10 px-8 py-4 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all active:scale-95 font-medium"
                >
                    Antecipe seu futuro
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
                    className="mt-20 w-full max-w-md"
                >
                    <GlassCard className="text-left flex flex-col gap-4 shadow-2xl shadow-emerald-900/10">
                        <div className="flex justify-between items-center text-zinc-400 text-sm font-medium">
                            <span>Projeção de Saldo • 30 Dias</span>
                            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full text-xs">
                                <ShieldCheck className="w-3.5 h-3.5" /> Safe
                            </span>
                        </div>
                        <div className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-100">R$ 4.250,00</div>
                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden mt-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "75%" }}
                                transition={{ duration: 1.5, ease: "easeInOut", delay: 1 }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full"
                            />
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </section>
    );
}
