"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2, UserPlus, CheckCircle2, ArrowRight } from "lucide-react";

export function InviteView() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const supabase = createClient();

    const email = searchParams?.get("email") || "";
    const role = searchParams?.get("role") || "Leitor";
    const account = searchParams?.get("account") || "Indefinida";

    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!isMounted) return;

            if (!session) {
                // Usuário não autenticado: enviamos para /auth com a query redirect_to apontando de volta pra cá
                const currentFullParams = searchParams ? searchParams.toString() : "";
                const inviteUrl = `/invite?${currentFullParams}`;
                router.push(`/auth?redirect_to=${encodeURIComponent(inviteUrl)}`);
                return;
            }

            // Autenticado: continua a renderizar o convite
            setUserEmail(session.user.email ?? null);
            setLoading(false);
        };

        checkAuth();

        return () => {
            isMounted = false;
        };
    }, [router, supabase, searchParams]);

    const handleAcceptInvite = async () => {
        setLoading(true);
        // FIXME: Aqui entraria a chamada de API real do Supabase
        // para inserir o registro na tabela de relacionamentos (account_users)
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setAccepted(true);
        setLoading(false);
    };

    if (loading) {
        return (
            <GlassCard className="w-full max-w-md p-8 flex flex-col items-center justify-center gap-4 min-h-[300px]">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                <p className="text-zinc-400 animate-pulse">Verificando informações...</p>
            </GlassCard>
        );
    }

    if (accepted) {
        return (
            <GlassCard className="w-full max-w-md p-8 flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-100 mb-2">Convite Aceito!</h2>
                    <p className="text-zinc-400">
                        Agora você tem acesso à conta <strong className="text-zinc-100">{account}</strong> com permissão
                        de <strong className="text-zinc-100">{role}</strong>.
                    </p>
                </div>
                <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full py-3 bg-emerald-500 text-zinc-950 rounded-xl font-medium hover:bg-emerald-400 transition-all flex justify-center items-center gap-2 mt-4"
                >
                    Ir para o Dashboard <ArrowRight className="w-4 h-4" />
                </button>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="w-full max-w-md p-8 flex flex-col items-center text-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <UserPlus className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold text-zinc-100">Convite para Conta</h2>
                <p className="text-zinc-400 text-sm">
                    Você foi convidado(a) para acessar a Sincronia Doméstica desta conta no Finiza.
                </p>
            </div>

            <div className="w-full p-4 bg-zinc-900/50 rounded-xl border border-white/5 flex flex-col gap-2 text-left">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Conta Base</span>
                    <span
                        className="text-sm font-medium text-zinc-100 truncate max-w-[150px] text-right"
                        title={account}
                    >
                        {account}
                    </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Sua Permissão</span>
                    <span className="text-sm font-medium text-emerald-400">{role}</span>
                </div>
            </div>

            {email && email !== userEmail && (
                <div className="p-3 w-full rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs text-center leading-relaxed">
                    Aviso: O convite visava <b>{email}</b>, mas você está conectando como <b>{userEmail}</b>. Ao
                    prosseguir, o vínculo será feito ao perfil atual.
                </div>
            )}

            <div className="flex flex-col w-full gap-3 mt-2">
                <button
                    onClick={handleAcceptInvite}
                    disabled={loading}
                    className="w-full py-3 bg-emerald-500 text-zinc-950 rounded-xl font-medium hover:bg-emerald-400 transition-all flex justify-center items-center gap-2"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Aceitar e Acessar Conta
                </button>
                <button
                    onClick={() => router.push("/dashboard")}
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors py-2"
                >
                    Ignorar e ir para o Dashboard
                </button>
            </div>
        </GlassCard>
    );
}
