# Story 4.3: Filtros Avançados de Histórico (FR11)

Status: ready-for-dev

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

## Tasks / Subtasks

- [ ] Task 1: Refatoração dos Componentes de Extrato (UI -> Business)
  - [ ] Mover `src/components/ui/TransactionsHeader.tsx` para `src/components/business/transactions/transactions-header.tsx`
  - [ ] Mover `src/components/ui/TransactionListGroup.tsx` para `src/components/business/transactions/transaction-list-group.tsx`
  - [ ] Mover `src/components/ui/TransactionItem.tsx` para `src/components/business/transactions/transaction-item.tsx`
  - [ ] Atualizar imports em `src/app/(app)/transactions/page.tsx`
- [ ] Task 2: Implementação do Hook `use-transactions` (TanStack Query)
  - [ ] Criar `src/hooks/use-transactions.ts`
  - [ ] Implementar `useTransactionsQuery` que aceita um objeto de filtros (search, type, accountId, categoryId, etc.)
  - [ ] Garantir que o cache seja invalidado corretamente quando uma transação for criada/editada/excluída (Story 4.1 e 4.2)
- [ ] Task 3: Refatoração da Página de Transações
  - [ ] Substituir o `useEffect` manual de carregamento por `useTransactionsQuery`
  - [ ] Mover a lógica de filtragem (`useMemo`) do lado do cliente para o lado do servidor (opcional, mas recomendado para performance com muitos dados) ou otimizar a lógica de cache local
  - [ ] Implementar a "Bússola Temporal" (Filtro por mês/período) de forma mais robusta
- [ ] Task 4: UI de Filtros e UX
  - [ ] Criar componente de "Badge de Filtro" para exibir filtros ativos
  - [ ] Adicionar botão de "Limpar Filtros"
  - [ ] Garantir que o `totalAmount` reflita apenas os itens filtrados na tela

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

### Completion Notes List

### File List
