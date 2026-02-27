"use client";

import { Check, ArrowRight } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export function PricingSection() {
    const router = useRouter();
    return (
        <section
            id="precos"
            className="relative py-20 lg:py-32 px-6 lg:px-24 flex flex-col items-center justify-center"
        >
            {/* Background Highlights */}
            <div className="absolute top-1/2 left-1/2 w-full max-w-4xl h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

            <div className="relative z-10 w-full max-w-6xl flex flex-col items-center text-center space-y-10 lg:space-y-16">
                {/* Headers */}
                <div className="space-y-6 max-w-3xl">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-100 leading-snug"
                    >
                        O futuro da sua paz mental custa menos que aquela assinatura esquecida.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-base sm:text-xl text-zinc-400 font-medium"
                    >
                        Comece a limpar o terreno agora. Escale quando estiver pronto para dominar o amanhã.
                    </motion.p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-stretch">
                    {/* Essencial Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    >
                        <GlassCard className="h-full flex flex-col p-8 text-left hover:bg-zinc-800/40 transition-colors border border-zinc-800/80">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-zinc-100">Finiza Essencial</h3>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-zinc-100">R$ 0,00</span>
                                    <span className="text-zinc-500 font-medium tracking-wide text-sm">
                                        / para sempre
                                    </span>
                                </div>
                                <p className="mt-4 font-semibold text-emerald-400">O fim do caos imediato.</p>
                                <p className="mt-2 text-zinc-400 text-sm leading-relaxed">
                                    O básico, feito com uma elegância que os bancos invejam. Ideal para quem precisa
                                    arrumar a casa hoje.
                                </p>
                            </div>

                            <ul className="flex-1 space-y-4 mb-8">
                                {[
                                    "Centralize 2 contas e 1 cartão.",
                                    "Dashboard com clareza visual e zero poluição.",
                                    "Categorização inteligente das despesas do mês.",
                                    "O silêncio absoluto de uma interface sem anúncios.",
                                ].map((feature, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-zinc-300">
                                        <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => router.push("/auth")}
                                className="w-full rounded-xl py-4 px-6 font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors"
                            >
                                Criar conta gratuita
                            </button>
                        </GlassCard>
                    </motion.div>

                    {/* Horizonte Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                        className="relative"
                    >
                        {/* Neon border effect container */}
                        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-emerald-500/50 via-indigo-500/50 to-emerald-500/50 blur-md opacity-40"></div>

                        <GlassCard className="h-full flex flex-col p-8 text-left relative z-10 border border-emerald-500/30 bg-zinc-900/80 backdrop-blur-md">
                            <div className="mb-6">
                                <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-emerald-500/20">
                                    Recomendado
                                </span>
                                <h3 className="text-2xl font-bold text-zinc-100">Finiza Horizonte</h3>
                                <div className="mt-4 flex flex-col">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-500">
                                            R$ 19,90
                                        </span>
                                        <span className="text-zinc-500 font-medium tracking-wide text-sm">/ mês</span>
                                    </div>
                                    <span className="text-zinc-500 text-sm mt-1">ou R$ 199/ano (2 meses grátis)</span>
                                </div>
                                <p className="mt-4 font-semibold text-emerald-400">
                                    O controle absoluto do que está por vir.
                                </p>
                                <p className="mt-2 text-zinc-400 text-sm leading-relaxed">
                                    Desbloqueie a Bússola Temporal. Feito para quem não quer apenas registrar despesas,
                                    mas antecipar o fluxo da vida.
                                </p>
                            </div>

                            <ul className="flex-1 space-y-4 mb-8">
                                {[
                                    "Tudo do plano Essencial, sem limites.",
                                    "A Bússola Temporal: Veja o gráfico do seu saldo viajar 30 dias para o futuro.",
                                    "Simulador de Impacto: Digite uma compra e sinta o peso dela no seu gráfico de amanhã.",
                                    "Sincronia Doméstica: Compartilhe o horizonte financeiro. Logins individuais, visão unificada.",
                                ].map((feature, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-zinc-300">
                                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        </div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => router.push("/auth")}
                                className="w-full relative group overflow-hidden rounded-xl py-4 px-6 font-semibold bg-zinc-100 hover:bg-white text-zinc-950 transition-colors flex justify-center items-center gap-2"
                            >
                                Desbloquear meu futuro agora
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </GlassCard>
                    </motion.div>
                </div>

                {/* Guarantee */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                    className="max-w-2xl px-6 py-4 rounded-xl bg-zinc-800/30 border border-zinc-500/10 text-zinc-400 text-sm leading-relaxed"
                >
                    <span className="font-semibold text-zinc-300">A Regra é Simples:</span> Se o Finiza Horizonte não
                    salvar, logo no primeiro mês, pelo menos o dobro do que ele custa (identificando furos invisíveis ou
                    evitando juros de atraso), devolvemos cada centavo da sua assinatura. Sem formulários longos. Apenas
                    um clique.
                </motion.div>
            </div>
        </section>
    );
}
