"use client";

import { motion } from "framer-motion";

export function ProblemSection() {
    return (
        <section className="relative py-32 px-6 lg:px-24 flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-1/2 w-full max-w-2xl h-96 bg-red-900/10 rounded-[100%] blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

            <div className="relative z-10 max-w-3xl text-zinc-300 text-lg sm:text-xl leading-relaxed space-y-8 font-medium">
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    Um fim de tarde qualquer. O cheiro sutil de maresia entra pela janela entreaberta, mas sua atenção
                    está travada no vidro frio do celular.
                </motion.p>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    Seu polegar hesita um segundo inteiro antes de tocar no ícone do aplicativo do banco. A tela brilha.
                    Números em vermelho e preto se misturam...
                </motion.p>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                    O mês vai virar. E, mais uma vez, você não tem certeza se o dinheiro vai esticar até o dia cinco.
                </motion.p>
            </div>
        </section>
    );
}
