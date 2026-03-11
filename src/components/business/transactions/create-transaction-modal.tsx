"use client";

import React, { useEffect, useState } from "react";
import { X, ArrowDown, ArrowUp, ArrowRightLeft, Settings2, CheckCircle2, Clock, Trash2 } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion, Variants } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { transactionSchema, TransactionFormValues } from "@/schemas/transaction-schema";
import { useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from "@/hooks/use-transactions";
import { TransactionWithRelations } from "@/app/actions/transaction-actions";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: { id: string; name: string; color_hex?: string | null }[];
  categories: { id: string; name: string; is_system?: boolean; icon_slug?: string | null; color_hex?: string | null }[];
  creditCards?: { id: string; name: string; account_id: string }[];
  transactionToEdit?: TransactionWithRelations | null;
}

const TYPES = [
  { id: "income" as const, label: "Receita", icon: ArrowUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: "expense" as const, label: "Despesa", icon: ArrowDown, color: "text-red-500", bg: "bg-red-500/10" },
  {
    id: "transfer" as const,
    label: "Transferência",
    icon: ArrowRightLeft,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  { id: "adjustment" as const, label: "Ajuste", icon: Settings2, color: "text-zinc-400", bg: "bg-zinc-800" },
];

export function CreateTransactionModal({
  isOpen,
  onClose,
  accounts,
  categories,
  creditCards = [],
  transactionToEdit,
}: CreateTransactionModalProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();
  const [formError, setFormError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteMode, setDeleteMode] = useState<"single" | "group">("single");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      status: "paid",
      amount: 0,
      description: "",
      transaction_date: new Date().toISOString().split("T")[0],
      is_recurring: false,
      installments: 1,
    },
  });

  const type = useWatch({ control, name: "type" });
  const status = useWatch({ control, name: "status" });
  const amount = useWatch({ control, name: "amount" });
  const accountId = useWatch({ control, name: "account_id" });
  const creditCardId = useWatch({ control, name: "credit_card_id" });

  useEffect(() => {
    if (isOpen) {
      if (transactionToEdit) {
        reset({
          type: transactionToEdit.type,
          status: transactionToEdit.status,
          amount: transactionToEdit.amount,
          description: transactionToEdit.description,
          transaction_date: transactionToEdit.transaction_date,
          account_id: transactionToEdit.account_id,
          category_id: transactionToEdit.category_id,
          destination_account_id: transactionToEdit.destination_account_id,
          credit_card_id: transactionToEdit.credit_card_id,
          is_recurring: transactionToEdit.is_recurring || false,
          installments: 1,
        });
      } else {
        reset({
          type: "expense",
          status: "paid",
          amount: 0,
          description: "",
          transaction_date: new Date().toISOString().split("T")[0],
          is_recurring: false,
          installments: 1,
        });
      }
    }
  }, [isOpen, transactionToEdit, reset]);

  const handleClose = () => {
    setFormError(null);
    onClose();
  };

  const onFormSubmit = async (data: TransactionFormValues) => {
    setFormError(null);
    const { installments, ...values } = data;
    
    // Adjust account_id if credit card is selected
    if (values.type === "expense" && values.credit_card_id) {
        const cc = creditCards.find((c) => c.id === values.credit_card_id);
        if (cc) values.account_id = cc.account_id;
    }

    let res;
    if (transactionToEdit) {
      res = await updateMutation.mutateAsync({ id: transactionToEdit.id, values });
    } else {
      res = await createMutation.mutateAsync({ values, installments });
    }

    if (res.success) {
      router.refresh();
      handleClose();
    } else {
      setFormError(res.error || "Erro desconhecido ao salvar.");
    }
  };

  const handleDelete = async () => {
    if (!transactionToEdit) return;
    
    if (transactionToEdit.group_id) {
      setDeleteMode("group");
    } else {
      setDeleteMode("single");
    }
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async (deleteAllFuture: boolean = false) => {
    if (!transactionToEdit) return;
    
    setShowDeleteConfirm(false);
    const res = await deleteMutation.mutateAsync({ id: transactionToEdit.id, deleteAllFuture });
    if (res.success) {
      router.refresh();
      handleClose();
    } else {
      setFormError(res.error || "Erro ao excluir.");
    }
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.95, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", duration: 0.3, bounce: 0 } },
    exit: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.95, y: shouldReduceMotion ? 0 : 20, transition: { duration: 0.2 } }
  };

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) {
      setValue("amount", 0);
      return;
    }
    setValue("amount", parseInt(value, 10) / 100);
  };

  const formattedAmount = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);

  const isTransfer = type === "transfer";
  const isAdjustment = type === "adjustment";
  const isEditing = !!transactionToEdit;
  const isCreditCardSelected = !!creditCardId;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={handleClose}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            />

            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-zinc-900 border border-zinc-800 p-6 rounded-3xl w-full max-w-lg shadow-2xl my-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-zinc-100">
                  {isEditing ? "Editar Transação" : "Nova Transação"}
                </h3>
                <div className="flex items-center gap-2">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                  <button onClick={handleClose} className="text-zinc-500 hover:text-zinc-300 transition-colors p-2">
                    <X size={24} />
                  </button>
                </div>
              </div>

              {formError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-6">
                {/* Status Selector */}
                <div className="flex justify-center">
                  <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setValue("status", "paid")}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all",
                        status === "paid" ? "bg-zinc-800 text-emerald-500 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                      )}
                    >
                      <CheckCircle2 size={14} />
                      Efetivado
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("status", "pending")}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all",
                        status === "pending" ? "bg-zinc-800 text-amber-500 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                      )}
                    >
                      <Clock size={14} />
                      Previsto
                    </button>
                  </div>
                </div>

                {/* Types */}
                <div className="flex bg-zinc-950/50 p-1 rounded-2xl border border-zinc-800">
                  {TYPES.map((t) => {
                    const Icon = t.icon;
                    const isActive = type === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setValue("type", t.id)}
                        disabled={isEditing}
                        className={cn(
                          "flex-1 flex flex-col items-center justify-center py-3 gap-1 rounded-xl transition-all",
                          isActive ? "bg-zinc-800 shadow-md" : "hover:bg-zinc-900",
                          isEditing && !isActive ? "opacity-30 cursor-not-allowed" : "",
                        )}
                      >
                        <Icon size={18} className={isActive ? t.color : "text-zinc-500"} />
                        <span className={cn("text-xs font-semibold", isActive ? "text-zinc-100" : "text-zinc-500")}>
                          {t.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Amount */}
                <div className="flex flex-col items-center justify-center py-4">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Valor</label>
                  <div className="flex items-center justify-center w-full">
                    <span className="text-zinc-500 text-2xl mr-2 mb-1">R$</span>
                    <div className="relative flex items-center justify-center">
                      <span className="text-5xl font-bold opacity-0 pointer-events-none min-w-[3ch] px-1 whitespace-pre">
                        {formattedAmount}
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formattedAmount}
                        onChange={handleAmountChange}
                        placeholder="0,00"
                        className={cn(
                          "absolute inset-0 w-full text-center text-5xl font-bold bg-transparent border-none outline-none placeholder:text-zinc-800 transition-colors",
                          type === "income" ? "text-emerald-500" : type === "expense" ? "text-red-500" : "text-zinc-100",
                        )}
                      />
                    </div>
                  </div>
                  {errors.amount && <p className="text-red-500 text-xs mt-2">{errors.amount.message}</p>}
                </div>

                {/* Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-zinc-400">Descrição</label>
                    <input
                      {...register("description")}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                      placeholder="ex: Mercado Livre"
                    />
                    {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-zinc-400">Data</label>
                    <input
                      type="date"
                      {...register("transaction_date")}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-primary/50 transition-all [color-scheme:dark]"
                    />
                    {errors.transaction_date && <p className="text-red-500 text-xs">{errors.transaction_date.message}</p>}
                  </div>

                  {/* Account Origin */}
                  <div className={cn("flex flex-col gap-2", isTransfer ? "col-span-1" : "col-span-2")}>
                    {type === "expense" ? (
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-zinc-400">Origem do Pagamento</label>
                        <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                          <button
                            type="button"
                            onClick={() => {
                              setValue("credit_card_id", undefined);
                            }}
                            className={cn(
                              "px-3 py-1 text-xs font-semibold rounded-md transition-all",
                              !isCreditCardSelected ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
                            )}
                          >
                            Conta
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (creditCards.length > 0) setValue("credit_card_id", creditCards[0].id);
                            }}
                            className={cn(
                              "px-3 py-1 text-xs font-semibold rounded-md transition-all",
                              isCreditCardSelected ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
                            )}
                          >
                            Cartão
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="text-sm font-medium text-zinc-400 mb-2">
                        {isTransfer ? "Origem" : type === "income" ? "Destino" : "Conta"}
                      </label>
                    )}

                    {!isCreditCardSelected || type !== "expense" ? (
                      <select
                        {...register("account_id")}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-primary/50 transition-all appearance-none"
                      >
                        <option value="" disabled>Selecione uma conta</option>
                        {accounts.map((acc) => (
                          <option key={acc.id} value={acc.id}>{acc.name}</option>
                        ))}
                      </select>
                    ) : (
                      <select
                        {...register("credit_card_id")}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-emerald-500/50 transition-all appearance-none"
                      >
                        <option value="" disabled>Selecione um cartão</option>
                        {creditCards.map((cc) => (
                          <option key={cc.id} value={cc.id}>{cc.name}</option>
                        ))}
                      </select>
                    )}
                    {errors.account_id && <p className="text-red-500 text-xs">{errors.account_id.message}</p>}
                  </div>

                  {/* Account Destination (Transfer) */}
                  {isTransfer && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-zinc-400">Destino</label>
                      <select
                        {...register("destination_account_id")}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-primary/50 transition-all appearance-none"
                      >
                        <option value="" disabled>Selecione uma conta</option>
                        {accounts.filter((a) => a.id !== accountId).map((acc) => (
                          <option key={acc.id} value={acc.id}>{acc.name}</option>
                        ))}
                      </select>
                      {errors.destination_account_id && <p className="text-red-500 text-xs">{errors.destination_account_id.message}</p>}
                    </div>
                  )}

                  {/* Category (Income/Expense) */}
                  {!isTransfer && !isAdjustment && (
                    <div className="flex flex-col gap-2 col-span-2">
                      <label className="text-sm font-medium text-zinc-400">Categoria</label>
                      <select
                        {...register("category_id")}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-primary/50 transition-all appearance-none"
                      >
                        <option value="">Selecione uma categoria</option>
                        {categories
                          .filter((c) => {
                            if (c.is_system) return false;
                            // Robust Classification Logic
                            const incomeKeywords = ["salário", "rendimento", "extra", "venda", "receita", "faturamento"];
                            const expenseKeywords = ["alimentação", "moradia", "transporte", "lazer", "saúde", "educação", "gasto", "despesa"];
                            const catName = c.name.toLowerCase();
                            
                            if (type === "income") return incomeKeywords.some(k => catName.includes(k)) || catName === "outros";
                            if (type === "expense") return expenseKeywords.some(k => catName.includes(k)) || !incomeKeywords.some(k => catName.includes(k));
                            return true;
                          })
                          .map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                      </select>
                    </div>
                  )}

                  {type === "expense" && isCreditCardSelected && !isEditing && (
                    <div className="flex flex-col gap-2 col-span-2">
                      <label className="text-sm font-medium text-zinc-400">Parcelas</label>
                      <input
                        type="number"
                        min="1"
                        {...register("installments", { valueAsNumber: true })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-emerald-500/50 transition-all"
                      />
                    </div>
                  )}
                </div>

                {!isTransfer && !isAdjustment && (
                  <div className="flex items-center gap-3 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800">
                    <input
                      type="checkbox"
                      id="recurring"
                      {...register("is_recurring")}
                      className="w-5 h-5 rounded border-zinc-700 text-primary focus:ring-primary/50 bg-zinc-900"
                    />
                    <div className="flex flex-col">
                      <label htmlFor="recurring" className="text-sm font-semibold text-zinc-200 cursor-pointer">
                        Repetir mensalmente
                      </label>
                      <p className="text-xs text-zinc-500">Ajuda a formar a Bússola Temporal</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 mt-2 border-t border-zinc-800">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "w-full py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white",
                      type === "income" ? "bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]" :
                      type === "expense" ? "bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.2)]" :
                      type === "transfer" ? "bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)]" :
                      "bg-zinc-700 hover:bg-zinc-600 shadow-[0_0_20px_rgba(113,113,122,0.2)]",
                    )}
                  >
                    {isSubmitting ? "Salvando..." : `Salvar ${TYPES.find((t) => t.id === type)?.label}`}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={showDeleteConfirm && deleteMode === "single"}
        title="Apagar Transação"
        description="Tem certeza que deseja apagar esta transação? Esta ação não pode ser desfeita."
        confirmText="Apagar"
        cancelText="Cancelar"
        onConfirm={() => confirmDelete(false)}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {deleteMode === "group" && (
        <ConfirmModal
          isOpen={showDeleteConfirm}
          title="Apagar Grupo"
          description="Esta transação faz parte de um grupo. Deseja apagar apenas esta ocorrência ou todas as futuras também?"
          confirmText="Apagar Todas"
          cancelText="Apenas esta"
          onConfirm={() => confirmDelete(true)}
          onCancel={() => confirmDelete(false)}
        />
      )}
    </>
  );
}
