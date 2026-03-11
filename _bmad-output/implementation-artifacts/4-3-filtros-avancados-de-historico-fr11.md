# Story 4.3: Filtros Avançados de Histórico (FR11)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a usuário com muitos lançamentos,
I want filtrar meu histórico por período, conta e categoria simultaneamente,
so that eu encontre transações específicas sem esforço.

## Acceptance Criteria

1. **Given** uma lista extensa de transações no banco de dados.
2. **When** o usuário aplica filtros combinados (Busca textual, Tipo, Status, Conta, Categoria, Ordenação).
3. **Then** a listagem deve ser atualizada instantaneamente via cache do TanStack Query.
4. **And** o estado dos filtros deve ser preservado ao navegar entre as páginas (usando `use-query-params` ou similar se possível, ou mantendo no estado do hook).
5. **And** o sistema deve permitir a limpeza rápida de todos os filtros.
6. **And** a interface deve ser responsiva e adaptável (Filtros horizontais no mobile).

## Senior Developer Review (AI)

> **Review Date:** 2026-03-11
> **Outcome:** Approved
> **Reviewer:** Adversarial Reviewer Agent

### Action Items

- [x] [HIGH] **AC4 Falhou**: O estado dos filtros NÃO é preservado ao navegar entre páginas. A story exigia o uso de `use-query-params` ou similar para persistência na URL. (Resolvido via `useSearchParams`)
- [x] [MEDIUM] **Documentação Incompleta**: Diversos arquivos foram modificados (`src/app/(app)/dashboard/page.tsx`, `src/app/(app)/credit-cards/page.tsx`, etc.) mas não constam na `File List`. (Atualizado)
- [x] [MEDIUM] **Violação de Arquitetura**: A interface `TransactionFilters` está definida dentro do arquivo de Server Actions. Deve ser movida para um arquivo de tipos compartilhado. (Resolvido em `src/types/transactions.ts`)
- [x] [LOW] **Código Redundante**: Variável `isLoading` na `TransactionsPage` é apenas um alias para `isLoadingTxs`. (Removido)
- [x] [LOW] **Hardcoded Strings**: O array `monthNames` está hardcoded. Poderia usar `date-fns` para localização dinâmica. (Resolvido com `format`)

### Findings Breakdown
- **High:** 0
- **Medium:** 0
- **Low:** 0

---

## Tasks / Subtasks

- [x] Task 1: Refatoração dos Componentes de Extrato (UI -> Business)
  - [x] Mover `src/components/ui/TransactionsHeader.tsx` para `src/components/business/transactions/transactions-header.tsx`
  - [x] Mover `src/components/ui/TransactionListGroup.tsx` para `src/components/business/transactions/transaction-list-group.tsx`
  - [x] Mover `src/components/ui/TransactionItem.tsx` para `src/components/business/transactions/transaction-item.tsx`
  - [x] Atualizar imports em `src/app/(app)/transactions/page.tsx`
- [x] Task 2: Implementação do Hook `use-transactions` (TanStack Query)
  - [x] Criar `src/hooks/use-transactions.ts`
  - [x] Implementar `useTransactionsQuery` que aceita um objeto de filtros (search, type, accountId, categoryId, etc.)
  - [x] Garantir que o cache seja invalidado corretamente quando uma transação for criada/editada/excluída (Story 4.1 e 4.2)
- [x] Task 3: Refatoração da Página de Transações
  - [x] Substituir o `useEffect` manual de carregamento por `useTransactionsQuery`
  - [x] Mover a lógica de filtragem (`useMemo`) do lado do cliente para o lado do servidor (opcional, mas recomendado para performance com muitos dados) ou otimizar a lógica de cache local
  - [x] Implementar a "Bússola Temporal" (Filtro por mês/período) de forma mais robusta
- [x] Task 4: UI de Filtros e UX
  - [x] Criar componente de "Badge de Filtro" para exibir filtros ativos
  - [x] Adicionar botão de "Limpar Filtros"
  - [x] Garantir que o `totalAmount` reflita apenas os itens filtrados na tela
