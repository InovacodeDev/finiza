"use client";

import { motion } from "framer-motion";

export function SolutionSection() {
    return (
        <section
            id="manifesto"
            className="relative py-32 px-6 lg:px-24 flex justify-center items-center overflow-hidden"
        >
            <div className="absolute left-0 top-1/2 w-full max-w-2xl h-96 bg-emerald-500/10 rounded-[100%] blur-[120px] pointer-events-none -translate-y-1/2 -translate-x-1/3" />

            <div className="relative z-10 max-w-4xl text-center space-y-8">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-100"
                >
                    Até agora.
                </motion.h2>
                <div className="text-zinc-300 text-lg sm:text-xl leading-relaxed space-y-6 max-w-3xl mx-auto">
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        Abra o Finiza. A luz da tela não agride... A linha do seu saldo não para no dia de hoje. Ela
                        viaja trinta dias para o futuro.
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    >
                        Você simula uma compra. Um deslizar suave de dedo na tela... A ansiedade derrete.
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                        className="text-emerald-400 font-medium"
                    >
                        Você sabe exatamente o impacto daquele gasto antes mesmo de tirar o cartão da carteira.
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
