"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export function CtaFinalSection() {
    const router = useRouter();
    return (
        <section className="relative py-24 lg:py-32 px-6 lg:px-24 flex flex-col items-center justify-center text-center">
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-3xl flex flex-col items-center gap-10">
                <motion.h2
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-100 leading-snug"
                >
                    O caos financeiro não se resolve com mais planilhas. Ele se dissolve com clareza.
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-xl text-zinc-400 font-medium"
                >
                    Não gerencie a bagunça. <span className="text-zinc-100">Finize.</span>
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    onClick={() => router.push("/auth")}
                    className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 sm:px-8 py-3 sm:py-4 text-zinc-950 hover:bg-emerald-400 transition-all active:scale-95 font-semibold text-base sm:text-lg drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                    Quero ver meu próximo mês agora
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </div>
        </section>
    );
}