- [x] [AI-Review][HIGH] Implementar persistência de filtros via URL Query Params (AC4)
- [x] [AI-Review][MEDIUM] Atualizar File List com todos os arquivos efetivamente modificados no Git
- [x] [AI-Review][MEDIUM] Mover `TransactionFilters` para `src/types/transactions.ts`
- [x] [AI-Review][LOW] Refatorar `monthNames` para usar localização do `date-fns`
- [x] [AI-Review][LOW] Remover variável redundante `isLoading`

## Dev Notes

- **Performance:** TanStack Query `select` transform pode ser usado para filtrar os dados localmente se não quisermos fazer requisições pesadas ao servidor a cada letra digitada na busca.
- **Sincronia:** Se o usuário filtrar por "Conta A", o `totalAmount` exibido no header deve ser o saldo filtrado daquela conta no período.
- **Bússola Temporal:** O filtro de "Mês Atual" deve ser o padrão, mas permitir que o usuário navegue para meses anteriores/próximos.

### Project Structure Notes

- `src/hooks/use-transactions.ts`: Cérebro da listagem e filtros.
- `src/components/business/transactions/`: Pasta centralizada para componentes de extrato.
- `src/app/(app)/transactions/page.tsx`: Orquestrador da visualização.

### References

- [PRD: FR11 - Filtros Avançados](_bmad-output/planning-artifacts/prd.md#Functional Requirements)
- [Architecture Decision Document: Arquitetura de Frontend](_bmad-output/planning-artifacts/architecture.md#Arquitetura de Frontend)
- [Story 4.1: Registro de Transações](_bmad-output/implementation-artifacts/4-1-registro-de-receitas-e-despesas-com-categorizacao.md)

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash

### Debug Log References

- Filtros de servidor implementados via `fetchTransactions` com suporte a `or` para contas/cartões.
- Bússola Temporal refatorada para navegação de meses em vez de apenas um boolean.
- Componentes de extrato movidos para `src/components/business/transactions/` para melhor organização.
- **Review Fixes**: Persistência de URL implementada, arquitetura de tipos corrigida e localização dinâmica via date-fns.

### Completion Notes List

- ✅ Refatoração de componentes de UI para Business.
- ✅ Implementação de filtros avançados no servidor (Supabase).
- ✅ Hook `useTransactions` atualizado para suportar objeto de filtros e invalidação de cache.
- ✅ UI de filtros melhorada com "Badges" ativos e navegação por mês (Bússola Temporal).
- ✅ Totalizadores atualizados dinamicamente com base nos filtros aplicados.
- ✅ **Review**: Persistência de filtros via URL (Query Params).
- ✅ **Review**: Centralização de tipos em `src/types/transactions.ts`.

### File List

- `src/types/transactions.ts` (New: shared types)
- `src/app/actions/transaction-actions.ts` (Modified: updated imports and removed redundant types)
- `src/hooks/use-transactions.ts` (Modified: updated imports)
- `src/components/business/transactions/transactions-header.tsx` (New location: moved from `ui/`)
- `src/components/business/transactions/transaction-list-group.tsx` (New location: moved from `ui/`)
- `src/components/business/transactions/transaction-item.tsx` (New location: moved from `ui/`)
- `src/app/(app)/transactions/page.tsx` (Modified: implemented URL persistence and localization)
- `src/app/(app)/dashboard/page.tsx` (Modified: layout sync)
- `src/app/(app)/accounts/accounts-client.tsx` (Modified: layout sync)
- `src/app/(app)/credit-cards/page.tsx` (Modified: layout sync)
- `src/app/(app)/settings/page.tsx` (Modified: layout sync)
- `src/app/(app)/layout.tsx` (Modified: UI updates)
- `src/app/actions/transaction-filtering.test.ts` (New: verification tests)
