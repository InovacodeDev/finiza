"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/supabase";

export type InvoiceRow = Database["public"]["Tables"]["invoices"]["Row"];

export async function fetchInvoices(creditCardId?: string) {
    const supabase = await createClient();

    let query = supabase
        .from("invoices")
        .select(
            `
            *,
            credit_card:credit_cards(*)
        `,
        )
        .order("reference_month", { ascending: true });

    if (creditCardId) {
        query = query.eq("credit_card_id", creditCardId);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching invoices:", error);
        return [];
    }

    return data;
}

export async function payInvoice(invoiceId: string) {
    const supabase = await createClient();

    // First, get the invoice to find the internal system_transaction_id
    const { data: invoice, error: fetchError } = await supabase
        .from("invoices")
        .select("*")
        .eq("id", invoiceId)
        .single();

    if (fetchError || !invoice) {
        console.error("Error finding invoice:", fetchError);
        return { success: false, error: "Fatura não encontrada." };
    }

    // According to the architecture, paying an invoice means setting the shadow transaction status to 'paid'
    // Let's also set the invoice status to 'paid' for clarity.

    const { error: txError } = await supabase
        .from("transactions")
        .update({ status: "paid" })
        .eq("id", invoice.system_transaction_id!);

    if (txError) {
        console.error("Error paying system transaction:", txError);
        return { success: false, error: txError.message };
    }

    const { error: invError } = await supabase.from("invoices").update({ status: "paid" }).eq("id", invoiceId);

    if (invError) {
        console.error("Error updating invoice status:", invError);
        return { success: false, error: invError.message };
    }

    revalidatePath("/credit-cards");
    revalidatePath("/accounts");
    revalidatePath("/transactions");
    return { success: true };
}
