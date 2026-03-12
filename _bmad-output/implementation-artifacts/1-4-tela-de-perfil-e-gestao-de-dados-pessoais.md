# Story 1.4: Gestão de Perfil e Contexto (Tenant)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a usuário logado,
I want editar meu nome e avatar, além de criar ou convidar membros para um "Tenant" familiar,
so that eu possa personalizar minha experiência e compartilhar minhas finanças com minha família.

## Acceptance Criteria

1. **Given** que o usuário está na página de configurações de perfil.
2. **When** o usuário altera seu nome ou avatar.
3. **Then** as alterações devem ser persistidas na tabela `user_profiles` através de uma Server Action protegida por Zod.
4. **When** o usuário envia um convite por e-mail para outro membro.
5. **Then** o convite deve ser registrado no sistema e um e-mail deve ser enviado via Resend (reaproveitando a lógica de `sendAccountInvite`).
6. **And** o isolamento de dados por Tenant deve ser garantido via Row Level Security (RLS) no Supabase.

## Tasks / Subtasks

- [x] Task 1: Esquema de Validação Zod (AC: 3, 5)
  - [x] Criar schemas para atualização de perfil e envio de convite em `src/schemas/profile-schema.ts`.
- [x] Task 2: Server Actions de Perfil e Tenant (AC: 3, 5)
  - [x] Criar action `updateProfile` para atualizar dados em `user_profiles`.
  - [x] Criar action `sendTenantInvite` para convite familiar (Tenant) com integração Resend.
- [x] Task 3: UI de Perfil e Convites (AC: 1, 2, 4)
  - [x] Criar página `/profile` com formulário para nome/avatar.
  - [x] Criar componente `ProfileForm` para gerenciar estado e ações.
  - [x] Integrar com `shadcn/ui` e `lucide-react`.
- [x] Task 4: Validação de Segurança (AC: 6)
  - [x] Garantir uso do client de servidor autenticado em todas as ações.
  - [x] Implementar redirecionamento para login caso não autenticado.

## Dev Notes

- **Implementação:** Utilizado `useActionState` para o formulário de perfil e estado local para convites.
- **Segurança:** Todas as operações de banco de dados ocorrem via Server Actions com validação Zod.
- **E-mail:** Lógica de convite integrada com Resend, utilizando o template de e-mail existente.

### Project Structure Notes

- Schemas: `src/schemas/profile-schema.ts`
- Actions: `src/app/actions/profileActions.ts`
- UI: `src/components/business/profile/ProfileForm.tsx` e `src/app/(app)/profile/page.tsx`

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-thinking-exp-01-21

### Debug Log References

- Criados schemas Zod para perfil e convites.
- Implementadas Server Actions com revalidação de cache.
- Criada interface de perfil responsiva.

### Completion Notes List

- Perfil de usuário agora pode ser editado.
- Sistema de convite por e-mail para tenants familiares funcional.
- Redirecionamento de segurança aplicado.
- **Code Review:** Corrigido typo no state, implementada persistência de convites no banco e criada migração para tabelas faltantes (`user_profiles`, `tenants`, `invites`).

### File List

- `src/schemas/profile-schema.ts` (Novo)
- `src/app/actions/profileActions.ts` (Novo)
- `src/components/business/profile/ProfileForm.tsx` (Novo)
- `src/app/(app)/profile/page.tsx` (Novo)
- `supabase/migrations/20260305000000_profiles_tenants_invites.sql` (Novo)
