# Story 4.2: Edição e Exclusão de Transações com Sincronia de Saldo

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a usuário que cometeu um erro no lançamento,
I want editar ou excluir uma transação passada,
so that o saldo das minhas contas seja recalculado automaticamente pelo sistema.

## Acceptance Criteria

1. **Given** uma transação existente.
2. **When** o usuário altera o valor, data ou conta da transação.
3. **Then** o sistema deve reverter o impacto no saldo da conta antiga e aplicar o novo impacto na conta atual (se alterada) de forma atômica.
4. **When** o usuário exclui uma transação.
5. **Then** o saldo da conta vinculada deve ser restaurado (rollback do valor da transação).
6. **And** se a transação for parte de um grupo (parcelamento/recorrência), o sistema deve oferecer a opção de excluir "esta" ou "esta e as próximas".
7. **And** todas as operações devem retornar `ActionResponse` e revalidar os caminhos `/transactions` e `/accounts`.
8. **And** as operações devem ser protegidas por RLS (verificado no servidor).

## Tasks / Subtasks

- [ ] Task 1: Refatoração da Lógica de Sincronia de Saldo (Atomicidade)
  - [ ] Implementar função auxiliar `updateAccountBalance` ou RPC no Supabase para garantir atomicidade.
  - [ ] Atualizar `updateTransactionAction` em `src/app/actions/transaction-actions.ts` para calcular a diferença de saldo.
  - [ ] Atualizar `deleteTransactionAction` para reverter o saldo total da transação.
- [ ] Task 2: Implementação da Edição com Mudança de Conta
  - [ ] Garantir que se a `account_id` mudar, o saldo da conta de origem seja "devolvido" e o da conta de destino seja "debitado/creditado".
  - [ ] Validar a transação editada com `TransactionSchema`.
- [ ] Task 3: Gestão de Exclusão em Grupo (Parcelas/Recorrência)
  - [ ] Implementar a lógica de exclusão em cascata para `group_id` com filtro por data (>= data atual).
  - [ ] Garantir que o rollback de saldo seja aplicado a cada transação excluída do grupo.
- [ ] Task 4: UI de Edição e Feedback (Framer Motion)
  - [ ] Integrar `updateTransactionAction` e `deleteTransactionAction` com o `CreateTransactionModal` (agora em `business/transactions`).
  - [ ] Usar `useMutation` do TanStack Query para gerenciar o estado de loading e feedback de erro.
  - [ ] Implementar `router.refresh()` após o sucesso para atualizar o App Shell.

## Dev Notes

- **Atomicidade:** Como o projeto ainda não usa triggers para `accounts.balance`, as Server Actions devem ser extremamente cuidadosas. O uso de `supabase.rpc()` para operações de saldo é altamente recomendado para evitar "race conditions".
- **Rollback de Saldo:** 
  - Receita Excluída: Subtrair valor do saldo.
  - Despesa Excluída: Somar valor ao saldo.
  - Transferência Excluída: Somar na origem, subtrair no destino.
- **Transações de Sistema:** Validar `is_system_readonly` antes de permitir qualquer edição/exclusão.

### Project Structure Notes

- `src/app/actions/transaction-actions.ts`: Concentra a lógica de mutação e sincronia.
- `src/components/business/transactions/create-transaction-modal.tsx`: Ponto de entrada para edição e exclusão.

### References

- [Architecture Decision Document: Padrões de Processo](_bmad-output/planning-artifacts/architecture.md#Padrões de Processo)
- [Story 4.1: Registro de Transações](_bmad-output/implementation-artifacts/4-1-registro-de-receitas-e-despesas-com-categorizacao.md)
- [Supabase Migration: Transactions Schema](supabase/migrations/20260227231400_transactions_schema.sql)

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash

### Debug Log References

### Completion Notes List

### File List
