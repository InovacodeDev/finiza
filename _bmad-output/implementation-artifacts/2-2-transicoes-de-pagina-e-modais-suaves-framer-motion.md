# Story 2.2: Transições de Página e Modais Suaves (Framer Motion)

**ID:** 2.2
**Epic:** 2 - App Shell, Navegação e Experiência PWA
**Status:** done
**Priority:** Medium
**Generated:** 2026-03-09

## 📝 User Story
**As a** usuário interagindo com o app,
**I want** ver animações fluidas ao abrir modais e trocar de página,
**So that** a experiência pareça premium e sem "flashes" cognitivos (Zero Layout Shift).

## ✅ Acceptance Criteria (BDD)

### Scenario: Transições de Página
*   [x] **Given** o uso de `Framer Motion`.
**When** o usuário clica em um link de navegação para mudar de rota.
**Then** a transição deve ocorrer com um efeito de fade/slide suave (ex: `opacity` e pequeno `y` offset).
**And** a transição de página deve durar entre 200ms e 300ms.

### Scenario: Modais e Dialogs
*   [x] **Given** um componente de Modal/Dialog (`shadcn/ui`).
**When** o modal é aberto ou fechado.
**Then** ele deve animar suavemente (ex: `scale` de 0.95 para 1 e `opacity`).
**And** o feedback de interação (abertura) deve ocorrer em menos de 100ms.

### Scenario: Performance e Acessibilidade
*   [x] **Given** as NFRs de performance.
**When** as animações são executadas.
**Then** elas não devem causar quedas de frame (60fps) nem Layout Shift (CLS).
**And** deve-se respeitar a preferência de sistema `prefers-reduced-motion`.

## 🏗️ Technical Requirements & Guardrails

### 1. Architecture Compliance (Critical)
*   **Framework:** Next.js 15+ App Router.
**Animation Engine:** `Framer Motion` (v12).
**Page Transition Pattern:** Use `app/template.tsx` for consistent entry/exit animations on navigation (App Router best practice).
**Hardware Acceleration:** Use `willChange: "transform, opacity"` for all animated elements to ensure GPU rendering.
**Performance Target:** Total navigation transition time < 300ms.

### 2. Implementation Details (Step-by-Step)
*   **Refine Page Transitions:** Update/Implement `src/app/(app)/template.tsx` (or refine `TransitionProvider.tsx` if it's currently used in `layout.tsx`).
    - **Note:** `layout.tsx` persists across navigations, while `template.tsx` re-mounts. For transitions, `template.tsx` is preferred.
    - Animation: `initial: { opacity: 0, y: 10 }`, `animate: { opacity: 1, y: 0 }`, `exit: { opacity: 0, y: -10 }`.
*   **Global Modal Animations:** Wrap `shadcn/ui` Dialog/Sheet components with `motion` and `AnimatePresence` where missing.
    - Use `type: "spring", bounce: 0, duration: 0.3` for a natural, snappy feel.
*   **List Staggering (Optional but Recommended):** In pages with lists (Accounts/Transactions), use Variants with `staggerChildren: 0.05` for a premium entrance effect.

### 3. File Structure
*   `src/app/template.tsx` (Root Transition)
*   `src/components/ui/TransitionProvider.tsx` (AnimatePresence provider)
*   `src/components/ui/*.tsx` (Modal updates)

### 4. Performance & UX
*   **GPU Properties only:** Animate `transform` (x, y, scale) and `opacity`. NEVER animate `height`, `margin`, or `padding` as they trigger expensive layout recalculations.
*   **AnimatePresence:** Ensure `mode="wait"` is used in the root transition to prevent overlapping pages.

## 💡 Previous Story Intelligence (Learnings from 2.1)
*   **Context:** Story 2.1 established the `AppSidebar` with an active indicator using `layoutId`.
*   **Pattern:** Re-use `motion` patterns established in the sidebar for consistency.

## 🌐 External Context (Latest Patterns)
*   **Motion v12:** The transition to `Motion` (v12) emphasizes `willChange` for performance.
*   **Next.js Templates:** Using `template.tsx` ensures that animations trigger on every navigation, even between pages that share the same layout.

## 🚀 Execution Guardrail
> **STOP:** Do not use heavy `layout` animations unless absolutely necessary. Stick to `x`, `y`, `opacity`, and `scale` to maintain 60fps on mobile devices.

## 🛠️ Tasks / Subtasks
- [x] Task 1: Refactor Page Transitions (`src/app/template.tsx`)
  - [x] Consolidate into root `template.tsx` to avoid double-animations.
  - [x] Implement `AnimatePresence` with `mode="wait"` in `TransitionProvider`.
  - [x] Add `motion.div` with initial/animate/exit states.
  - [x] Apply `willChange` for optimization.
- [x] Task 2: Enhance Modal Animations
  - [x] Integrate Framer Motion into `ConfirmModal`, `CreateAccountModal`, `CreateCreditCardModal`, `CreateTransactionModal`, and `AccountSlideOver`.
  - [x] Implement scale and opacity animations.
- [x] Task 3: Accessibility Support
  - [x] Implemented `useReducedMotion` across all animated components to disable motion-heavy effects for sensitive users.

## 🤖 Dev Agent Record

### Implementation Plan
- **Step 1:** Implement root `src/app/template.tsx` with accessibility hooks.
- **Step 2:** Refactor `src/components/ui/TransitionProvider.tsx` for root-level `AnimatePresence`.
- **Step 3:** Update all primary modals with hardware-accelerated animations and `willChange` optimizations.
- **Step 4:** Consolidate templates to prevent visual glitches.

### Debug Log
- 2026-03-09: Initial implementation complete.
- 2026-03-09: Code review identified double-animation conflict and missing accessibility hooks.
- 2026-03-09: Redundant `(app)/template.tsx` removed.
- 2026-03-09: `useReducedMotion` and `willChange` applied to all components.

### Completion Notes
- Story 2.2 implementation complete and refined via code review.
- UX is smooth, performance-optimized, and accessible.

## 📂 File List
- `src/app/template.tsx` (New)
- `src/components/ui/TransitionProvider.tsx` (Update)
- `src/components/ui/ConfirmModal.tsx` (Update)
- `src/components/ui/CreateAccountModal.tsx` (Update)
- `src/components/ui/CreateCreditCardModal.tsx` (Update)
- `src/components/ui/CreateTransactionModal.tsx` (Update)
- `src/components/ui/AccountSlideOver.tsx` (Update)

## 📜 Change Log
- 2026-03-09: Initial implementation started.
- 2026-03-09: Code review completed and fixes applied. Marked as done.

---
**Status Note:** Story complete.
