"use client";

import { Compass, EyeOff, Users } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { motion } from "framer-motion";

export function FeatureSection() {
    return (
        <section id="produto" className="relative py-24 px-6 lg:px-24 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full"
                >
                    <GlassCard className="flex flex-col gap-4 items-start group hover:bg-zinc-800/40 transition-colors h-full">
                        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                            <Compass className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-100 mt-2">A Bússola Temporal</h3>
                        <p className="text-zinc-400 leading-relaxed text-sm sm:text-base">
                            Uma linha do tempo interativa que funde suas despesas fixas e faturas abertas para revelar o
                            seu saldo real no próximo dia 30.
                        </p>
                    </GlassCard>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="h-full"
                >
                    <GlassCard className="flex flex-col gap-4 items-start group hover:bg-zinc-800/40 transition-colors h-full">
                        <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                            <EyeOff className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-100 mt-2">Silêncio Visual</h3>
                        <p className="text-zinc-400 leading-relaxed text-sm sm:text-base">
                            Sem pop-ups, sem ofertas de empréstimo. Um dashboard desenhado para acalmar a mente,
                            mostrando apenas os KPIs que movem o ponteiro da sua vida.
                        </p>
                    </GlassCard>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="h-full"
                >
                    <GlassCard className="flex flex-col gap-4 items-start group hover:bg-zinc-800/40 transition-colors h-full">
                        <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-100 mt-2">Sincronia Doméstica</h3>
                        <p className="text-zinc-400 leading-relaxed text-sm sm:text-base">
                            A clareza de ter todas as contas, cartões e categorias centralizadas. O fim do &apos;de quem
                            é essa compra?&apos; e o início do controle absoluto.
                        </p>
                    </GlassCard>
                </motion.div>
            </div>
        </section>
    );
}
