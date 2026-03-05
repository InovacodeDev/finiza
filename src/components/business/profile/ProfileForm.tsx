"use client";

import { useActionState, useState } from "react";
import { updateProfile, sendTenantInvite } from "@/app/actions/profileActions";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2, User, UserPlus, Save, Mail } from "lucide-react";

interface ProfileFormProps {
    initialData: {
        full_name: string | null;
        avatar_url: string | null;
    };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
    const [profileError, setProfileError] = useState<string | null>(null);
    const [profileSuccess, setProfileSuccess] = useState(false);

    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteMessage, setInviteMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const [updateState, updateAction, isUpdatePending] = useActionState(
        async (_prevState: any, formData: FormData) => {
            const data = {
                full_name: formData.get("full_name") as string,
                avatar_url: formData.get("avatar_url") as string,
            };
            const result = await updateProfile(data);
            if (result.success) {
                setProfileSuccess(true);
                setTimeout(() => setProfileSuccess(false), 3000);
            } else {
                setProfileError(result.error || "Erro ao atualizar");
            }
            return result;
        },
        null
    );

    const handleSendInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setInviteLoading(true);
        setInviteMessage(null);

        try {
            const result = await sendTenantInvite({ email: inviteEmail, role: "member" });
            if (result.success) {
                setInviteMessage({ type: "success", text: "Convite enviado com sucesso!" });
                setInviteEmail("");
            } else {
                setInviteMessage({ type: "error", text: result.error || "Erro ao enviar convite." });
            }
        } catch (err) {
            setInviteMessage({ type: "error", text: "Erro inesperado." });
        } finally {
            setInviteLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl flex flex-col gap-8">
            <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Configurações de Perfil</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Seção de Perfil */}
                <GlassCard className="p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <User className="w-5 h-5 text-emerald-500" />
                        <h2 className="text-xl font-semibold text-zinc-100">Dados Pessoais</h2>
                    </div>

                    <form action={updateAction} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-zinc-400">Nome Completo</label>
                            <input
                                name="full_name"
                                defaultValue={initialData.full_name || ""}
                                required
                                className="bg-zinc-900/50 border border-white/10 rounded-xl py-2 px-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-zinc-400">URL do Avatar</label>
                            <input
                                name="avatar_url"
                                defaultValue={initialData.avatar_url || ""}
                                placeholder="https://..."
                                className="bg-zinc-900/50 border border-white/10 rounded-xl py-2 px-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                            />
                        </div>

                        {profileError && <p className="text-sm text-red-400">{profileError}</p>}
                        {profileSuccess && <p className="text-sm text-emerald-400">Perfil atualizado!</p>}

                        <button
                            type="submit"
                            disabled={isUpdatePending}
                            className="mt-2 w-full py-3 bg-zinc-100 text-zinc-950 rounded-xl font-medium hover:bg-white transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {isUpdatePending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Salvar Alterações
                        </button>
                    </form>
                </GlassCard>

                {/* Seção de Tenant / Família */}
                <GlassCard className="p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <UserPlus className="w-5 h-5 text-emerald-500" />
                        <h2 className="text-xl font-semibold text-zinc-100">Família & Compartilhamento</h2>
                    </div>

                    <p className="text-sm text-zinc-400 leading-relaxed">
                        Convide membros para visualizar e gerenciar as finanças em conjunto. Eles terão acesso ao mesmo contexto financeiro.
                    </p>

                    <form onSubmit={handleSendInvite} className="flex flex-col gap-4 mt-auto">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-zinc-400">E-mail do novo membro</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="exemplo@email.com"
                                    required
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {inviteMessage && (
                            <p className={`text-sm ${inviteMessage.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
                                {inviteMessage.text}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={inviteLoading || !inviteEmail}
                            className="w-full py-3 bg-emerald-500 text-zinc-950 rounded-xl font-medium hover:bg-emerald-400 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {inviteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                            Enviar Convite
                        </button>
                    </form>
                </GlassCard>
            </div>
        </div>
    );
}
