import { z } from "zod";

export const transactionTypeSchema = z.enum(["income", "expense", "transfer", "adjustment"]);
export const transactionStatusSchema = z.enum(["pending", "paid"]);

export const transactionBaseSchema = z.object({
  type: transactionTypeSchema,
  status: transactionStatusSchema,
  amount: z.number().min(0, "O valor deve ser maior ou igual a zero"),
  description: z.string().min(1, "A descrição é obrigatória"),
  transaction_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (formato YYYY-MM-DD)"),
  account_id: z.string().uuid("Conta de origem inválida"),
  category_id: z.string().uuid("Categoria inválida").nullable().optional(),
  destination_account_id: z.string().uuid("Conta de destino inválida").nullable().optional(),
  credit_card_id: z.string().uuid("Cartão de crédito inválido").nullable().optional(),
  is_recurring: z.boolean(),
  group_id: z.string().uuid().nullable().optional(),
  installment_current: z.number().int().min(1).nullable().optional(),
  installment_total: z.number().int().min(1).nullable().optional(),
  installments: z.number().int().min(1).optional(),
});

export const transactionSchema = transactionBaseSchema.refine((data) => {
  if (data.type === "transfer" && !data.destination_account_id) {
    return false;
  }
  return true;
}, {
  message: "Conta de destino é obrigatória para transferências",
  path: ["destination_account_id"],
}).refine((data) => {
  if (data.type === "transfer" && data.account_id === data.destination_account_id) {
    return false;
  }
  return true;
}, {
  message: "Conta de destino deve ser diferente da conta de origem",
  path: ["destination_account_id"],
});

export const transactionUpdateSchema = transactionBaseSchema.partial();

export type TransactionFormValues = z.infer<typeof transactionSchema>;
