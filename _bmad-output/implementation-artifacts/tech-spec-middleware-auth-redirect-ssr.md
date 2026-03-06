---
title: 'Middleware Auth Redirect (SSR)'
slug: 'middleware-auth-redirect-ssr'
created: '2026-03-06'
status: 'Implementation Complete'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['Next.js 16', 'Supabase SSR (@supabase/ssr)', 'TypeScript']
files_to_modify: ['src/middleware.ts', 'src/lib/supabase/middleware.ts']
code_patterns: ['Next.js Middleware', 'Supabase SSR Client Auth', 'SSR Cookie Management']
test_patterns: ['Manual Verification (No automated tests found)']
---

# Overview

## Problem Statement
Protected routes under the `(app)` group are currently accessible via direct URL even when the user is not authenticated. This bypasses security and allows unauthorized access to private dashboards and user data.

## Solution
Implement a mandatory Next.js middleware at the root of the source directory. This middleware will use the Supabase Auth SSR patterns to check for a valid JWT/Session. If no session is found and the user attempts to access a protected route, they will be transparently redirected to the login page at `/auth`.

## Scope
- **In Scope**:
    - Creation of `src/lib/supabase/middleware.ts` to handle cookie management and session refreshing.
    - Creation and configuration of `src/middleware.ts` as the primary request interceptor.
    - Implementation of logic to identify authenticated routes (group `(app)`) and redirect unauthenticated users to `/auth`.
    - Ensuring session tokens are refreshed during middleware execution.
- **Out of Scope**:
    - Modifications to the login/signup UI or logic.
    - Implementing client-side-only protection.
    - Protecting marketing or legal routes (`/`, `/auth`, `/privacy`, `/terms`, `/cookies`, `/ia`, `/invite`).

# Context for Development
- **Tech Stack**: Next.js 16 with App Router, React 19, and Supabase SSR (`@supabase/ssr`).
- **Existing Patterns**:
    - `src/lib/supabase/server.ts` uses `createServerClient` with `next/headers`.
    - `src/lib/supabase/client.ts` uses `createBrowserClient`.
- **Files Investigated**:
    - `src/lib/supabase/server.ts`
    - `src/lib/supabase/client.ts`
    - `src/app/auth/page.tsx`
- **Technical Decisions**:
    - Follow Supabase SSR official middleware pattern for cookie synchronization.
    - Matcher in `middleware.ts` should target all routes EXCEPT static assets and specific system paths.
    - Explicit route exclusion in code for public pages like `/auth`, `/privacy`, `/terms`, etc.
    - Use `supabase.auth.getUser()` in middleware for secure server-side verification.

# Implementation Plan

## Tasks

- [x] Task 1: Create Supabase Middleware Utility
  - File: `src/lib/supabase/middleware.ts`
  - Action: Implement `updateSession` function using `createMiddlewareClient` from `@supabase/ssr`.
  - Notes: Ensure proper cookie set/get logic is implemented to synchronize session state between requests.

- [x] Task 2: Implement Main Middleware Logic
  - File: `src/middleware.ts`
  - Action: Create the default middleware export that calls `updateSession` and performs redirect logic.
  - Notes: If `user` is null and the path is a protected route (under `(app)` group), redirect to `/auth`.

- [x] Task 3: Configure Middleware Matcher
  - File: `src/middleware.ts`
  - Action: Define the `config` object with a proper `matcher` array.
  - Notes: Matcher should exclude `_next`, `api`, `favicon.ico`, and static assets.

# Acceptance Criteria

- [x] AC 1: Redirect Unauthenticated User
  - Given an unauthenticated user, when they attempt to access `/dashboard`, then they are redirected to `/auth`.
- [x] AC 2: Allow Authenticated User
  - Given an authenticated user, when they attempt to access `/dashboard`, then they are allowed to view the page.
- [x] AC 3: Public Route Access (Home)
  - Given any user, when they access `/`, then they are allowed to view the page without redirection.
- [x] AC 4: Public Route Access (Legal/Marketing)
  - Given any user, when they access `/privacy`, `/terms`, or `/cookies`, then they are allowed to view the page without redirection.
- [x] AC 5: Auth Page Access
  - Given an unauthenticated user, when they access `/auth`, then they are allowed to view the page.

# Dependencies
- `@supabase/ssr` (already installed)
- `next/server` (built-in)

# Testing Strategy
- **Manual Verification**:
  1. Open the browser in Incognito mode.
  2. Attempt to access `http://localhost:3000/dashboard`. Confirm redirect to `/auth`.
  3. Access `http://localhost:3000/privacy`. Confirm page loads.
  4. Perform login.
  5. Attempt to access `http://localhost:3000/dashboard`. Confirm page loads.
