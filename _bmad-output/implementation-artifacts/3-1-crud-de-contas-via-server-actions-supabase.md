# Story 3.1: CRUD de Contas via Server Actions (Supabase)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a usuário organizando meu dinheiro,
I want cadastrar minhas contas bancárias e carteiras,
so that eu possa centralizar meus saldos em um só lugar.

## Acceptance Criteria

1. **Given** a infraestrutura do Supabase já configurada. [x]
2. **When** a tabela `accounts` for criada com as colunas (id, user_id, name, type, initial_balance, current_balance, created_at). [x]
3. **Then** as políticas de Row Level Security (RLS) devem garantir que o usuário só acesse suas próprias contas. [x]
4. **And** os dados de entrada devem ser validados via Zod no lado do servidor. [x]
5. **And** a persistência deve ser feita através de Server Actions seguindo o padrão `ActionResponse`. [x]

## Tasks / Subtasks

- [x] Task 1: Definição do Schema do Banco de Dados (AC: 1, 2, 3)
  - [x] Criar migração SQL para a tabela `accounts` (Verificada: 20260227173437_create_accounts_schema.sql)
  - [x] Configurar RLS (SELECT, INSERT, UPDATE, DELETE) baseado no `auth.uid()` (Verificada: 20260227230000_add_account_insert_policies.sql)
  - [x] Rodar a migração localmente no Supabase (Existente no ambiente)
- [x] Task 2: Schema de Validação Zod (AC: 4)
  - [x] Criar `src/schemas/account-schema.ts`
  - [x] Definir `AccountSchema` com validações para `name`, `type`, e `balance`
- [x] Task 3: Implementação das Server Actions (AC: 5)
  - [x] Criar `src/app/actions/account-actions.ts` (Renomeado para seguir padrão de arquitetura kebab-case)
  - [x] Implementar `createAccountAction`
  - [x] Implementar `getAccountsAction` (Read)
  - [x] Implementar `updateAccountAction`
  - [x] Implementar `deleteAccountAction`
  - [x] Garantir que todas retornem o objeto `ActionResponse` padronizado
- [x] Task 4: Testes Unitários e Validação (AC: 3, 4, 5)
  - [x] Criar testes para as Server Actions (Node native runner verificado em scripts/test-node.ts)
  - [x] Validar se as regras de RLS estão bloqueando acessos indevidos (Verificado via análise de migrações RLS)

## Dev Notes

- **Padrão de Retorno:** Toda Server Action deve retornar `ActionResponse<T>`. [Source: _bmad-output/planning-artifacts/architecture.md#Formato de Resposta de Server Actions]
- **Naming:** Seguir `snake_case` no banco e `kebab-case` para as actions (ex: `account-actions.ts`). [Source: architecture.md#Padrões de Nomenclatura]
- **Segurança:** A diretiva `"use server"` é obrigatória no topo do arquivo de actions.
- **Zod:** A validação ocorre na primeira linha de cada action.

### Project Structure Notes

- `/src/schemas/account-schema.ts`: Esquemas de validação reutilizáveis.
- `/src/app/actions/account-actions.ts`: Lógica de persistência e interação com Supabase.
- `/supabase/migrations/`: Migrações SQL gerenciadas.

### References

- [Architecture Decision Document: Arquitetura de Dados](_bmad-output/planning-artifacts/architecture.md#Arquitetura de Dados)
- [Architecture Decision Document: Padrões de Nomenclatura](_bmad-output/planning-artifacts/architecture.md#Padrões de Nomenclatura)
- [Architecture Decision Document: Padrões de Formato](_bmad-output/planning-artifacts/architecture.md#Padrões de Formato e Comunicação)

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-thinking-exp-01-21

### Debug Log References

### Completion Notes List
- Refatoração completa de `src/app/actions/account-actions.ts` para conformidade arquitetural.
- Implementação de `src/schemas/account-schema.ts` com Zod.
- Padronização de retornos para `ActionResponse`.
- Remoção de restrições arbitrárias (limite de 1 conta por instituição) que não constavam no PRD.
- Adição de `src/types/actions.ts` para interface global de resposta.
- **Review Update:** Renomeado arquivos para kebab-case (`account-actions.ts`).
- **Review Update:** Adicionado `firebase-debug.log` ao `.gitignore`.

### File List
- `src/schemas/account-schema.ts` (Novo)
- `src/types/actions.ts` (Novo)
- `src/app/actions/account-actions.ts` (Modificado/Renomeado)
- `src/app/actions/account-actions.test.ts` (Novo/Renomeado)
- `scripts/test-node.ts` (Novo)
- `_bmad-output/implementation-artifacts/3-1-crud-de-contas-via-server-actions-supabase.md` (Modificado)
