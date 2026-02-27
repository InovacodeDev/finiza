import React from "react";
import { User, Settings } from "lucide-react";

export default function AccountPage() {
    return (
        <div className="flex flex-col justify-start w-full max-w-5xl mx-auto p-6 md:p-12">
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-50 mb-2">Sua Conta</h1>
                <p className="text-zinc-400 text-lg">Gerencie suas informações, preferências e assinatura.</p>
            </div>

            <div className="p-12 bg-zinc-900/50 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl w-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20">
                    <Settings className="w-8 h-8 text-indigo-400" />
                </div>

                <h2 className="text-2xl font-semibold text-zinc-50 mb-3">Configurações</h2>

                <p className="text-zinc-400 max-w-md mx-auto mb-6">
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
    );
}
