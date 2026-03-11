# Story 4.2: Edição e Exclusão de Transações com Sincronia de Saldo

Status: done

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

## Senior Developer Review (AI)

- **Outcome:** Approved (with fixes)
- **Date:** 2026-03-11
- **Reviewer:** Gemini CLI

### Action Items Resolved
- [x] Implementado check de `is_system_readonly` para proteger transações de sistema.
- [x] Corrigida ausência de sincronia de saldo em criações de parcelamento.
- [x] Substituído `window.confirm` por `ConfirmModal` para uma UX mais polida.
- [x] Melhorado tratamento de erro em falhas de sincronia de saldo (não mais silenciado).
- [x] Adicionados testes unitários básicos para lógica de sincronia.

## Tasks / Subtasks

- [x] Task 1: Refatoração da Lógica de Sincronia de Saldo (Atomicidade)
  - [x] Implementar função auxiliar `updateAccountBalance` ou RPC no Supabase para garantir atomicidade.
  - [x] Atualizar `updateTransactionAction` em `src/app/actions/transaction-actions.ts` para calcular a diferença de saldo.
  - [x] Atualizar `deleteTransactionAction` para reverter o saldo total da transação.
- [x] Task 2: Implementação da Edição com Mudança de Conta
  - [x] Garantir que se a `account_id` mudar, o saldo da conta de origem seja "devolvido" e o da conta de destino seja "debitado/creditado".
  - [x] Validar a transação editada com `TransactionSchema`.
- [x] Task 3: Gestão de Exclusão em Grupo (Parcelas/Recorrência)
  - [x] Implementar a lógica de exclusão em cascata para `group_id` com filtro por data (>= data atual).
  - [x] Garantir que o rollback de saldo seja aplicado a cada transação excluída do grupo.
- [x] Task 4: UI de Edição e Feedback (Framer Motion)
  - [x] Integrar `updateTransactionAction` e `deleteTransactionAction` com o `CreateTransactionModal` (agora em `business/transactions`).
  - [x] Usar `useMutation` do TanStack Query para gerenciar o estado de loading e feedback de erro.
  - [x] Implementar `router.refresh()` após o sucesso para atualizar o App Shell.
- [x] [AI-Review] Resolved high/medium issues from automated review.

## Dev Notes

- **RPC update_account_balance:** Implementado para garantir que atualizações de saldo sejam atômicas no banco de dados.
- **Sincronia em Edição:** A lógica de `updateTransactionAction` agora reverte o estado anterior (usando os dados da transação antes do update) e aplica o novo estado, tratando mudanças de conta e valor.
- **Exclusão de Grupo:** O usuário agora tem a opção na UI de excluir apenas uma instância ou todas as futuras em um grupo recorrente/parcelado.

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

- Criada migração `20260311000000_transaction_balance_sync.sql`.
- Atualizado `src/app/actions/transaction-actions.ts` (CRUD + RPC calls).
- Atualizado `src/hooks/use-transactions.ts` (mutation params).
- Atualizado `src/components/business/transactions/create-transaction-modal.tsx` (UI/UX).

### Completion Notes List

- Implementação completa da sincronia de saldo para receitas, despesas e transferências.
- Suporte a exclusão seletiva de grupos.
- Feedback visual e revalidação de rotas integrados.
- Resolvidos pontos críticos de segurança e integridade apontados no Code Review.

### File List

- `supabase/migrations/20260311000000_transaction_balance_sync.sql`
- `src/app/actions/transaction-actions.ts`
- `src/hooks/use-transactions.ts`
- `src/components/business/transactions/create-transaction-modal.tsx`
- `src/app/actions/transaction-actions.test.ts`
