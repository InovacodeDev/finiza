"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/supabase";
import { randomUUID } from "crypto";
import { addMonths, format } from "date-fns";
import { ActionResponse } from "@/types/actions";
import { transactionSchema, transactionUpdateSchema } from "@/schemas/transaction-schema";
import { Transaction, TransactionInsert, TransactionUpdate, TransactionWithRelations, TransactionFilters } from "@/types/transactions";

/**
 * Fetches transactions for the current user with optional filters.
 */
export async function fetchTransactions(filters: TransactionFilters = {}): Promise<TransactionWithRelations[]> {
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

    if (filters.search) {
        query = query.ilike("description", `%${filters.search}%`);
    }

    if (filters.type && filters.type !== "all") {
        query = query.eq("type", filters.type);
    }

    if (filters.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
    }

    if (filters.categoryId && filters.categoryId !== "all") {
        query = query.eq("category_id", filters.categoryId);
    }

    if (filters.accountId && filters.accountId !== "all") {
        // Para filtrar por conta, checamos origem, destino ou cartão de crédito
        query = query.or(`account_id.eq.${filters.accountId},destination_account_id.eq.${filters.accountId},credit_card_id.eq.${filters.accountId}`);
    }

    if (filters.startDate) {
        query = query.gte("transaction_date", filters.startDate);
    }

    if (filters.endDate) {
        query = query.lte("transaction_date", filters.endDate);
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
        
        // --- Sincronia de Saldo para Parcelas ---
        if (data) {
            try {
                for (const t of (data as Transaction[])) {
                    if (t.status === "paid") {
                        let delta = 0;
                        if (t.type === "income" || t.type === "adjustment") delta = t.amount;
                        else if (t.type === "expense" || t.type === "transfer") delta = -t.amount;

                        if (delta !== 0) {
                            await supabase.rpc("update_account_balance", {
                                p_account_id: t.account_id,
                                p_amount_delta: delta,
                            });
                        }

                        if (t.type === "transfer" && t.destination_account_id) {
                            await supabase.rpc("update_account_balance", {
                                p_account_id: t.destination_account_id,
                                p_amount_delta: t.amount,
                            });
                        }
                    }
                }
            } catch (balanceError: any) {
                console.error("Error updating balance for installments:", balanceError);
            }
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

        // --- Sincronia de Saldo ---
        if (data && data.status === "paid") {
            try {
                // Atualizar conta principal
                let delta = 0;
                if (data.type === "income" || data.type === "adjustment") delta = data.amount;
                else if (data.type === "expense" || data.type === "transfer") delta = -data.amount;

                if (delta !== 0) {
                    await supabase.rpc("update_account_balance", {
                        p_account_id: data.account_id,
                        p_amount_delta: delta,
                    });
                }

                // Atualizar conta de destino se for transferência
                if (data.type === "transfer" && data.destination_account_id) {
                    await supabase.rpc("update_account_balance", {
                        p_account_id: data.destination_account_id,
                        p_amount_delta: data.amount,
                    });
                }
            } catch (balanceError) {
                console.error("Error updating balance in createTransactionAction:", balanceError);
                // Not halting execution as the transaction was already created, 
                // but in a production environment we might want more robust error handling or a background sync.
            }
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

    // Buscar a transação antiga para reverter o impacto no saldo
    const { data: oldTx, error: fetchError } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (fetchError || !oldTx) {
        return { success: false, error: "Transação original não encontrada." };
    }

    if (oldTx.is_system_readonly) {
        return { success: false, error: "Transações de sistema não podem ser alteradas manualmente." };
    }

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

    // --- Sincronia de Saldo ---
    // NOTA: Em uma aplicação de alta escala, isso deveria ser um Trigger ou RPC atômico.
    // Para cumprir a Story 4.2 com o padrão atual do projeto:
    try {
        // Reverter impacto antigo se era 'paid'
        if (oldTx.status === "paid") {
            let oldDelta = 0;
            if (oldTx.type === "income" || oldTx.type === "adjustment") oldDelta = -oldTx.amount;
            else if (oldTx.type === "expense" || oldTx.type === "transfer") oldDelta = oldTx.amount;

            if (oldDelta !== 0) {
                await supabase.rpc("update_account_balance", {
                    p_account_id: oldTx.account_id,
                    p_amount_delta: oldDelta,
                });
            }

            if (oldTx.type === "transfer" && oldTx.destination_account_id) {
                await supabase.rpc("update_account_balance", {
                    p_account_id: oldTx.destination_account_id,
                    p_amount_delta: -oldTx.amount,
                });
            }
        }

        // Aplicar novo impacto se agora é 'paid'
        if (data && data.status === "paid") {
            let newDelta = 0;
            if (data.type === "income" || data.type === "adjustment") newDelta = data.amount;
            else if (data.type === "expense" || data.type === "transfer") newDelta = -data.amount;

            if (newDelta !== 0) {
                await supabase.rpc("update_account_balance", {
                    p_account_id: data.account_id,
                    p_amount_delta: newDelta,
                });
            }

            if (data.type === "transfer" && data.destination_account_id) {
                await supabase.rpc("update_account_balance", {
                    p_account_id: data.destination_account_id,
                    p_amount_delta: data.amount,
                });
            }
        }
    } catch (balanceError: any) {
        console.error("Error syncing balance in updateTransactionAction:", balanceError);
        return { success: false, error: "Transação atualizada, mas erro ao sincronizar saldo: " + balanceError.message };
    }

    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    revalidatePath("/accounts");
    return { success: true, data: data as TransactionWithRelations };
}

/**
 * Deletes a transaction or its future installments.
 */
export async function deleteTransactionAction(id: string, deleteAllFuture: boolean = false): Promise<ActionResponse> {
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

    if (tx.is_system_readonly) {
        return { success: false, error: "Transações de sistema não podem ser excluídas manualmente." };
    }

    let deleteError;
    let transactionsToRevert: Transaction[] = [];

    if (tx.group_id && deleteAllFuture) {
        // Buscar todas as transações que serão excluídas para reverter o saldo
        const { data: groupTxs, error: fetchGroupError } = await supabase
            .from("transactions")
            .select("*")
            .eq("group_id", tx.group_id)
            .eq("user_id", user.id)
            .gte("transaction_date", tx.transaction_date);
            
        if (fetchGroupError) {
            console.error("Error fetching group transactions for deletion:", fetchGroupError);
            return { success: false, error: fetchGroupError.message };
        }
        
        // Filtrar transações protegidas antes de tentar excluir o grupo
        if (groupTxs?.some(t => t.is_system_readonly)) {
            return { success: false, error: "O grupo contém transações de sistema protegidas e não pode ser excluído em massa." };
        }

        transactionsToRevert = groupTxs || [];

        const { error } = await supabase
            .from("transactions")
            .delete()
            .eq("group_id", tx.group_id)
            .eq("user_id", user.id)
            .gte("transaction_date", tx.transaction_date);
        deleteError = error;
    } else {
        transactionsToRevert = [tx];
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

    // --- Sincronia de Saldo ---
    try {
        for (const t of transactionsToRevert) {
            if (t.status === "paid") {
                // Conta de origem
                let delta = 0;
                if (t.type === "income" || t.type === "adjustment") delta = -t.amount;
                else if (t.type === "expense" || t.type === "transfer") delta = t.amount;

                if (delta !== 0) {
                    await supabase.rpc("update_account_balance", {
                        p_account_id: t.account_id,
                        p_amount_delta: delta,
                    });
                }

                // Conta de destino se for transferência
                if (t.type === "transfer" && t.destination_account_id) {
                    await supabase.rpc("update_account_balance", {
                        p_account_id: t.destination_account_id,
                        p_amount_delta: -t.amount,
                    });
                }
            }
        }
    } catch (balanceError: any) {
        console.error("Error syncing balance in deleteTransactionAction:", balanceError);
        return { success: false, error: "Transação excluída, mas erro ao sincronizar saldo: " + balanceError.message };
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
