"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/supabase";

export type CreditCardRow = Database["public"]["Tables"]["credit_cards"]["Row"];
export type CreditCardInsert = Database["public"]["Tables"]["credit_cards"]["Insert"];
export type CreditCardUpdate = Database["public"]["Tables"]["credit_cards"]["Update"];

export async function fetchCreditCards() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("credit_cards")
        .select(
            `
            *,
            account:accounts(*)
        `,
        )
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching credit cards:", error);
        return [];
    }

    return data;
}

export async function createCreditCard(creditCard: CreditCardInsert) {
    const supabase = await createClient();
    const { error } = await supabase.from("credit_cards").insert(creditCard);

    if (error) {
        console.error("Error creating credit card:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/credit-cards");
    revalidatePath("/accounts"); // In case it affects global balance/accounts flow
    return { success: true };
}

export async function updateCreditCard(id: string, updates: CreditCardUpdate) {
    const supabase = await createClient();
    const { error } = await supabase.from("credit_cards").update(updates).eq("id", id);

    if (error) {
        console.error("Error updating credit card:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/credit-cards");
    revalidatePath("/accounts");
    return { success: true };
}

export async function deleteCreditCard(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("credit_cards").delete().eq("id", id);

    if (error) {
        console.error("Error deleting credit card:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/credit-cards");
    revalidatePath("/accounts");
    return { success: true };
}
