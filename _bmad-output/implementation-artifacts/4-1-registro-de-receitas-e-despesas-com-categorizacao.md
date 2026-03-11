# Story 4.1: Registro de Receitas e Despesas com Categorização

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a usuário no dia-a-dia,
I want lançar meus gastos e ganhos rapidamente escolhendo a conta e a categoria,
so that meu fluxo de caixa seja registrado com precisão.

## Acceptance Criteria

1. **Given** o formulário de transação (Modal/Slide-over).
2. **When** o usuário seleciona o tipo "Despesa" ou "Receita".
3. **Then** as categorias disponíveis no select devem filtrar dinamicamente de acordo com o tipo escolhido.
4. **And** os dados (descrição, valor, data, conta, categoria) devem ser validados via Zod no lado do servidor.
5. **And** a persistência deve retornar um objeto `ActionResponse` padronizado.
6. **And** a interface deve utilizar TanStack Query para mutações e invalidação de cache (recalculando saldos de contas).

## Tasks / Subtasks

- [x] Task 1: Refatoração e Alinhamento Arquitetural (Kebab-case & Localização)
  - [x] Renomear `src/app/actions/transactionActions.ts` para `src/app/actions/transaction-actions.ts`
  - [x] Mover `src/components/ui/CreateTransactionModal.tsx` para `src/components/business/transactions/create-transaction-modal.tsx`
  - [x] Atualizar todos os imports quebrados
- [x] Task 2: Schema de Validação e Tipagem (Zod)
  - [x] Criar `src/schemas/transaction-schema.ts` definindo `TransactionSchema`
  - [x] Garantir que o schema lide com `income`, `expense`, `transfer` e `adjustment`
- [x] Task 3: Refatoração das Server Actions
  - [x] Atualizar `transaction-actions.ts` para usar `TransactionSchema.parse()` na primeira linha
  - [x] Padronizar retornos para `ActionResponse<Transaction>`
  - [x] Implementar lógica de filtragem de categorias no servidor ou garantir que o banco suporte `category_type` (receita/despesa)
- [x] Task 4: Refatoração da UI (TanStack Query & React Hook Form)
  - [x] Migrar logic de fetching/mutação em `TransactionsPage` para hooks customizados (`use-transactions.ts`)
  - [x] Refatorar `create-transaction-modal.tsx` para usar `react-hook-form` com `zodResolver`
  - [x] Implementar o filtro dinâmico de categorias baseado no campo `type` do formulário
- [x] Task 5: Validação e UX
  - [x] Garantir feedback visual de erro via `ActionResponse`
  - [x] Verificar conformidade WCAG 2.1 AA no formulário

## Dev Notes

- **Filtro de Categorias:** Implementado no lado do cliente dentro do modal, filtrando a lista de categorias baseada no `type` selecionado.
- **TanStack Query:** Implementado com invalidação automática de `transactions` e `accounts` após qualquer mutação.
- **Naming:** Arquivos renomeados para `kebab-case`. Componentes mantidos em `PascalCase`.

### Project Structure Notes

- `src/schemas/transaction-schema.ts`: Validação de entrada centralizada.
- `src/app/actions/transaction-actions.ts`: Lógica de persistência com tipos robustos.
- `src/components/business/transactions/create-transaction-modal.tsx`: Componente de formulário refatorado.
- `src/hooks/use-transactions.ts`: Gerenciamento de estado global via React Query.

### References

- [Architecture Decision Document: Padrões de Nomenclatura](_bmad-output/planning-artifacts/architecture.md#Padrões de Nomenclatura)
- [Architecture Decision Document: Padrões de Formato](_bmad-output/planning-artifacts/architecture.md#Padrões de Formato e Comunicação)
- [PRD: FR06 - Registro de Transações](_bmad-output/planning-artifacts/prd.md#Functional Requirements)

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash

### Debug Log References

- Resolvido erro de tipo no `TransactionsPage` (falta de relações no tipo `Transaction`).
- Resolvido erro do Zod `.partial()` em esquemas com refinamentos dividindo em `BaseSchema` e `Schema`.
- Adicionado `@tanstack/react-query`, `react-hook-form` e `@hookform/resolvers` ao projeto.

### Completion Notes List

- ✅ Refatoração completa para padrões BMAD.
- ✅ Implementação de validação rigorosa com Zod.
- ✅ UI reativa com TanStack Query.
- ✅ Filtro dinâmico de categorias (Income vs Expense).

### File List

- `src/app/actions/transaction-actions.ts`
- `src/schemas/transaction-schema.ts`
- `src/hooks/use-transactions.ts`
- `src/components/business/transactions/create-transaction-modal.tsx`
- `src/app/(app)/transactions/page.tsx`
- `src/app/layout.tsx`
- `src/lib/query-client.ts`
- `src/components/providers/query-provider.tsx`
- `package.json`
