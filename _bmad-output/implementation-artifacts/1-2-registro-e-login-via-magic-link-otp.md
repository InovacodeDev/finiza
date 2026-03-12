# Story 1.2: Registro e Login via Magic Link/OTP

**ID:** 1.2
**Epic:** 1 - Fundação, Autenticação e Onboarding Seguro
**Status:** ready-for-dev
**Priority:** High
**Generated:** 2026-03-09

## 📝 User Story
**As a** usuário novo ou recorrente,
**I want** inserir meu e-mail para receber um código de acesso único (OTP),
**So that** eu possa acessar o aplicativo de forma ágil e segura sem precisar de senha.

## ✅ Acceptance Criteria (BDD)

### Scenario: Solicitando Código de Acesso (OTP)
*   **Given** que o usuário está na página de login.
**When** o usuário insere um e-mail válido e clica em "Enviar Código".
**Then** o sistema deve invocar o `supabase.auth.signInWithOtp` para enviar o OTP.
**And** a interface deve exibir o campo de entrada para o código de 6 dígitos.

### Scenario: Validação de E-mail
*   **Given** o campo de e-mail.
**When** o usuário insere um formato inválido (ex: "user@com").
**Then** o sistema deve impedir o envio e exibir um erro de validação (Zod).

## 🏗️ Technical Requirements & Guardrails

### 1. Architecture Compliance (Critical)
*   **Framework:** Next.js 15+ App Router.
**Auth Strategy:** Supabase Auth with `@supabase/ssr` (Cookie-based auth).
**Data Access:** Use **Server Actions** (`"use server"`) for both sending and verifying OTP.
**Validation:** Mandatory use of **Zod** for email validation before calling Supabase.
**Action Response:** All Server Actions MUST return the standardized `ActionResponse<T>` interface:
    ```typescript
    interface ActionResponse<T> {
      success: boolean;
      data?: T;
      error?: string;
    }
    ```

### 2. Implementation Details (Step-by-Step)
*   **Send OTP Action:** Create `src/actions/auth.ts` with `signInWithEmail`.
    - Use `supabase.auth.signInWithOtp({ email })`.
    - Handle PKCE flow appropriately.
*   **UI Component:** Implement `LoginForm.tsx` in `src/components/business/auth/`.
    - Use `shadcn/ui` components (`Input`, `Button`, `Form`).
    - Use `react-hook-form` + `@hookform/resolvers/zod`.
    - State management for toggling between "Enter Email" and "Enter Code" views.
*   **UX/Feedback:**
    - Show a loading spinner on the button during the request.
    - Provide a "Resend Code" option (with a 60s cooldown if possible).
    - Use `sonner` or `toast` for error/success notifications.

### 3. File Structure
*   `src/actions/auth.ts` - Server Actions for Auth.
*   `src/schemas/auth-schema.ts` - Zod schemas for email and OTP validation.
*   `src/components/business/auth/LoginForm.tsx` - Main login component.
*   `src/app/(auth)/login/page.tsx` - Login page route.

### 4. Security & Best Practices
*   **Do NOT** expose Supabase Service Role Key to the client.
*   **Do NOT** use `localStorage` for sessions (use `cookies` via `@supabase/ssr`).
*   Ensure RLS is configured in Supabase (though this story is primarily Auth-focused).

## 💡 Previous Story Intelligence (Learnings from 1.1)
*   **Context:** Story 1.1 initialized the project using the `with-supabase` template.
*   **Pattern:** Use the existing `src/lib/supabase/server.ts` to instantiate the server client inside actions.
*   **Convention:** Follow the established `snake_case` for DB and `PascalCase` for components.

## 🌐 External Context (Latest Patterns)
*   **Supabase OTP:** For 6-digit codes, ensure the email template in Supabase Dashboard uses `{{ .Token }}` instead of `{{ .ConfirmationURL }}`.
*   **Verification:** Use `supabase.auth.verifyOtp({ email, token, type: 'email' })` in the subsequent story (1.3), but the logic for *requesting* it starts here.

## 🚀 Execution Guardrail
> **STOP:** If you find yourself trying to use Password-based auth, REVERT. This project is strictly Magic Link/OTP as per PRD.

---
**Status Note:** Ultimate context engine analysis completed - comprehensive developer guide created.
