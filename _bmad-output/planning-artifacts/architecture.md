---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
    - _bmad/specifications/prd.md
workflowType: "architecture"
project_name: "finiza"
user_name: "Tito"
date: "2026-03-02T14:32:00-03:00"
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Análise do Contexto do Projeto

### Visão Geral dos Requisitos

**Requisitos Funcionais:**
A arquitetura base será voltada para uma aplicação de gestão financeira centrada na entrada manual de dados em sua fase MVP. Requer um sistema forte de rastreamento transacional que atualize e centralize os balanços dinamicamente (Cockpit de Liquidez). O uso do Supabase como Backend as a Service (BaaS) orienta o sistema para validações no lado do cliente com forte defesa no nível do banco de dados (RLS). A interface UI exigirá componentes interativos complexos, modais deslizantes e navegação responsiva (PWA).

**Requisitos Não-Funcionais:**

- **Desempenho:** Arquitetura Next.js (SSR + CSR) será crucial para tempos de carregamento sob 2s e interações otimistas para resposta imediata.
- **Segurança & Privacidade:** Isolamento estrito de ponta a ponta com Supabase Auth e RLS.
- **Acessibilidade & Design Premium:** O uso rigoroso do Tailwind CSS e boas práticas de UI para cumprir com WCAG 2.1 AA sem comprometer as microanimações.

**Escala e Complexidade:**

- Domínio principal: Web App Full-Stack (Next.js, Supabase, Vercel)
- Nível de complexidade: Média (MVP) -> Alta (Fase 2)
- Componentes arquiteturais estimados: Backend Supabase (DB + Auth), Cliente Next.js, Sistema de Design Tailwind genérico.

### Restrições Técnicas & Dependências

- Necessidade de utilizar os módulos `@supabase/ssr` e as práticas mais recentes do Next.js App Router para evitar vazamento de dados de servidor no cliente.
- Dependência do ecossistema Vercel para suporte ideal a Edge Functions / SSR do Next.js de baixo atrito.

### Preocupações Transversais Identificadas

- **Autenticação e Sessões:** Garantir a continuidade da sessão entre Server Components e Client Components no App Router do Next.js.
- **Gestão Global de Estado / Fetching de Dados:** Estratégia eficiente para compartilhar saldos consolidados no "Cockpit de Liquidez" em toda a aplicação sem sobrecarga de renderização.

## Avaliação do Template Inicial (Starter)

### Domínio de Tecnológico Principal

Web App Full-Stack (Next.js) baseado na análise de requisitos do projeto.

### Opções de Starter Consideradas

1. **Official Next.js with-supabase Starter:** Um template robusto fornecido diretamente pelo Next.js e Supabase. Inclui `@supabase/ssr` para autenticação segura baseada em cookies no App Router, Tailwind CSS e TypeScript pré-configurados.
2. **Create T3 App:** Excelente para segurança de tipos ponta a ponta, mas requer a remoção manual do Prisma/tRPC para integrar o Supabase de forma otimizada.
3. **Custom Next.js + shadcn/ui:** Começar do zero com `create-next-app`, adicionando e configurando o Supabase Auth e SSR manualmente (maior atrito e chance de erro inicial).

### Starter Selecionado: Official Next.js with-supabase Starter

**Justificativa para a Seleção:**
Ele se alinha perfeitamente com os requisitos do PRD (Next.js App Router, Supabase, Tailwind, Vercel) e fornece uma base segura e pronta para produção com as utilidades do Supabase já separadas para Server/Browser. Isso evita erros comuns na configuração de autenticação para as rotas do lado do servidor e acelera significativamente o MVP.

**Comando de Inicialização:**

```bash
npx create-next-app -e with-supabase finiza
```

**Decisões Arquiteturais Providenciadas pelo Starter:**

**Linguagem & Runtime:**
TypeScript para segurança de tipos rigorosa e Node.js para operações de servidor Edge/Serverless.

**Solução de Estilização:**
Tailwind CSS configurado desde o início.

**Ferramentas de Build:**
Next.js built-in compiler (com suporte a Turbopack) já otimizado para deploy na Vercel.

**Framework de Testes:**
Nenhum configurado nativamente (será necessário adicionar Jest/Playwright conforme a disciplina de testes evoluir).

**Organização de Código:**
Diretório do App Router do Next.js (`/app`) com padrões definidos para utilitários do supabase divididos em `/utils/supabase/server.ts`, `client.ts` e `middleware.ts`.

