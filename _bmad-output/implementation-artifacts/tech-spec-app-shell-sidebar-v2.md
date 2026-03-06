---
title: 'App Shell Configuration and Sidebar V2 Migration'
slug: 'app-shell-sidebar-v2'
created: '2026-03-06'
status: 'Implementation Complete'
stepsCompleted: [1, 2, 3, 4, 5]
tech_stack: ['Next.js 15+ (App Router)', 'shadcn/ui Sidebar V2', 'Lucide React', 'Framer Motion', 'Tailwind CSS 4', 'TypeScript']
files_to_modify: ['src/app/(app)/layout.tsx', 'src/components/ui/sidebar.tsx', 'components.json', 'package.json']
code_patterns: ['SidebarProvider Context', 'Lucide Icons migration', 'Glassmorphism (backdrop-blur)', 'Mobile-responsive Sheet/Overlay']
test_patterns: ['None found in project (Manual verification required)']
---

# Tech-Spec: App Shell Configuration and Sidebar V2 Migration

**Created:** 2026-03-06

## Overview

### Problem Statement

O sidebar atual é customizado e não segue o padrão robusto do shadcn/ui (V2), o que pode gerar conflitos de hierarquia visual e `z-index` com futuros modais (especialmente os de Perfil) e dificulta a manutenção do App Shell seguindo as melhores práticas do ecossistema Next.js.

### Solution

Implementar os primitivos do shadcn/ui Sidebar (V2), migrar a estrutura de navegação atual e garantir que o `AppLayout` use o `SidebarProvider` corretamente, mantendo a estética "Finiza Premium" (glassmorphism) e garantindo isolamento de camadas para evitar bugs de UI.

### Scope

**In Scope:**
- Inicialização do `components.json` para shadcn/ui.
- Instalação dos primitivos shadcn necessários (`sidebar`, `sheet`, `tooltip`, `button`, `separator`, `skeleton`).
- Atualização do `src/app/(app)/layout.tsx` para usar o novo `SidebarProvider`.
- Migração dos itens de menu atuais (`Dashboard`, `Contas`, `Transações`, etc.) para a nova estrutura.
- Preservação do estilo visual `bg-zinc-950/80` com `backdrop-blur-xl`.
- Garantia de que o `z-index` do Sidebar não sobreponha os modais de sistema.

**Out of Scope:**
- Refatoração do conteúdo das páginas internas do dashboard.
- Mudanças na lógica de autenticação.
- Adição de novas funcionalidades ao menu lateral.

## Context for Development

### Codebase Patterns

- **Shadcn/UI & Tailwind 4**: O projeto utiliza `@tailwindcss/postcss` v4 e tokens HSL em `globals.css`.
- **Z-Index Layering**: Atualmente o sidebar customizado usa `z-40`. Modais devem usar `z-50` ou superior.
- **Glassmorphism**: Uso extensivo de `backdrop-blur` e cores semi-transparentes (`zinc-950/80`).
- **Icons**: Padronização com `lucide-react`.

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `src/app/(app)/layout.tsx` | Layout principal que envolve as páginas logadas. |
| `src/components/ui/Sidebar.tsx` | Implementação atual (legada) para extração de rotas e estilos. |
| `src/app/globals.css` | Definição de tokens HSL e variáveis de Glassmorphism. |
| `tailwind.config.ts` | Configuração de extensões de tema (colors, spacing). |

### Technical Decisions

- **Initialization of shadcn**: Como não existe `components.json`, ele será criado para permitir o uso oficial da CLI do shadcn no futuro.
- **Sidebar V2 Implementation**: Será usado o padrão de `Sidebar`, `SidebarContent`, `SidebarGroup`, etc., conforme a documentação mais recente do shadcn/ui.
- **Z-Index Fix**: O `SidebarProvider` e o `Sidebar` serão configurados para garantir que não interfiram com Modais de Profile que utilizam `z-index` mais altos.

## Implementation Plan

### Tasks

- [x] **Task 1: Setup shadcn/ui and Dependencies**
- [x] **Task 2: Create Sidebar V2 Primitives**
- [x] **Task 3: Refactor App Layout for SidebarProvider**
- [x] **Task 4: Migrate Navigation Items and Branding**
- [x] **Task 5: Z-Index and Overlay Verification**

### Acceptance Criteria

- [x] **AC 1: Functional Navigation**
- [x] **AC 2: Mobile Responsiveness**
- [x] **AC 3: Visual Consistency (Glassmorphism)**
- [x] **AC 4: Z-Index Integrity**

## Additional Context

### Dependencies

- `lucide-react`: Para ícones consistentes.
- `framer-motion`: Para transições suaves de colapso.
- `tailwind-merge` & `clsx`: Para gestão dinâmica de classes.

### Testing Strategy

- **Manual Verification**:
  - Testar navegação em todas as rotas do array `MENU_ITEMS`.
  - Testar toggle do sidebar em resoluções Mobile, Tablet e Desktop.
  - Disparar um modal (ex: `CreateAccountModal`) e verificar se o Sidebar não sobrepõe o conteúdo.
  - Verificar contraste dos itens ativos em Dark e Light mode.

### Notes

- O `SidebarProvider` armazena o estado `open` em um cookie por padrão no shadcn. Verificar se isso causa algum conflito com o middleware de autenticação.
- Manter o `FinizaIcon` no topo do sidebar para reforço de marca.
