# Story 4.4: Speed Editing e Categorização em Massa (FR08)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a usuário que preza pela agilidade,
I want editar categorias de múltiplas transações de uma só vez,
so that eu organize meses inteiros de faturas em poucos cliques.

## Acceptance Criteria

1. **Given** uma lista de transações exibida no extrato.
2. **When** o usuário ativa o modo de seleção (checkboxes) e seleciona múltiplas transações.
3. **Then** uma barra de ações em massa deve aparecer com a opção "Alterar Categoria".
4. **When** o usuário escolhe uma categoria e clica em "Aplicar", o sistema deve atualizar todos os registros selecionados de forma atômica no Supabase.
5. **And** a interface deve exibir um feedback de sucesso e desmarcar os itens automaticamente.
6. **And** a atualização deve ser protegida por RLS e validada via Server Action padronizada (`ActionResponse`).

## Tasks / Subtasks

- [ ] Task 1: UI de Seleção e Ações em Massa
  - [ ] Adicionar estado de `selectedIds` na `TransactionsPage`.
  - [ ] Atualizar `TransactionItem` para suportar um modo de seleção (checkbox).
  - [ ] Criar componente `BulkActionsBar` que aparece quando `selectedIds.length > 0`.
- [ ] Task 2: Implementação da Server Action de Bulk Update
  - [ ] Criar `updateTransactionsBulkAction` em `src/app/actions/transaction-actions.ts`.
  - [ ] Garantir que a action valide os `ids` e a `category_id` recebidos.
  - [ ] Implementar a atualização em lote usando `.in('id', ids)`.
- [ ] Task 3: Integração com TanStack Query
  - [ ] Implementar hook `useBulkUpdateTransactions` no `use-transactions.ts`.
  - [ ] Garantir invalidação correta do cache de transações e saldos após o update em massa.
- [ ] Task 4: Refinamento de UX (Speed Editing)
  - [ ] Implementar atalhos de teclado ou cliques rápidos para facilitar a categorização (ex: selecionar range com Shift).
  - [ ] Garantir que as animações da `BulkActionsBar` sejam suaves (Framer Motion).

## Dev Notes

- **Atomicidade:** A atualização no Supabase via `.in('id', ids)` é atômica por padrão para as linhas afetadas.
- **RLS:** O Supabase garantirá que o usuário só consiga atualizar transações que pertencem aos seus `tenants/accounts`.
- **Refatoração:** Esta story depende da refatoração de nomes e pastas iniciada na Story 4.1.

### Project Structure Notes

- `src/components/business/transactions/bulk-actions-bar.tsx`: Interface de controle de massa.
- `src/app/actions/transaction-actions.ts`: Lógica de persistência em lote.
- `src/hooks/use-transactions.ts`: Gerenciamento de estado de mutação.

### References

- [PRD: FR08 - Speed Editing](_bmad-output/planning-artifacts/prd.md#Functional Requirements)
- [Architecture Decision Document: Padrões de Processo](_bmad-output/planning-artifacts/architecture.md#Padrões de Processo)
- [Story 4.1: Registro de Transações](_bmad-output/implementation-artifacts/4-1-registro-de-receitas-e-despesas-com-categorizacao.md)

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash

### Debug Log References

### Completion Notes List

### File List
