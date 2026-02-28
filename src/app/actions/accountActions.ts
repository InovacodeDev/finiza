"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/supabase";
import { randomUUID } from "crypto";

type AccountInsert = Database["public"]["Tables"]["accounts"]["Insert"];
type AccountUpdate = Database["public"]["Tables"]["accounts"]["Update"];

export async function fetchAccounts() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("accounts").select("*").order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching accounts:", error);
        return [];
    }

    return data;
}

export async function createAccountAction(account: AccountInsert) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Usuário não autenticado." };
    }

    const id = account.id || randomUUID();
    const { error } = await supabase.from("accounts").insert({ ...account, id });

    if (error) {
        console.error("Error creating account:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/accounts");
    return { success: true, data: { ...account, id } };
}

export async function updateAccountAction(id: string, updates: AccountUpdate) {
    const supabase = await createClient();
    const { error } = await supabase.from("accounts").update(updates).eq("id", id);

    if (error) {
        console.error("Error updating account:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/accounts");
    return { success: true };
}

export async function deleteAccountAction(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("accounts").delete().eq("id", id);

    if (error) {
        console.error("Error deleting account:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/accounts");
    return { success: true };
}
