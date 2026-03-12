# Story 1.3: Confirmação de Identidade e Redirecionamento Protegido

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a usuário aguardando validação,
I want inserir o código OTP recebido,
so that o sistema valide minha sessão e me direcione para o Dashboard privado.

## Acceptance Criteria

1. **Given** que o usuário recebeu o código OTP.
2. **When** o usuário insere o código correto e submete.
3. **Then** a sessão deve ser criada via cookies (SSR) e o usuário deve ser redirecionado para `/dashboard`.
4. **And** se o código for inválido, uma mensagem de erro amigável deve ser exibida.
5. **And** a verificação deve ocorrer no lado do servidor via Server Action protegida por Zod.

## Tasks / Subtasks

- [x] Task 1: UI de Verificação OTP (AC: 1, 2)
  - [x] Criar componente de formulário para inserção do código de 6 dígitos (usar InputOTP do shadcn se disponível ou input padrão).
  - [x] Implementar estado de carregamento e exibição de mensagens de erro.
- [x] Task 2: Server Action de Verificação (AC: 3, 5)
  - [x] Criar action `verifyOtp` em `src/actions/auth.ts`.
  - [x] Implementar validação Zod para e-mail e token.
  - [x] Invocar `supabase.auth.verifyOtp` usando o client de servidor.
  - [x] Retornar objeto `ActionResponse` padronizado.
- [x] Task 3: Lógica de Redirecionamento e Sessão (AC: 3)
  - [x] Garantir que o middleware do Supabase capture a nova sessão.
  - [x] Redirecionar para `/dashboard` após sucesso.
- [x] Task 4: Tratamento de Erros (AC: 4)
  - [x] Capturar erros do Supabase (ex: código expirado, inválido) e mapear para mensagens amigáveis em português.

## Dev Notes

- **Autenticação SSR:** Refatorado para usar Server Actions (`signInWithOtp` e `verifyOtp`) para maior segurança e conformidade com o padrão do projeto.
- **Zod:** Implementada validação rigorosa para e-mail e token de 6 dígitos.
- **Redirect:** Mantida a lógica de `redirect_to` via URL search params.

### Project Structure Notes

- As ações de autenticação foram colocadas em `src/app/actions/authActions.ts` (mantendo o padrão de outras ações no projeto).
- O componente `OtpForm.tsx` foi atualizado para invocar as Server Actions.

### References

- [Architecture Decision Document: Padrões de Formato e Comunicação](_bmad-output/planning-artifacts/architecture.md#Padrões de Formato e Comunicação (Format & Communication Patterns))

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-thinking-exp-01-21

### Debug Log References

- Criada a Server Action `verifyOtp` com Zod.
- Refatorado `OtpForm` de Client-side Auth para Server Actions.
- Validada a lógica de redirecionamento.

### Completion Notes List

- Implementação completa da verificação OTP.
- Garantida a segurança via SSR e Zod.
- Redirecionamento para dashboard funcionando conforme AC3.
- **Code Review:** Melhorada a experiência de loading no redirect e logs de erro no server.

### File List

- `src/app/actions/authActions.ts` (Novo)
- `src/components/auth/OtpForm.tsx` (Modificado)
