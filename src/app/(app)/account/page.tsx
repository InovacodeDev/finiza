import React from "react";
import { Settings } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

export default function AccountPage() {
    return (
        <div className="relative min-h-[calc(100vh-64px)] w-full p-6 md:p-8 lg:p-12 pb-32 flex flex-col">
            <PageHeader title="Sua Conta" subtitle="Gerencie suas informações, preferências e assinatura" />

            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto text-center mt-12">
                <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/50 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl w-full max-w-2xl mt-12">
                    <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8 border border-indigo-500/20">
                        <Settings className="w-10 h-10 text-indigo-400" />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-50 mb-4">Configurações</h2>

                    <p className="text-zinc-400 text-lg max-w-md mx-auto mb-8">
                        Módulo de gerenciamento e configurações da conta em construção.
                    </p>

                    <div className="inline-flex items-center justify-center rounded-full bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-400 border border-indigo-500/20">
                        <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        Em desenvolvimento
                    </div>
                </div>
            </div>
        </div>
    );
}
