import { z } from "zod";

export const updateProfileSchema = z.object({
    full_name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").max(100, "O nome é muito longo"),
    avatar_url: z.string().url("URL de avatar inválida").optional().nullable().or(z.literal("")),
});

export const inviteMemberSchema = z.object({
    email: z.string().email("E-mail inválido"),
    role: z.string().refine((val) => ["member", "admin"].includes(val), {
        message: "Papel inválido",
    }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
