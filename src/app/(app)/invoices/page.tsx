import React from "react";
import { Receipt } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

export default function InvoicesPage() {
    return (
        <div className="relative min-h-[calc(100vh-64px)] w-full pb-32 flex flex-col">
            <PageHeader title="Faturas" subtitle="Controle de Cartões" />

            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto text-center mt-12">
                <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/50 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl w-full max-w-2xl mt-12">
                    <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 border border-emerald-500/20">
                        <Receipt className="w-10 h-10 text-emerald-400" />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-50 mb-4">Faturas</h2>

                    <p className="text-zinc-400 text-lg max-w-md mx-auto mb-8">
                        Esta área está atualmente em construção. Em breve você terá acesso a todas as suas faturas de
                        cartões aqui.
                    </p>

                    <div className="inline-flex items-center justify-center rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400 border border-emerald-500/20">
                        <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Em desenvolvimento
                    </div>
                </div>
            </div>
        </div>
    );
}
