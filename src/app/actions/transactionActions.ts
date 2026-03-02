"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/supabase";
import { randomUUID } from "crypto";

export type TransactionInsert = Database["public"]["Tables"]["transactions"]["Insert"];
export type TransactionUpdate = Database["public"]["Tables"]["transactions"]["Update"];

export async function fetchTransactions(searchQuery?: string) {
    const supabase = await createClient();
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

    return data;
}

import { addMonths, format } from "date-fns";

export async function createTransactionAction(
    transaction: Omit<TransactionInsert, "user_id">,
    installments: number = 1,
) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Usuário não autenticado." };
    }

    if (installments > 1 && transaction.credit_card_id) {
        // Handle installments by dividing the total amount correctly
        const baseAmount = transaction.amount;
        const installmentAmount = Math.floor((baseAmount / installments) * 100) / 100;
        const remainder = Math.round((baseAmount - installmentAmount * installments) * 100) / 100;

        const transactionsToInsert: TransactionInsert[] = [];
        const baseDate = new Date(transaction.transaction_date + "T12:00:00Z"); // Midday to avoid timezone offset issues

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
            });
        }

        const { error } = await supabase.from("transactions").insert(transactionsToInsert);

        if (error) {
            console.error("Error creating installment transactions:", error);
            return { success: false, error: error.message };
        }
    } else {
        const id = transaction.id || randomUUID();
        const { error } = await supabase.from("transactions").insert({ ...transaction, id, user_id: user.id });

        if (error) {
            console.error("Error creating transaction:", error);
            return { success: false, error: error.message };
        }
    }

    revalidatePath("/transactions");
    revalidatePath("/credit-cards");
    revalidatePath("/accounts");
    return { success: true };
}

export async function updateTransactionAction(id: string, updates: TransactionUpdate) {
    const supabase = await createClient();
    const { error } = await supabase.from("transactions").update(updates).eq("id", id);

    if (error) {
        console.error("Error updating transaction:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/transactions");
    return { success: true };
}

export async function deleteTransactionAction(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) {
        console.error("Error deleting transaction:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/transactions");
    return { success: true };
}

export async function fetchCategories() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true });

    if (error) {
        console.error("Error fetching categories:", error);
        return [];
    }

    return data;
}
