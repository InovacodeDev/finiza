"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2, Mail, KeyRound } from "lucide-react";

export function OtpForm() {
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [step, setStep] = useState<"email" | "otp">("email");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();
    const router = useRouter();
    // Obtém parâmetros de busca da URL para manter o redirect
    const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const redirectTo = searchParams?.get("redirect_to") || "/dashboard";

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: true, // Permite Sign Up e Log In no mesmo fluxo
                },
            });

            if (authError) throw authError;
            setStep("otp");
        } catch (err) {
            setError((err as Error).message || "Erro ao enviar o código. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: verifyError } = await supabase.auth.verifyOtp({
                email,
                token,
                type: "email",
            });

            if (verifyError) throw verifyError;

            router.push(redirectTo);
            router.refresh();
        } catch (err) {
            setError((err as Error).message || "Código inválido ou expirado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassCard className="w-full max-w-md p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2 text-center">
                <h2 className="text-2xl font-semibold text-zinc-100">
                    {step === "email" ? "Acesse o seu futuro" : "Verifique seu e-mail"}
                </h2>
                <p className="text-sm text-zinc-400 mb-4">
                    {step === "email"
                        ? "Enviaremos um código seguro. Sem senhas para esquecer."
                        : `Enviamos um código de 6 dígitos para ${email}`}
                </p>
            </div>

            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    {error}
                </div>
            )}

            {step === "email" ? (
                <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            required
                            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full py-3 bg-zinc-100 text-zinc-950 rounded-xl font-medium hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Receber código
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                    <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            placeholder="000000"
                            required
                            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-center tracking-[0.5em] text-xl font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || token.length < 6}
                        className="w-full py-3 bg-emerald-500 text-zinc-950 rounded-xl font-medium hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Confirmar acesso
                    </button>
                    <button
                        type="button"
                        onClick={() => setStep("email")}
                        className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                        Usar outro e-mail
                    </button>
                </form>
            )}
        </GlassCard>
    );
}
