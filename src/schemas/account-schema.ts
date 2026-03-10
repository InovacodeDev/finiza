import { z } from "zod";

export const accountCategoryEnum = z.enum(['checking', 'savings', 'wallet', 'vault', 'credit']);

export const accountSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50),
  institution: z.string().optional(),
  category: accountCategoryEnum.default('checking'),
  balance: z.number().default(0),
  color_hex: z.string().regex(/^#[a-f0-9]{6}$/, "Cor inválida").optional(),
  icon_slug: z.string().optional(),
});

export type AccountFormValues = z.infer<typeof accountSchema>;

export const accountUpdateSchema = accountSchema.partial();
