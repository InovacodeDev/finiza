# Story 2.1: Estrutura de Layout e Navegação Lateral (Sidebar)

**ID:** 2.1
**Epic:** 2 - App Shell, Navegação e Experiência PWA
**Status:** done
**Priority:** High
**Generated:** 2026-03-09

## 📝 User Story
**As a** usuário logado,
**I want** ver um menu de navegação lateral e um cabeçalho fixo,
**So that** eu possa transitar entre as telas de Dashboard, Contas e Transações de forma intuitiva.

## ✅ Acceptance Criteria (BDD)

### Scenario: Navegação Lateral (Sidebar)
*   **Given** que o usuário está autenticado e em qualquer página interna (`/app/*`).
**When** a página é carregada.
**Then** a Sidebar deve exibir links para as rotas: Dashboard (`/dashboard`), Contas (`/accounts`), Transações (`/transactions`).
**And** o link da rota atual deve estar visualmente destacado com um indicador animado (Framer Motion).
**And** a Sidebar deve ser colapsável (modo ícone) para economizar espaço se solicitado ou em telas menores.

### Scenario: Cabeçalho Fixo (Header)
*   **Given** o topo da página.
**When** o usuário navega pela aplicação.
**Then** um Header fixo deve exibir o título da seção atual e o resumo do perfil do usuário (Avatar/Nome).
**And** deve haver um botão de toggle para a Sidebar em dispositivos móveis.

### Scenario: Responsividade Mobile
*   **Given** um dispositivo móvel.
**When** o usuário acessa o app.
**Then** a Sidebar deve ficar oculta por padrão (ou em modo Sheet/Drawer).
**And** a navegação deve ser acessível via ícone de "hambúrguer" no Header.

## 🏗️ Technical Requirements & Guardrails

### 1. Architecture Compliance (Critical)
*   **Framework:** Next.js 15+ App Router.
**UI Library:** `shadcn/ui` Sidebar component (already partially installed in `src/components/ui/sidebar.tsx`).
**Icons:** `lucide-react`.
**Animations:** `framer-motion` for smooth transitions and active indicators.
**State Management:** Use `SidebarProvider` from `shadcn/ui`.
**Data Fetching:** Header must fetch user profile data using `src/app/actions/profileActions.ts` (implemented in Story 1.4).

### 2. Implementation Details (Step-by-Step)
*   **Refine Sidebar:** Update `src/components/app-sidebar.tsx` (already exists).
    - Ensure `MENU_ITEMS` match the PRD/Epic requirements.
    - Validate the `motion.div` active indicator logic.
*   **Create Header Component:** Implement `src/components/layout/Header.tsx`.
    - Should include `SidebarTrigger` (from shadcn).
    - Display current page title (can be derived from `usePathname`).
    - Display user profile (fetch via Server Component or Action).
*   **Update App Layout:** Modify `src/app/(app)/layout.tsx`.
    - Integrate the new `Header`.
    - Ensure `SidebarInset` is correctly configured for spacing.
    - Fix the hardcoded `pt-32` padding to be dynamic or adjusted for the new Header height.

### 3. File Structure
*   `src/components/app-sidebar.tsx` (Update)
*   `src/components/layout/Header.tsx` (New)
*   `src/app/(app)/layout.tsx` (Update)

### 4. Performance & UX
*   **Transition speed:** Page transitions and sidebar toggles should feel instantaneous (< 300ms).
*   **Layout Shift:** Ensure the sidebar state (collapsed/expanded) is persisted or handled to avoid CLS (Cumulative Layout Shift).

## 💡 Previous Story Intelligence (Learnings from 1.4)
*   **User Data:** User profile data is stored in the `user_profiles` table. Use the `getUserProfile` pattern (if it exists) or call the Supabase server client directly in the Header (if it's a Server Component).
*   **Tenant Context:** The Header should eventually show the current Tenant name (e.g., "Família Silva").

## 🌐 External Context (Latest Patterns)
*   **shadcn/ui Sidebar:** The latest `sidebar.tsx` component from shadcn is highly composable. Use `SidebarTrigger`, `SidebarInset`, and `SidebarProvider` to manage the complex layout logic.
*   **PWA Shell:** The App Shell (Header + Sidebar) should be statically rendered or cached where possible to support the "Instant Loading" feel of a PWA.

## 🚀 Execution Guardrail
> **STOP:** Do not reinvent the sidebar. Use the existing `src/components/ui/sidebar.tsx` and `src/components/app-sidebar.tsx`. Focus on integration and the missing Header component.

## 🛠️ Tasks / Subtasks
- [x] Task 1: Refine Sidebar (`src/components/app-sidebar.tsx`)
  - [x] Update `MENU_ITEMS` to match PRD requirements
  - [x] Validate/Fix `motion.div` active indicator logic
- [x] Task 2: Create Header Component (`src/components/layout/Header.tsx`)
  - [x] Add `SidebarTrigger`
  - [x] Derive current page title from pathname
  - [x] Fetch and display user profile (Avatar/Name)
- [x] Task 3: Update App Layout (`src/app/(app)/layout.tsx`)
  - [x] Integrate the new `Header`
  - [x] Configure `SidebarInset` correctly
  - [x] Adjust padding for the new Header height

## 🤖 Dev Agent Record

### Implementation Plan
- **Step 1:** Modify `src/components/app-sidebar.tsx` to align menu items and fix any animation issues.
- **Step 2:** Develop the `Header` component in `src/components/layout/Header.tsx`, including user profile fetching.
- **Step 3:** Integrate everything into the main layout `src/app/(app)/layout.tsx`.

### Debug Log
- 2026-03-09: Initial start. Marked story as in-progress.
- 2026-03-09: Implemented `getUserProfile` in `profileActions.ts`.
- 2026-03-09: Created `src/components/layout/Header.tsx` with sidebar trigger and profile menu.
- 2026-03-09: Updated `src/app/(app)/layout.tsx` to include `Header` and fix layout structure.
- 2026-03-09: Refined `src/components/app-sidebar.tsx` with better branding and structure.

### Completion Notes
- Story 2.1 implementation complete and reviewed.
- Sidebar refined with branding and clear menu items.
- Header component added with breadcrumb-like title and user profile menu.
- App layout updated to use the new Header and provide a consistent shell.
- User profile fetching integrated into the Header with proper type safety (`UserProfile` interface).
- **Code Review Fixes:**
  - Optimized `getUserProfile` to avoid over-fetching (selecting only necessary fields).
  - Implemented proper TypeScript interfaces for user profile data.
  - Added error handling to the logout flow.
  - Improved environment variable handling for base URLs.

## 📂 File List
- `src/components/app-sidebar.tsx` (Update)
- `src/components/layout/Header.tsx` (New)
- `src/app/(app)/layout.tsx` (Update)
- `src/app/actions/profileActions.ts` (Update)

## 📜 Change Log
- 2026-03-09: Initial implementation started.
- 2026-03-09: Implementation complete.
- 2026-03-09: Code review completed. Addressed type safety, data fetching optimization, and error handling issues. Marked as done.

---
**Status Note:** Story complete.
