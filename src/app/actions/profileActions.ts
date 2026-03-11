"use server";

import { createClient } from "@/lib/supabase/server";
import { updateProfileSchema, inviteMemberSchema, type UpdateProfileInput, type InviteMemberInput } from "@/schemas/profile-schema";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { AccountInviteEmail } from "@/components/emails/AccountInviteEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ActionResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

export async function updateProfile(data: UpdateProfileInput): Promise<ActionResponse> {
    const validatedFields = updateProfileSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.issues[0].message,
        };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Não autenticado" };

    const { error } = await supabase
        .from("user_profiles")
        .update(validatedFields.data)
        .eq("id", user.id);

    if (error) {
        console.error("updateProfile error:", error.message);
        return { success: false, error: "Erro ao atualizar perfil" };
    }

    revalidatePath("/profile");
    return { success: true };
}

export interface UserProfile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    tenant_id: string | null;
}

export async function getUserProfile(): Promise<ActionResponse<UserProfile>> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Não autenticado" };

    const { data, error } = await supabase
        .from("user_profiles")
        .select("id, full_name, avatar_url, tenant_id")
        .eq("id", user.id)
        .single();

    if (error) {
        console.error("getUserProfile error:", error.message);
        return { success: false, error: "Erro ao carregar perfil" };
    }

    return { success: true, data: data as UserProfile };
}

export async function sendTenantInvite(data: InviteMemberInput): Promise<ActionResponse> {
    const validatedFields = inviteMemberSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.issues[0].message,
        };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Não autenticado" };

    // Pegar dados do perfil do remetente e o tenant_id
    const { data: profile } = await supabase
        .from("user_profiles")
        .select("full_name, tenant_id")
        .eq("id", user.id)
        .single();

    if (!profile || !profile.tenant_id) {
        return { success: false, error: "Tenant não encontrado para este usuário" };
    }

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === "development" 
            ? "http://localhost:9991" 
            : "https://finiza.inovacode.dev");
            
        const inviteLink = `${baseUrl}/invite?email=${encodeURIComponent(data.email)}&tenant=${profile.tenant_id}`;

        // Persistir o convite no banco
        const { error: dbError } = await supabase
            .from("invites")
            .insert({
                email: data.email,
                tenant_id: profile.tenant_id,
                role: data.role,
                invited_by: user.id,
                status: "pending"
            });

        if (dbError) {
            console.error("Database invite error:", dbError.message);
            return { success: false, error: "Erro ao registrar convite no sistema" };
        }

        const { error: resendError } = await resend.emails.send({
            from: "Finiza <finiza@inovacode.dev>",
            to: [data.email],
            subject: `Convite para participar do Finiza`,
            react: AccountInviteEmail({
                inviterName: profile.full_name || "Alguém",
                accountName: "Finiza",
                inviteLink,
            }) as React.ReactElement,
        });

        if (resendError) {
            console.error("Resend error:", resendError);
            // Mesmo com erro no email, o convite foi registrado. 
            // O usuário pode tentar reenviar depois.
            return { success: true, data: "Convite registrado, mas houve erro no envio do e-mail." };
        }
        
        return { success: true };
}
