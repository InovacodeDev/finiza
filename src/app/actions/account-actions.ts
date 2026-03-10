"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/types/actions";
import { accountSchema, accountUpdateSchema } from "@/schemas/account-schema";
import { Database } from "@/types/supabase";

type Account = Database["public"]["Tables"]["accounts"]["Row"];
type AccountInsert = Database["public"]["Tables"]["accounts"]["Insert"];
type AccountUpdate = Database["public"]["Tables"]["accounts"]["Update"];

/**
 * Fetches all accounts the current user has access to.
 */
export async function getAccountsAction(): Promise<ActionResponse<Account[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching accounts:", error);
        return { success: false, error: "Falha ao buscar contas." };
    }

    return { success: true, data: data || [] };
}

/**
 * Creates a new financial account.
 * The RLS trigger handle_new_account() automatically populates account_members.
 */
export async function createAccountAction(payload: unknown): Promise<ActionResponse<Account>> {
    const validatedFields = accountSchema.safeParse(payload);

    if (!validatedFields.success) {
        return { 
            success: false, 
            error: validatedFields.error.flatten().fieldErrors.name?.[0] || "Dados inválidos." 
        };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Usuário não autenticado." };
    }

    const accountData: AccountInsert = {
        ...validatedFields.data,
        balance: validatedFields.data.balance || 0,
    };

    const { data, error } = await supabase
        .from("accounts")
        .insert(accountData)
        .select()
        .single();

    if (error) {
        console.error("Error creating account:", error);
        return { success: false, error: "Falha ao criar conta no banco de dados." };
    }

    revalidatePath("/accounts");
    return { success: true, data };
}

/**
 * Updates an existing account.
 */
export async function updateAccountAction(id: string, payload: unknown): Promise<ActionResponse<Account>> {
    const validatedFields = accountUpdateSchema.safeParse(payload);

    if (!validatedFields.success) {
        return { 
            success: false, 
            error: "Dados inválidos para atualização." 
        };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from("accounts")
        .update(validatedFields.data)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating account:", error);
        return { success: false, error: "Falha ao atualizar conta." };
    }

    revalidatePath("/accounts");
    return { success: true, data };
}

/**
 * Deletes an account. 
 * RLS ensures only the owner can delete.
 */
export async function deleteAccountAction(id: string): Promise<ActionResponse> {
    const supabase = await createClient();
    const { error } = await supabase
        .from("accounts")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting account:", error);
        return { success: false, error: "Falha ao excluir conta." };
    }

    revalidatePath("/accounts");
    return { success: true };
}
