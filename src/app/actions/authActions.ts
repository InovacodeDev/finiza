"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

interface ActionResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

const signInSchema = z.object({
    email: z.string().email("E-mail inválido"),
});

const verifyOtpSchema = z.object({
    email: z.string().email("E-mail inválido"),
    token: z.string().length(6, "O código deve ter 6 dígitos"),
});

export async function signInWithOtp(formData: { email: string }): Promise<ActionResponse> {
    const validatedFields = signInSchema.safeParse(formData);

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.issues[0].message,
        };
    }

    const { email } = validatedFields.data;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: true,
        },
    });

    if (error) {
        console.error("signInWithOtp error:", error.message);
        return {
            success: false,
            error: "Erro ao enviar o código. Tente novamente.",
        };
    }

    return { success: true };
}

export async function verifyOtp(formData: { email: string; token: string }): Promise<ActionResponse> {
    const validatedFields = verifyOtpSchema.safeParse(formData);

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.issues[0].message,
        };
    }

    const { email, token } = validatedFields.data;
    const supabase = await createClient();

    const { data: authData, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
    });

    if (error) {
        console.error("verifyOtp error:", error.message);
        return {
            success: false,
            error: "Código inválido ou expirado.",
        };
    }

    // Auto-create user_profile with defaults if it doesn't exist
    if (authData.user) {
        const { data: existingProfile } = await supabase
            .from("user_profiles")
            .select("id")
            .eq("id", authData.user.id)
            .maybeSingle();

        if (!existingProfile) {
            const { error: profileError } = await supabase
                .from("user_profiles")
                .insert({
                    id: authData.user.id,
                    full_name: null,
                    avatar_url: null,
                    tenant_id: null,
                    currency: "BRL",
                    language: "pt-BR",
                    reserva_meses: 6,
                    notifications_enabled: true,
                });

            if (profileError) {
                console.error("Auto-create profile error:", profileError.message);
                // Don't block login — profile can be created later
            }
        }
    }

    return { success: true };
}
