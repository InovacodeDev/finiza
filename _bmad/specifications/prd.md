# Product Requirements Document (PRD): Finiza

## 1. Executive Summary

Finiza is a premium, minimalist, and privacy-focused personal finance management application designed primarily for the Brazilian market. It targets individuals who want a beautiful, intuitive interface to track their accounts, transactions, and overall liquidity without the clutter, intrusive ads, and data-monetization practices common in existing tools. Finiza offers a seamless user experience, evolving from a robust manual-entry MVP into an automated, AI-assisted financial hub powered by Open Finance in the future.

## 2. Problem Statement

Many personal finance applications in Brazil suffer from feature bloat, visually cluttered interfaces, and aggressive monetization strategies (ads, constant upsells). Users report feeling overwhelmed and distrustful of apps that treat their financial data as a product. The key pain points are:

- **Visual & Cognitive Clutter:** Complex interfaces make simple transaction logging tedious and frustrating.
- **Privacy Concerns:** Lack of trust regarding data monetization and third-party tracking.
- **Subpar User Experience:** Many apps feel dated, lacking modern design principles like smooth micro-animations, fast load times, and true cross-device responsiveness.
- **Poor PWA Support:** Users want app-like experiences without being forced to download heavily tracking native apps from the app stores.

## 3. Goals & Success Metrics

**Goals:**

- Deliver a beautiful, responsive, and intuitive MVP focused on manual transaction and account tracking.
- Establish a premium brand identity that prioritizes user experience, aesthetics, and privacy.
- Validate the core mechanics (Cockpit de Liquidez, Account management, Transfers).

**Success Metrics (KPIs):**

- **User Engagement:** Daily/Monthly Active Users (DAU/MAU).
- **Retention:** Day 7 and Day 30 User Retention Rates.
- **Time-to-Value:** Average time taken to log a transaction (aiming for < 5 seconds).
- **Adoption:** Number of PWA installations directly from the browser.

## 4. User Personas

- **"The Minimalist Planner" (Lucas, 30, UX Designer):** He wants to track his expenses and income but hates cluttered UIs. He prefers a clean, dark-mode ready dashboard that gives him a quick snapshot of his liquidity. He values privacy and is willing to pay for a tool that respects his data.
- **"The Frustrated Switcher" (Mariana, 35, Project Manager):** Currently uses a spreadsheet or an ad-supported legacy app. She finds it tedious and wants an app that "just works" seamlessly across her desktop at work and mobile phone on the go.

## 5. Scope & Features

### 5.1 In Scope (MVP)

- **User Authentication:** Sign up, log in, and session management via Supabase.
- **Dashboard (Cockpit de Liquidez):** A quick, polished overview of total balances across different account types.
- **Account Management:** Add, edit, and delete accounts (Checking, Savings, Credit Card, Investment).
- **Transaction Management:** Manual entry, categorization, and distinguishing between income and expenses.
- **Internal Transfers:** Functionality to transfer funds between accounts, strictly enforcing business logic (e.g., preventing direct transfers to credit card accounts).
- **Responsive Design & PWA:** Fully responsive layout with floating headers, slide-over modals, and Progressive Web App configuration for native-like installation.

### 5.2 Future Scope (Post-MVP)

- **Automated Bank Synchronization:** Integration with Open Finance aggregators in Brazil (e.g., Belvo, Pluggy, or Salt Edge).
- **Advanced Budgeting:** Goal tracking and envelope-style budgeting.
- **Investment Module:** Portfolio tracking, yield analysis, and CDI/Ibovespa benchmarking.
- **Custom Categorization & Tags:** Allow users to create custom categories and tags for deeper analysis.
- **Reports & Analytics:** Granular charts for spending habits and cash flow projections.
- **Multi-currency Support:** Tracking transactions in USD/EUR etc., for travelers or expats.

## 6. Functional Requirements

- The system must support secure authentication leveraging Supabase Auth.
- The Dashboard must aggregate and display real-time balances across all active accounts.
- Transaction forms must dynamically adjust fields based on the transaction type (e.g., categories filtered by income/expense).
- Inter-account transfers must simultaneously deduct from the source and credit the destination to maintain ledger accuracy.
- The UI must implement a sidebar navigation and a floating header that reacts to scroll events for optimal screen real estate usage.

## 7. Non-Functional Requirements

- **Performance:** Initial page loads should be under 2 seconds; subsequent client-side transitions should be nearly instantaneous.
- **Security:** All user data must be strictly isolated using Supabase Row Level Security (RLS) policies.
- **Privacy:** Strict no-data-selling policy.
- **Scalability:** The architecture (Vercel + Supabase) must support scaling to thousands of concurrent users seamlessly.
- **Accessibility:** UI components should conform to WCAG 2.1 AA standards, ensuring proper contrast and keyboard navigability.

## 8. Technical Considerations

- **Tech Stack:** Next.js (App Router), React, Tailwind CSS, TypeScript.
- **Backend & Database:** Supabase (PostgreSQL DB, Auth, SSR module for server-side operations).
- **Hosting:** Vercel.
- **UI Architecture:** Use of Tailwind CSS for styling, potentially leveraging Radix UI or shadcn/ui for accessible headless components.
- **State Management:** React Context API for global state, paired with server components for data fetching.

## 9. Competitor Analysis

- **Mobills & Organizze (Local Brazilian Leaders):** High market penetration but suffer from cluttered interfaces, heavy monetization pushes (ads/upsells), and legacy tech debt.
- **YNAB (International):** Excellent methodology but prohibitively expensive for the average Brazilian (~$100+/year) and lacks localized bank integrations.
- **Monarch Money (International):** Beautiful, modern UI but heavily focused on the US market and Open Banking ecosystem.
- **Finiza’s Unfair Advantage:** Delivering a premium, hyper-localized (Brazilian Portuguese native), minimalist design without ad-heavy clutter at a fair price point, focusing aggressively on UX and performance.

## 10. Assumptions & Risks

- **Assumptions:** Users value privacy and a premium, clean UI enough to switch from their current tools, even if initial features (like bank auto-sync) require manual effort in the MVP phase.
- **Risks:**
    - Manual data entry may lead to high churn before automated sync features are introduced.
    - Integrating Open Finance for the Brazilian market (post-MVP) carries significant regulatory, technical, and subscription costs.
