import React, { Suspense } from "react";
import { InviteView } from "@/components/invite/InviteView";

export const metadata = {
    title: "Convite Pendente | Finiza",
    description: "Aceite seu convite para participar de uma conta no Finiza.",
};

export default function InvitePage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 p-4 relative overflow-hidden">
            {/* Background igual ao da tela de Auth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(16,185,129,0.12),transparent)] pointer-events-none" />

            <div className="relative z-10 w-full flex justify-center">
                <Suspense fallback={<div className="text-zinc-400">Carregando informações do convite...</div>}>
                    <InviteView />
                </Suspense>
            </div>
        </div>
    );
}