**Experiência de Desenvolvimento:**
Fast Refresh ativado, integração limpa com as tipagens geradas do Supabase, e arquitetura de pastas padronizada.

**Nota:** A inicialização do projeto usando este comando deve ser a primeira história de implementação.

## Decisões Arquiteturais Centrais

### Análise de Prioridade de Decisões

**Decisões Críticas (Impedem a Implementação):**

- Gestor de Status Assíncrono da UI / Fetching Strategy (selecionado **TanStack/React Query**)
- Estratégia de Comunicação com DB / Mutability (selecionado **Next.js Server Actions c/ Zod**)
- Implementação de Design de Acessibilidade/UI Complexa (selecionado **shadcn/ui & Framer Motion**)

**Decisões Importantes (Moldam a Arquitetura):**

- Isolamento de Camada Server vs Client via diretivas `"use server"` e `"use client"`. O DB será acessado _apenas_ via Server Actions (`"use server"`) para não vazar a connection ou RLS secrets para bundle de frontend.

**Decisões Adiadas (Pós-MVP):**

1. Estratégia de Fetching/Injeção do Open Finance (esperar a API Provider).
2. Estratégia completa de Internacionalização i18n e moedas globais.

### Arquitetura de Dados

- **Supabase PostgreSQL & PostgREST:** Backend como Serviço principal. Estrutura relacional padronizada (Tabelas de Profile, Contas, Transações) e protegidas integralmente por Row Level Security (RLS) dependendo da ID vinculada ao perfil logado do Auth.

### Autenticação & Segurança

- **Supabase Auth c/ `@supabase/ssr`:** O projeto alavancará pacotes do Supabase dedicados para Server-Side Rendering (lidando nativamente com Cookies HttpOnly e renovação de Tokens nos Handlers e Server Actions). Isto elimina vetores Cross Site Scripting de localStorage e soluciona perda de sessões no modo App Router do Next.js.
- **Autorização:** A base técnica fará uso da validação server-side + a barreira pesada de RLS pelo lado do banco (Mesmo se uma chamada tentar apagar "id_da_conta_de_terceiro", o DB barra através do RLS).

### Padrões de Comunicação & API

- **Next.js Server Actions + Zod:** Utilizaremos RPC-style ("Remote Procedure Call") moderno dentro da linguagem ao invés de endpoints REST clássicos para as operações dos clientes internamente no aplicativo. Dados de Inputs são verificados por schema via Zod _ambos_ no Client antes do Post, _e_ novamente dentro da Server Action como camada Zero Trust, antes da injeção via SDK Supabase. Evitando formulários mal formatados (ex: valor transacional negativo que passe por bug).

### Arquitetura de Frontend

- **Acessibilidade e Componentização:** A base modular será o **shadcn/ui (v3.8)** unificada com **Tailwind CSS**. Evita excesso de Javascript e nos da total controle através dos arquivos colocados on folder `/components/ui`.
- **Animações e Interface Premium:** **Motion (Framer Motion - v12)** suprindo transições sofisticadas como Layout Shifts e List Animations (removendo "Flash" cognitivo exigido no PRD).
- **Gestão de Estado Global/Data Fetching:** **TanStack Query (React Query v5)** servirá como camada de requisição assíncrona, sincronia (re-fetch on focus) e, primordialmente, gerará mutações otimistas (Optimistic Updates) de interface, essencial para manter a UI interativa e o tempo entre requisições instantâneo na percepção.

### Infraestrutura & Deploy

- Hospedagem Serverless pela Vercel em forte sinergia com o Next.js, mantendo CI/CD limpo a cada push para main/PR branch.

### Análise de Impacto das Decisões

**Sequência de Implementação:**
No futuro, será imperativo seguir essa cadeia (Padrão sugerido para o framework do BMAD):

1. Setup do Starter with-supabase
2. Setup do Design System e Variáveis Customizadas.
3. Definição do Schemas Básicos Zod e Camada SDK/Auth Server Actions (Módulo Global de Utilitários).
4. Tanstack Query (Providers Context) configurados.
5. Início de Lógica em Telas Visuais (Páginas e Telas, Consumindo as mutations).

**Dependências Transversais:**
Adoção do Server Actions com Supabase RLS exige rigoroso controle de qual contexto (Cliente vs Server) você está injetando o SDK através dos utilitários como `createClient`.
