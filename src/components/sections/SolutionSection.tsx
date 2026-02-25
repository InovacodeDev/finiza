"use client";

import { motion } from "framer-motion";

export function SolutionSection() {
    return (
        <section
            id="solucao"
            className="relative py-20 lg:py-32 px-6 lg:px-24 flex justify-center items-center overflow-hidden"
        >
            <div className="absolute left-0 top-1/2 w-full max-w-2xl h-96 bg-emerald-500/10 rounded-[100%] blur-[120px] pointer-events-none -translate-y-1/2 -translate-x-1/3" />

            <div className="relative z-10 w-full max-w-5xl text-center space-y-8 lg:space-y-12">
                <div className="space-y-8 max-w-4xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-100"
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
                            Abra o Finiza. A luz da tela não agride; ela acolhe com um design limpo, focado em espaços
                            em branco e na ausência absoluta de ruído.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        >
                            Em vez de listas intermináveis, um gráfico suave se estende pela tela. A linha do seu saldo
                            não para no dia de hoje. Ela viaja trinta dias para o futuro.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                            className="text-emerald-400 font-medium"
                        >
                            Você simula uma compra. Um deslizar suave de dedo na tela, um leve feedback háptico vibrando
                            na palma da sua mão. Instantaneamente, a curva de projeção do mês seguinte se ajusta,
                            pintando um cenário claro em verde menta. A ansiedade derrete. Você sabe exatamente o
                            impacto daquele gasto antes mesmo de tirar o cartão da carteira.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                        >
                            A conversa na mesa do café da manhã muda. Não há mais sobressaltos, não há faturas surpresa.
                            Apenas a geometria limpa de um plano bem executado a dois.
                        </motion.p>
                    </div>
                </div>

                {/* Dashboard Mockup - full width */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                    className="w-full relative rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm overflow-hidden shadow-2xl shadow-emerald-900/10 p-3 sm:p-8 mt-8 lg:mt-12"
                >
                    <div className="w-full aspect-[4/3] sm:aspect-[16/9] bg-zinc-950 rounded-xl border border-zinc-800/80 relative overflow-hidden flex flex-col">
                        {/* Mockup Header */}
                        <div className="h-12 border-b border-zinc-800/80 flex items-center px-4 gap-4">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                            </div>
                        </div>
                        {/* Mockup Body placeholder for graph simulator */}
                        <div className="flex-1 p-4 sm:p-6 flex flex-col relative w-full h-full">
                            <div className="absolute inset-0 flex justify-center items-center">
                                <span className="text-zinc-600 font-medium text-xs sm:text-lg uppercase tracking-widest text-center px-4">
                                    A linha viaja 30 dias para o futuro
                                </span>
                            </div>
                            <div className="mt-auto h-32 w-full border-b border-l border-zinc-800/50 flex items-end">
                                {/* Simple line graph mock */}
                                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path
                                        d="M0,80 Q25,70 50,50 T100,20"
                                        fill="none"
                                        stroke="currentColor"
                                        className="text-emerald-500"
                                        strokeWidth="2"
                                    />
                                    <path
                                        d="M0,80 Q25,70 50,50 T100,20 L100,100 L0,100 Z"
                                        fill="currentColor"
                                        className="text-emerald-500/10"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
