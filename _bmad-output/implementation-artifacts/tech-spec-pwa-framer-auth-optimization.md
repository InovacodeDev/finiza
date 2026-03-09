---
title: 'PWA/Framer Optimization (Zero Layout Shift)'
slug: 'pwa-framer-auth-optimization'
created: '2026-03-06'
status: 'ready-for-dev'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['Next.js (v16?)', 'next-pwa', 'Framer Motion (v12)', 'Tailwind CSS (v4)']
files_to_modify: ['package.json', 'next.config.mjs', 'src/app/layout.tsx', 'src/app/sw.ts', 'src/app/manifest.ts']
code_patterns: ['Next.js App Router', 'Framer Motion (AnimatePresence)', 'PWA (next-pwa)']
test_patterns: ['Manual PWA Verification', 'Lighthouse LCP Audit']
---

# Tech-Spec: PWA/Framer Optimization (Zero Layout Shift)

**Created:** 2026-03-06

## Overview

### Problem Statement

The project currently uses Serwist for PWA features, but the requirement is to switch to `next-pwa`. Additionally, smooth page transitions are needed to improve UX, especially during Auth redirects, without compromising LCP (Largest Contentful Paint) or causing layout shifts.

### Solution

Replace the `serwist` dependency with `next-pwa`, configure the service worker and web manifest, and wrap the root layout with Framer Motion's `AnimatePresence` to handle page transitions gracefully.

### Scope

**In Scope:**
- Uninstall `serwist` and install `next-pwa`.
- Configure `next.config.mjs` for `next-pwa`.
- Update `src/app/sw.ts` (if needed) or let `next-pwa` handle it.
- Implement page transitions in `src/app/layout.tsx` using `Framer Motion`.
- Validate LCP on the Auth redirect path.

**Out of Scope:**
- Creating new UI components (except for necessary loading wrappers).
- Modifying backend Auth logic.
- Performance optimizations unrelated to PWA/Framer Motion.

## Context for Development

### Codebase Patterns

- **Next.js App Router**: Standard layouts and pages structure.
- **Framer Motion**: Extensively used in components (`Navbar`, `ConfirmModal`, `HeroSection`). Not yet used in `layout.tsx` for page transitions.
- **Tailwind CSS (v4)**: Modern Tailwind used for styling.
- **Confirmed Clean Slate**: No existing testing framework found (`package.json` lacks test script, no `tests` folder).

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `next.config.mjs` | Serwist configuration to be replaced. |
| `package.json` | Dependencies list. |
| `src/app/layout.tsx` | Main layout for adding transitions. |
| `src/app/sw.ts` | Serwist worker configuration to be replaced. |
| `src/app/manifest.ts` | Standard Next.js manifest generation. |

### Technical Decisions

- **next-pwa over Serwist**: Requested by the user for this specific implementation.
- **AnimatePresence**: For managing entry/exit animations of page content in `RootLayout`.
- **Zero Layout Shift**: Avoid centering `main` in `layout.tsx` if it conflicts with content layout on specific pages.

## Implementation Plan

### Tasks

- [ ] **Task 1: Migration to next-pwa**
  - **File:** `package.json`, `next.config.mjs`
  - **Action:** Uninstall `@serwist/next` and `serwist`. Install `next-pwa`. Update `next.config.mjs` to use `withPWA` instead of `withSerwistInit`.
  - **Notes:** Ensure `dest: "public"`, `register: true`, `skipWaiting: true` are configured in `withPWA`.

- [ ] **Task 2: PWA Service Worker & Manifest Cleanup**
  - **File:** `src/app/sw.ts`, `src/app/manifest.ts`
  - **Action:** Remove `serwist` specific logic from `sw.ts`. If using `next-pwa`'s default SW, `sw.ts` can be deleted. Ensure `manifest.ts` remains consistent with PWA requirements (icons, theme_color, display: standalone).
  - **Notes:** `next-pwa` typically auto-generates the service worker unless a custom one is specified.

- [ ] **Task 3: Implement Page Transitions**
  - **File:** `src/app/layout.tsx`
  - **Action:** Wrap the `{children}` in `RootLayout` with `<AnimatePresence mode="wait">` and a `<motion.div>`.
  - **Notes:** Use a simple fade-in/out animation (opacity: 0 -> 1) to ensure zero layout shift. Ensure `key` for `motion.div` is correctly handled (may need a way to track the current path).

- [ ] **Task 4: Optimize Auth Load LCP**
  - **File:** `src/app/layout.tsx`, `src/middleware.ts`
  - **Action:** Ensure the `Navbar` and `main` wrapper do not cause shift while Auth state is being resolved. Add a lightweight loading state if necessary.
  - **Notes:** Verify LCP using Chrome DevTools Performance tab during the Auth redirect flow.

### Acceptance Criteria

- [ ] **AC 1: PWA Installability**
  - **Given** a user opens the app in a PWA-compliant browser, **when** they look at the address bar or menu, **then** they should see the option to "Install Finiza".
- [ ] **AC 2: Smooth Page Transitions**
  - **Given** a user is logged in, **when** they navigate between Dashboard and Profile, **then** the content should fade in/out smoothly without abrupt jumps.
- [ ] **AC 3: LCP Compliance**
  - **Given** an unauthenticated user attempts to access `/dashboard`, **when** they are redirected to `/auth`, **then** the LCP (Largest Contentful Paint) should be less than 2.5 seconds.
- [ ] **AC 4: Offline Functionality**
  - **Given** the app was previously loaded and cached, **when** the user goes offline and reloads the app, **then** the basic shell and cached pages should still be accessible.

## Additional Context

### Dependencies

- `next-pwa`: For PWA features.
- `framer-motion`: For animations (already installed).

### Testing Strategy

- **Manual Testing:** Navigation between all major routes to check for layout shifts.
- **PWA Audit:** Run Lighthouse PWA audit to ensure all criteria are met.
- **Performance Audit:** Run Lighthouse Performance audit focusing on LCP and CLS.

### Notes

- `next-pwa` might require `next-pwa/next-config-mjs` or similar for ESM compatibility in some versions.
- If Next.js 16 is truly the version used, check for `next-pwa` compatibility updates.
