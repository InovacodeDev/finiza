"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

interface ActionResponse<T = any> {
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
            error: validatedFields.error.errors[0].message,
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
            error: validatedFields.error.errors[0].message,
        };
    }

    const { email, token } = validatedFields.data;
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
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

    return { success: true };
}
