"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/supabase";
import { randomUUID } from "crypto";
import { addMonths, format } from "date-fns";
import { ActionResponse } from "@/types/actions";
import { transactionSchema, transactionUpdateSchema } from "@/schemas/transaction-schema";

export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type TransactionInsert = Database["public"]["Tables"]["transactions"]["Insert"];
export type TransactionUpdate = Database["public"]["Tables"]["transactions"]["Update"];

export type TransactionWithRelations = Transaction & {
    category?: Database["public"]["Tables"]["categories"]["Row"] | null;
    account?: Database["public"]["Tables"]["accounts"]["Row"] | null;
    destination_account?: Database["public"]["Tables"]["accounts"]["Row"] | null;
    credit_card?: Database["public"]["Tables"]["credit_cards"]["Row"] | null;
};

/**
 * Fetches all transactions for the current user.
 */
export async function fetchTransactions(searchQuery?: string): Promise<TransactionWithRelations[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    let query = supabase
        .from("transactions")
        .select(
            `
            *,
            category:categories(*),
            account:accounts!transactions_account_id_fkey(*),
            destination_account:accounts!transactions_destination_account_id_fkey(*),
            credit_card:credit_cards(*)
        `,
        )
        .eq("user_id", user.id)
        .order("transaction_date", { ascending: false })
        .order("created_at", { ascending: false });

    if (searchQuery) {
        query = query.ilike("description", `%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }

    return data as TransactionWithRelations[];
}

/**
 * Creates a new transaction or a series of installments.
 */
export async function createTransactionAction(
    payload: unknown,
    installments: number = 1,
): Promise<ActionResponse<TransactionWithRelations | TransactionWithRelations[]>> {
    const validatedFields = transactionSchema.safeParse(payload);

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.flatten().fieldErrors.description?.[0] || "Dados inválidos.",
        };
    }

    const transaction = validatedFields.data;
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Usuário não autenticado." };
    }

    if (installments > 1 && transaction.credit_card_id) {
        const baseAmount = transaction.amount;
        const installmentAmount = Math.floor((baseAmount / installments) * 100) / 100;
        const remainder = Math.round((baseAmount - installmentAmount * installments) * 100) / 100;

        const transactionsToInsert: TransactionInsert[] = [];
        const baseDate = new Date(transaction.transaction_date + "T12:00:00Z");
        const groupId = randomUUID();

        for (let i = 0; i < installments; i++) {
            const currentInstallmentAmount = i === 0 ? installmentAmount + remainder : installmentAmount;
            const nextDate = addMonths(baseDate, i);
            const formattedDate = format(nextDate, "yyyy-MM-dd");

            transactionsToInsert.push({
                ...transaction,
                id: randomUUID(),
                user_id: user.id,
                amount: currentInstallmentAmount,
                transaction_date: formattedDate,
                description: `${transaction.description} (${i + 1}/${installments})`,
                group_id: groupId,
                installment_current: i + 1,
                installment_total: installments,
            });
        }

        const { data, error } = await supabase.from("transactions").insert(transactionsToInsert).select(`
            *,
            category:categories(*),
            account:accounts!transactions_account_id_fkey(*),
            destination_account:accounts!transactions_destination_account_id_fkey(*),
            credit_card:credit_cards(*)
        `);

        if (error) {
            console.error("Error creating installment transactions:", error);
            return { success: false, error: error.message };
        }
        
        revalidatePath("/transactions");
        revalidatePath("/dashboard");
        revalidatePath("/accounts");
        return { success: true, data: data as TransactionWithRelations[] };
    } else {
        const id = randomUUID();
        const { data, error } = await supabase
            .from("transactions")
            .insert({ ...transaction, id, user_id: user.id })
            .select(`
                *,
                category:categories(*),
                account:accounts!transactions_account_id_fkey(*),
                destination_account:accounts!transactions_destination_account_id_fkey(*),
                credit_card:credit_cards(*)
            `)
            .single();

        if (error) {
            console.error("Error creating transaction:", error);
            return { success: false, error: error.message };
        }

        revalidatePath("/transactions");
        revalidatePath("/dashboard");
        revalidatePath("/accounts");
        return { success: true, data: data as TransactionWithRelations };
    }
}

/**
 * Updates an existing transaction.
 */
export async function updateTransactionAction(
    id: string,
    payload: unknown,
): Promise<ActionResponse<TransactionWithRelations>> {
    const validatedFields = transactionUpdateSchema.safeParse(payload);

    if (!validatedFields.success) {
        return {
            success: false,
            error: "Dados inválidos para atualização.",
        };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Usuário não autenticado." };

    const { data, error } = await supabase
        .from("transactions")
        .update(validatedFields.data)
        .eq("id", id)
        .eq("user_id", user.id)
        .select(`
            *,
            category:categories(*),
            account:accounts!transactions_account_id_fkey(*),
            destination_account:accounts!transactions_destination_account_id_fkey(*),
            credit_card:credit_cards(*)
        `)
        .single();

    if (error) {
        console.error("Error updating transaction:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    revalidatePath("/accounts");
    return { success: true, data: data as TransactionWithRelations };
}

/**
 * Deletes a transaction or its future installments.
 */
export async function deleteTransactionAction(id: string): Promise<ActionResponse> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Usuário não autenticado." };

    const { data: tx, error: fetchError } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (fetchError || !tx) {
        return { success: false, error: "Transação não encontrada." };
    }

    let deleteError;

    if (tx.group_id) {
        const { error } = await supabase
            .from("transactions")
            .delete()
            .eq("group_id", tx.group_id)
            .eq("user_id", user.id)
            .gte("transaction_date", tx.transaction_date);
        deleteError = error;
    } else {
        const { error } = await supabase
            .from("transactions")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);
        deleteError = error;
    }

    if (deleteError) {
        console.error("Error deleting transaction:", deleteError);
        return { success: false, error: deleteError.message };
    }

    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    revalidatePath("/accounts");
    return { success: true };
}

/**
 * Fetches all transaction categories.
 */
export async function fetchCategories() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true });

    if (error) {
        console.error("Error fetching categories:", error);
        return [];
    }

    return data;
}
