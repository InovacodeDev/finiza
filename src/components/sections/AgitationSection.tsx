"use client";

import { motion } from "framer-motion";

export function AgitationSection() {
    return (
        <section className="relative py-24 px-6 lg:px-24 flex justify-center items-center">
            <div className="relative z-10 max-w-3xl text-zinc-400 text-lg sm:text-xl leading-relaxed border-l-2 border-zinc-800 pl-6 sm:pl-10 space-y-6">
                <motion.p
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    Planilhas exigem manutenção. Aplicativos tradicionais exigem que você categorize o passado como um
                    arquivista cansado.
                </motion.p>
                <motion.p
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    Eles te dão um mapa de onde você tropeçou, mas te deixam completamente cego para o buraco que está a
                    dois metros de distância.
                </motion.p>
                <motion.p
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="text-zinc-300 font-medium"
                >
                    A fricção consome a disciplina. E a incerteza devora a sua paz de espírito.
                </motion.p>
            </div>
        </section>
    );
}
