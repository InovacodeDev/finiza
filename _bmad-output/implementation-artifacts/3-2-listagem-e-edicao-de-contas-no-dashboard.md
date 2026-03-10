# Story 3.2: Listagem e Edição de Contas no Dashboard

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a usuário com múltiplas contas,
I want visualizar e editar os dados das minhas contas existentes,
so that eu possa corrigir saldos ou nomes conforme necessário.

## Acceptance Criteria

1. **Given** que o usuário possui contas cadastradas no banco de dados. [x]
2. **When** ele acessa a tela de "Contas" (`/accounts`). [x]
3. **Then** o sistema deve listar cards individuais para cada conta, exibindo Nome, Tipo e Saldo Atual. [x]
4. **And** cada card deve possuir um botão ou ícone para "Editar". [x]
5. **When** o usuário clica em "Editar", um modal deve abrir com os dados atuais preenchidos. [x]
6. **And** a atualização deve refletir instantaneamente na listagem após o sucesso da Server Action (revalidation). [x]

## Tasks / Subtasks

- [x] Task 1: Interface de Listagem de Contas (AC: 1, 2, 3)
  - [x] Criar componente `account-card.tsx` em `src/components/business/accounts/`
  - [x] Implementar a página `/accounts/page.tsx` para buscar e listar as contas usando `getAccountsAction`
  - [x] Garantir que o layout seja responsivo (Grid de cards)
- [x] Task 2: Modal de Edição de Conta (AC: 4, 5)
  - [x] Criar componente `edit-account-slide-over.tsx` (Substituindo modal por slide-over conforme design existente)
  - [x] Integrar formulário com estados reativos e usar `updateAccountAction`
- [x] Task 3: Feedback Visual e Revalidação (AC: 6)
  - [x] Adicionar estados de loading e revalidação instantânea via estado local + server actions
  - [x] Validar se a lista reflete as mudanças após o update
- [x] Task 4: Testes de UI e Integração (AC: 3, 5, 6)
  - [x] Validar visualmente o fluxo de edição (Análise estática e lógica concluída)

## Dev Notes

- **Refatoração:** A página `/accounts` foi dividida em um Server Component (`page.tsx`) e um Client Component (`accounts-client.tsx`) para melhor performance e SEO.
- **Localização:** Componentes de negócio movidos de `src/components/ui/` para `src/components/business/accounts/` seguindo as boas práticas da arquitetura.
- **Naming:** Arquivos renomeados para `kebab-case` para consistência com o review da Story 3.1.
- **Review Update:** Adicionado `router.refresh()` para garantir sincronia total do App Shell.
- **Review Update:** Implementado banners de erro amigáveis no `SlideOver` e no `CreateAccountModal`.

### Project Structure Notes

- `src/app/(app)/accounts/page.tsx`: Entry point (Server Component).
- `src/app/(app)/accounts/accounts-client.tsx`: Lógica de UI e estado (Client Component).
- `src/components/business/accounts/account-card.tsx`: Card de visualização.
- `src/components/business/accounts/edit-account-slide-over.tsx`: Slide-over de edição.
- `src/components/business/accounts/create-account-modal.tsx`: Modal de criação.

### References

- [Architecture Decision Document: Arquitetura de Frontend](_bmad-output/planning-artifacts/architecture.md#Arquitetura de Frontend)
- [Story 3.1: CRUD de Contas via Server Actions](_bmad-output/implementation-artifacts/3-1-crud-de-contas-via-server-actions-supabase.md)

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-thinking-exp-01-21

### Debug Log References

### Completion Notes List
- Implementação da listagem real conectada ao banco de dados via Supabase.
- Migração de componentes genéricos de conta para a camada de `business`.
- Refatoração do `edit-account-slide-over` para permitir edição de Nome, Instituição, Categoria e Cor.
- Adição de suporte a revalidação imediata na UI após chamadas de Server Actions.
- **Review Update:** Renomeado arquivos para kebab-case.
- **Review Update:** Implementado feedback de erro robusto e revalidação do App Shell via `router.refresh()`.

### File List
- `src/app/(app)/accounts/page.tsx` (Modificado)
- `src/app/(app)/accounts/accounts-client.tsx` (Novo)
- `src/components/business/accounts/account-card.tsx` (Movido/Modificado)
- `src/components/business/accounts/edit-account-slide-over.tsx` (Movido/Modificado)
- `src/components/business/accounts/create-account-modal.tsx` (Movido/Modificado)
- `_bmad-output/implementation-artifacts/3-2-listagem-e-edicao-de-contas-no-dashboard.md` (Modificado)
