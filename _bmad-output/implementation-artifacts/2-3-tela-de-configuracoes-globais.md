# Story 2.3: Tela de Configurações Globais

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a usuário,
I want uma tela central para configurar preferências do sistema (moeda, tema, notificações),
so que o app se comporte conforme meu gosto e objetivos financeiros.

## Acceptance Criteria

1. [x] **Given** a rota `/settings`.
2. [x] **When** o usuário acessa a página de configurações.
3. [x] **Then** deve ver seções claras para: Preferências Visuais (Tema), Preferências de Sistema (Moeda, Idioma) e Metas Financeiras (Reserva Dinâmica).
4. [x] **When** o usuário altera o tema (claro/escuro/sistema).
5. [x] **Then** a alteração deve ser aplicada globalmente e persistida sem recarregamento de página.
6. [x] **When** o usuário define a meta de "Reserva Dinâmica" (ex: 6 meses).
7. [x] **Then** o valor deve ser salvo no `user_profiles` e refletido nos cálculos de progresso da meta.
8. [x] **And** a UI deve usar componentes `shadcn/ui` (Cards, Tabs, Select, Switch) com animações `Framer Motion`.

## Tasks / Subtasks

- [x] Task 1: Infraestrutura de Tema Dinâmico (AC: 4, 5)
  - [x] Instalar `next-themes` (se não estiver presente).
  - [x] Criar `src/components/providers/theme-provider.tsx`.
  - [x] Atualizar `src/app/layout.tsx` para remover `className="dark"` estático e usar o provider.
- [x] Task 2: UI da Tela de Configurações (AC: 1, 2, 3, 8)
  - [x] Criar página em `src/app/(app)/settings/page.tsx`.
  - [x] Implementar seções usando `Card` e `Tabs` para organização.
  - [x] Criar componente `ThemeToggle` ou `ThemeSelect` usando `next-themes`.
- [x] Task 3: Configuração de Metas (Reserva Dinâmica) (AC: 6, 7)
  - [x] Criar Server Action `updateSettings` em `src/app/actions/profileActions.ts` (ou similar).
  - [x] Implementar form para "Meses de Reserva" com validação Zod.
  - [x] Atualizar estado global ou revalidar cache para refletir a nova meta.
- [x] Task 4: Feedback de Sucesso e UX (AC: 5, 8)
  - [x] Adicionar toasts de sucesso após salvar configurações.
  - [x] Garantir transições suaves entre abas de configuração via `Framer Motion`.

## Dev Notes

- **Architecture Pattern:** Seguir o padrão de Server Actions para persistência no Supabase e `next-themes` para controle de tema via `class`.
- **State Management:** Usar `Zustand` para estados de UI efêmeros se necessário, mas persistir configurações críticas no Supabase (`user_profiles`).
- **NFR-P4:** Roteamento e trocas de aba devem ser rápidas (< 300ms).
- **Security (RLS):** Garantir que o usuário só altere suas próprias configurações no `user_profiles`.

### Project Structure Notes

- **Actions:** `src/app/actions/profileActions.ts`
- **Components:** `src/components/business/settings/SettingsForm.tsx`
- **Providers:** `src/components/providers/theme-provider.tsx`
- **Styles:** `src/app/globals.css` (verificar variáveis CSS para light mode).

### References

- [Source: architecture.md#Frontend Architecture] (Uso de shadcn, Next.js App Router, Framer Motion)
- [Source: epics.md#Story 2.3] (Requirements and Acceptance Criteria)
- [Source: prd.md#FR02] (User manages basic profile and preferences)

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash

### Debug Log References

- Análise de `layout.tsx` identificou tema dark hardcoded.
- Verificação de `tailwind.config.ts` confirmou suporte a `darkMode: "class"`.
- Implementado migration `20260311100000_add_settings_to_profiles.sql` para suportar as novas colunas no Supabase.
- Resolvido erro de tipagem no `SettingsForm.tsx` relacionado ao `zodResolver` e generics do `react-hook-form`.
- Corrigido regressão no arquivo de teste de filtragem de transações.

### Completion Notes List

- ✅ Infraestrutura de temas dinâmicos configurada com `next-themes`.
- ✅ Tela de configurações criada com 3 abas: Visual, Sistema e Metas.
- ✅ Server Action `updateSettings` implementada com validação Zod.
- ✅ Suporte a troca de moeda e idioma (estrutura base).
- ✅ Configuração de Reserva Dinâmica (meses) persistida no perfil do usuário.
- ✅ Feedback visual com `sonner` e animações com `Framer Motion`.
- ✅ Testes unitários para o schema de configurações criados e passando.

### File List

- `src/components/providers/theme-provider.tsx` (Novo)
- `src/app/layout.tsx` (Modificado)
- `src/app/(app)/settings/page.tsx` (Modificado - Placeholder anterior atualizado)
- `src/components/business/settings/SettingsForm.tsx` (Novo)
- `src/components/business/settings/ThemeToggle.tsx` (Novo)
- `src/app/actions/profileActions.ts` (Modificado)
- `src/schemas/profile-schema.ts` (Modificado)
- `src/schemas/profile-settings.test.ts` (Novo)
- `src/app/actions/transaction-filtering.test.ts` (Modificado - Fix)
- `src/app/actions/transaction-actions.ts` (Modificado - Type Fix)
- `src/app/actions/authActions.ts` (Modificado - Auto-profile creation)
- `src/types/actions.ts` (Modificado - Type Fix)
- `src/components/ui/Navbar.tsx` (Modificado - Legado)
- `src/components/ui/card.tsx` (Novo - shadcn)
- `src/components/ui/form.tsx` (Novo - shadcn)
- `src/components/ui/label.tsx` (Novo - shadcn)
- `src/components/ui/select.tsx` (Novo - shadcn)
- `src/components/ui/sonner.tsx` (Novo - shadcn)
- `src/components/ui/switch.tsx` (Novo - shadcn)
- `src/components/ui/tabs.tsx` (Novo - shadcn)
- `package.json` (Modificado)
- `pnpm-lock.yaml` (Modificado)
- `supabase/migrations/20260311100000_add_settings_to_profiles.sql` (Novo)
- `supabase/migrations/20260312100000_add_profile_insert_policy.sql` (Novo)

## Senior Developer Review (AI)

### Outcome: Approved (after fixes)

### Review Notes
- **AC 5 Validation:** Fixed issue where global settings (currency, language) wouldn't reflect changes across the app without reload. Added `revalidatePath("/", "layout")` to `updateSettings` and `updateProfile`.
- **Naming:** Renamed `ThemeSelect` to `ThemeToggle` for better consistency with the file name.
- **Security:** Updated Server Actions to explicitly pick fields for update instead of passing the whole object to the database.
- **Documentation:** Added missing files to the File List (authActions, migrations).

## Change Log

- 2026-03-12: Implementação inicial da tela de configurações e infraestrutura de temas.
- 2026-03-12: Correção de erros de lint e tipos. Finalização da story e envio para review.
- 2026-03-12: Processado Code Review Adversário. Aplicadas melhorias de revalidação global e segurança nas Server Actions. Renomeado componente de tema para consistência.
