import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchTransactions, 
  createTransactionAction, 
  updateTransactionAction, 
  deleteTransactionAction, 
  fetchCategories,
  updateTransactionsBulkAction
} from "@/app/actions/transaction-actions";
import { TransactionWithRelations, TransactionFilters } from "@/types/transactions";
import { getAccountsAction } from "@/app/actions/account-actions";
import { fetchCreditCards } from "@/app/actions/creditCardActions";
import { TransactionFormValues } from "@/schemas/transaction-schema";

export const TRANSACTIONS_KEY = ["transactions"];
export const CATEGORIES_KEY = ["categories"];
export const ACCOUNTS_KEY = ["accounts"];
export const CREDIT_CARDS_KEY = ["credit_cards"];

export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery<TransactionWithRelations[]>({
    queryKey: [...TRANSACTIONS_KEY, filters],
    queryFn: () => fetchTransactions(filters),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: () => fetchCategories(),
  });
}

export function useAccounts() {
  return useQuery({
    queryKey: ACCOUNTS_KEY,
    queryFn: async () => {
      const res = await getAccountsAction();
      if (!res.success) throw new Error(res.error);
      return res.data || [];
    },
  });
}

export function useCreditCards() {
  return useQuery({
    queryKey: CREDIT_CARDS_KEY,
    queryFn: () => fetchCreditCards(),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ values, installments }: { values: TransactionFormValues; installments?: number }) =>
      createTransactionAction(values, installments),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
        queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });
      }
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<TransactionFormValues> }) =>
      updateTransactionAction(id, values),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
        queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });
      }
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, deleteAllFuture }: { id: string; deleteAllFuture?: boolean }) => 
      deleteTransactionAction(id, deleteAllFuture),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
        queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });
      }
    },
  });
}

export function useBulkUpdateTransactions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, categoryId }: { ids: string[]; categoryId: string }) =>
      updateTransactionsBulkAction(ids, { category_id: categoryId }),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
      }
    },
  });
}
