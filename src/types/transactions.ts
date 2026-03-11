import { Database } from "./supabase";

export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type TransactionInsert = Database["public"]["Tables"]["transactions"]["Insert"];
export type TransactionUpdate = Database["public"]["Tables"]["transactions"]["Update"];
export type TransactionWithRelations = Transaction & {
    category?: Database["public"]["Tables"]["categories"]["Row"] | null;
    account?: Database["public"]["Tables"]["accounts"]["Row"] | null;
    destination_account?: Database["public"]["Tables"]["accounts"]["Row"] | null;
    credit_card?: Database["public"]["Tables"]["credit_cards"]["Row"] | null;
};

export interface TransactionFilters {
    search?: string;
    type?: string;
    status?: string;
    accountId?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
}
