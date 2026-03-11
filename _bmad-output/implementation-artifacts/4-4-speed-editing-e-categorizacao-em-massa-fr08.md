# Story 4.4: Speed Editing e Categorização em Massa (FR08)

Status: done

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

- [x] Task 1: UI de Seleção e Ações em Massa
  - [x] Adicionar estado de `selectedIds` na `TransactionsPage`.
  - [x] Atualizar `TransactionItem` para suportar um modo de seleção (checkbox).
  - [x] Criar componente `BulkActionsBar` que aparece quando `selectedIds.length > 0`.
- [x] Task 2: Implementação da Server Action de Bulk Update
  - [x] Criar `updateTransactionsBulkAction` em `src/app/actions/transaction-actions.ts`.
  - [x] Garantir que a action valide os `ids` e a `category_id` recebidos.
  - [x] Implementar a atualização em lote usando `.in('id', ids)`.
- [x] Task 3: Integração com TanStack Query
  - [x] Implementar hook `useBulkUpdateTransactions` no `use-transactions.ts`.
  - [x] Garantir invalidação correta do cache de transações e saldos após o update em massa.
- [x] Task 4: Refinamento de UX (Speed Editing)
  - [x] Implementar atalhos de teclado ou cliques rápidos para facilitar a categorização (ex: selecionar range com Shift).
  - [x] Garantir que as animações da `BulkActionsBar` sejam suaves (Framer Motion).

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

### File List

- `src/app/(app)/transactions/page.tsx`
- `src/components/business/transactions/transaction-item.tsx`
- `src/components/business/transactions/bulk-actions-bar.tsx`
- `src/app/actions/transaction-actions.ts`
- `src/hooks/use-transactions.ts`
- `src/app/actions/transaction-actions.test.ts`
- `src/schemas/transaction-schema.ts`

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash

### Debug Log References

- Implementada UI de seleção com `framer-motion`.
- Criado componente `BulkActionsBar` para ações em massa.
- Implementada `updateTransactionsBulkAction` com filtro de `is_system_readonly`.
- Adicionado suporte a Shift-click para seleção de range.
- Adicionada validação Zod para Bulk Update.

### Completion Notes List

- Task 1: UI de seleção e barra de ações criadas e integradas.
- Task 2: Server Action de update em massa implementada com segurança.
- Task 3: Hook `useBulkUpdateTransactions` integrado ao TanStack Query.
- Task 4: UX refinada com atalhos (Shift-click) e animações suaves.

### Change Log

- 2026-03-11: Implementação completa da Story 4.4.
- 2026-03-11: Correção pós-review: Adicionada validação Zod e feedback de sucesso.

Status: done
