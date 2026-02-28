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
            destination_account:accounts!transactions_destination_account_id_fkey(*)
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

export async function createTransactionAction(transaction: Omit<TransactionInsert, "user_id">) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Usuário não autenticado." };
    }

    const id = transaction.id || randomUUID();
    const { error } = await supabase.from("transactions").insert({ ...transaction, id, user_id: user.id });

    if (error) {
        console.error("Error creating transaction:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/transactions");
    return { success: true, data: { ...transaction, id, user_id: user.id } };
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
