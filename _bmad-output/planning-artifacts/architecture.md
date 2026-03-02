---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
    - _bmad/specifications/prd.md
workflowType: "architecture"
project_name: "finiza"
user_name: "Tito"
date: "2026-03-02T14:32:00-03:00"
lastStep: 8
status: "complete"
completedAt: "2026-03-02"
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

## Padrões de Implementação & Regras de Consistência

### Identificação de Pontos de Conflito Críticos:

5 áreas onde os agentes de IA podem tomar decisões divergentes se não padronizados.

### Padrões de Nomenclatura (Naming Patterns)

**Convenções de Banco de Dados (Supabase/PostgreSQL):**

- **Sempre `snake_case`:** Tabelas e colunas devem ser estritamente em `snake_case` para respeitar a herança do PostgreSQL no Supabase.
    - _Exemplo Table:_ `user_profiles`, `bank_accounts`, `transactions`.
    - _Exemplo Column:_ `account_id`, `created_at`, `current_balance`.
    - _Anti-padrão:_ `UserProfiles`, `accountId`.

**Convenções de Código (TypeScript & React):**

- **Arquivos Next.js App Router:** Estritamente as palavras-chave do framework (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
- **Arquivos React Components:** Sempre `PascalCase.tsx`.
    - _Exemplo:_ `TransactionCard.tsx`, `AccountList.tsx`.
- **Arquivos Utilitários e Server Actions:** Sempre `kebab-case.ts` ou `camelCase.ts`.
    - _Exemplo:_ `format-currency.ts`, `create-transaction.ts`.
- **Tipos, Schemas e Interfaces:** `PascalCase` para o nome do tipo. Schemas Zod recebem o sufixo `Schema`.
    - _Exemplo:_ `TransactionSchema`, `type Transaction`.

### Padrões de Estrutura (Structure Patterns)

**Organização de Diretórios do Projeto:**

- Todas as Server Actions devem estar isoladas e não devem ser misturadas nas rotas de UI. O padrão será uma pasta `/actions` na raiz ou `/app/actions`.
- Componentes Genéricos do Design System (shadcn): Vão ficar em `/components/ui`.
- Componentes Específicos do Domínio: Vão ficar em `/components/business` ou em pastas por domínio `/components/transactions`.

### Padrões de Formato e Comunicação (Format & Communication Patterns)

**Formato de Resposta de Server Actions:**
Como Server Actions substituirão endpoints REST, toda action **deve** retornar um objeto padronizado para o Client:

```typescript
interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string; // Mensagem safe-for-client
}
```

_Isto impede que um agente retorne um booleano, enquanto outro retorna o objeto direto, quebrando o React Query no frontend._

**Padrão de Dados (Zod):**

- A validação do schema Zod (`schema.parse` ou `schema.safeParse`) **é obrigatória na primeira linha** de qualquer Server Action antes de executar chamadas de banco.

**Padrões de Data (Dates/Time):**

- Em trânsito (Actions/Supabase), as datas devem ser trocadas em strings **ISO 8601** (ex: `2026-03-02T15:00:00Z`).
- Para leitura e manipulação de timezone brasileiro na UI, devem ser parseadas via biblioteca padrão moderna (ex: `date-fns`).

### Padrões de Processo (Process Patterns)

**Padrão de State Management (React Query):**

- É proibido chamar DB direto de Client Components através da SDK Supabase (Isso vaza regras mistas de front e back).
- Clientes invocam mutations do React Query. As mutations do React Query invocam a Server Action.

**Padrões de Error Handling (Segurança de Ponto Cego):**

- Tratamento dentro da Server Action: Onde ocorre o Try/Catch principal do Supabase. Erros internos profundos devem ser "engolidos" por um `console.error(internalError)` do lado servidor e uma _ActionResponse_ de falha mapeada (String genérica amigável) deve voltar para a UI.

### Muro de Regras Inquebráveis para IAs

**Todos os Agentes de IA DEVEM:**

1. Manter a diretiva `"use server"` no topo de todos os arquivos de actions para impedir que a build misture código client/server em relação a SDK de Admin do Supabase.
2. Não usar chamadas diretas não autenticadas no Supabase. O Token de Request do Context App Router (via `@supabase/ssr`) deve ser propagado em instância do server client.
3. Não adiar a configuração de componentes shadcn/ui gerados automatizados - instale apenas o que for usar.

## Estrutura do Projeto & Fronteiras

### Estrutura Completa de Diretórios (Project Tree)

Baseada no Next.js App Router + Supabase + React Query:

```text
finiza/
├── README.md
├── package.json
├── pnpm-lock.yaml              # Gerenciador de dependências preferido
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── components.json             # Configuração do shadcn/ui
├── .env.local                  # Supabase Keys
├── .env.example
├── .gitignore
├── .github/
│   └── workflows/              # CI/CD Actions (Lint, Typecheck, Tests)
├── supabase/                   # Se gerenciado via CLI local
│   ├── config.toml
│   └── migrations/
├── src/
│   ├── app/                    # Next.js App Router (Páginas e Roteamento)
│   │   ├── (auth)/             # Route Group: Públicas (Login/Signup)
│   │   │   ├── login/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/        # Route Group: Privadas (Logadas)
│   │   │   ├── layout.tsx      # Sidebar + Header (Shell da aplicação)
│   │   │   ├── page.tsx        # Dashboard / Cockpit de Liquidez
│   │   │   ├── accounts/page.tsx
│   │   │   └── transactions/page.tsx
│   │   ├── globals.css
│   │   └── layout.tsx          # Root Layout (Providers de CSS/Theme)
│   ├── components/             # Camada de Apresentação
│   │   ├── ui/                 # Componentes Genéricos/Reutilizáveis (shadcn)
│   │   ├── layout/             # Componentes de Estrutura (Header, Sidebar)
│   │   ├── providers/          # React Query Provider, Theme Provider
│   │   └── business/           # Componentes de Domínio (Inteligentes)
│   │       ├── accounts/       # Ex: AccountCard, AccountForm
│   │       └── transactions/   # Ex: TransactionList, CategorySelect
│   ├── actions/                # 🚧 SERVER ACTIONS (Único acesso ao DB)
│   │   ├── auth.ts
│   │   ├── accounts.ts
│   │   └── transactions.ts
│   ├── hooks/                  # Wrappers do React Query
│   │   ├── use-accounts.ts     # Ex: useQuery + Server Action
│   │   └── use-transactions.ts
│   ├── lib/                    # Configurações e Instâncias
│   │   ├── supabase/
│   │   │   ├── client.ts       # Instância Supabase (Public - Client)
│   │   │   ├── server.ts       # Instância Supabase (Cookies - Server)
│   │   │   └── middleware.ts   # Atualização de Sessão
│   │   └── utils.ts            # Helpers (ex: cn do tailwind, formatters de moeda)
│   ├── schemas/                # Schemas de Validação Zod (Single Source of Truth)
│   │   ├── account-schema.ts
│   │   └── transaction-schema.ts
│   └── types/                  # Tipagens TypeScript Universais
│       └── supabase.ts         # Tipos gerados via CLI do Supabase
└── public/
    └── icons/                  # Assets estáticos (Favicon do Finiza, PWA manifests)
```

### Fronteiras Arquiteturais (Architectural Boundaries)

**1. Fronteiras de API e Acesso a Dados (Zero-Trust):**

- O Banco de Dados (Supabase PostgreSQL) só poderá ser acessado de e através do diretório `src/actions/`.
- Client Components (ex: listagens, botões na UI) **não podem** instanciar o `supabase.from('table')` diretamente. Eles devem, obrigatoriamente, invocar os hooks que ativam as Server Actions.
- O Zod (`src/schemas/`) atua como a fronteira de formato. Os mesmos Schemas validam os forms do Client e barram payloads maliciosos dentro das Server Actions antes de inserir os dados.

**2. Fronteiras de Componentização (Dumb vs Smart):**

- `/components/ui/`: Restrito a código de apresentação (botões, inputs, dialogs). Nunca importam React Query ou Server Actions. (Recebem dados via `props`).
- `/components/business/`: Podem importar hooks e regras de negócio. São amarrados ao domínio da aplicação (ex: Um componente que exibe balanço de Transações).

**3. Fronteiras de Estado Global e Fetching:**

- `/hooks/`: Absorve toda a complexidade do React Query. As mutações otimistas (Optimistic Updates) para performance de alta percepção devem estar empacotadas nestes arquivos, não vazando código espaguete de Query Cache para dentro dos componentes visuais.

### Mapeamento de Requisitos para a Estrutura (Requirements Mapping)

**Epic: Gestão de Contas (Account Management) & Cockpit**

- **UI:** `src/app/(dashboard)/accounts/page.tsx` + `src/components/business/accounts/`
- **Validação:** `src/schemas/account-schema.ts`
- **Fetching:** `src/hooks/use-accounts.ts`
- **Persistência DB:** `src/actions/accounts.ts`

**Epic: Rastreamento de Transações (Income/Expense/Transfers)**

- **UI:** `src/app/(dashboard)/transactions/page.tsx` + `src/components/business/transactions/`
- **Validação:** `src/schemas/transaction-schema.ts` (lida com lógicas contextuais, ex: Transferências requerem conta de origem e destino).
- **Fetching:** `src/hooks/use-transactions.ts`
- **Persistência DB:** `src/actions/transactions.ts`

## Arquitetura: Resultados da Validação

### Validação de Coerência ✅

**Compatibilidade das Decisões:**
As Server Actions + o Zod funcionam em perfeita harmonia nativa no App Router (Next.js v15+). Como o formulário não perde a tipagem cruzando a network, o atrito tradicional entre Client e Controller Server não existirá.

**Consistência de Padrões:**
A decisão de manter o `kebab-case.ts` para arquivos fora da camada View, cruzando apenas componentes `PascalCase.tsx`, suporta as boas práticas do Time Next.js. O estado de carregamento foi removido por decisão de confiar nas mutations do React Query.

**Alinhamento Estrutural:**
A divisão da UI em `/components/ui/` (Dumb/shadcn) e `/components/business/` garante que possamos trocar de Design System no longo prazo se precisarmos, isolando a regra de negócio e os hooks.

### Validação de Cobertura de Requisitos (PRD) ✅

**Cobertura das Features do "Finiza MVP":**

- Autenticação Nativa (Coberta via Supabase SSR).
- Cockpit de Liquidez Visual & Responsivo (Coberto via shadcn + Tailwind).
- Transições "sem flash" Cognitivo (Coberto via Framer Motion & React Query).
- Ações Manuais Seguras de Transações (Coberto Arquiteturalmente via Server Actions Zero-Trust + Zod).
- Instalação Edge Device/Mobile sem Loja (PWA Coberto via manifesto e Assets incluído na estrutura em `public/`).

**Cobertura de Requisitos Não-Funcionais (NFRs):**

- **Performance (TTV < 5s):** Totalmente coberto pelo Optimistic Update via TanStack Query.
- **Segurança (Privacidade e Zero-Ads):** Configuração RLS Nativa do Supabase no banco isola hardmente perfis.

### Validação de Prontidão de Implementação ✅

**Completude da Decisão:**
Apenas as integrações do Open Finance e Internacionalização (Moedas dinâmicas globais) estão delegadas intencionalmente para Fase de Roadmap. O MVP tem as fundações 100% esclarecidas.

**Completude dos Padrões:**
Regras que ditam que "Data Fetches são Server Actions mas devem passar como mutate pro Client" salvam dias de debug futuros. Regra Zero-Trust blindou a camada.

### Checklist de Completude Arquitetônica

**✅ Análise de Requisitos**

- [x] O contexto do projeto Finiza e PWA foi totalmente digerido e compreendido.
- [x] Escala MVP para Single-Tenant desenhada.
- [x] Preocupações cruciais mapeadas (Isolamento RLS UI Limpa).

**✅ Decisões Arquitetônicas**

- [x] Stack de Next.js, React Query, Supabase, Tailwind, shadcn mapeada meticulosamente.
- [x] Padrões de integração (Server Action + RPC via Form Action) traçados.

**✅ Padrões de Implementação**

- [x] Convenções de Nomenclatura ditadas (PascalCase View / snake_case DB e kebab-case Util).
- [x] Padrões de Error Handling processuais centralizados na UI mapeados.

**✅ Estrutura do Projeto**

- [x] Árvore completa documentada em `finiza/app`, `components` etc.
- [x] Fronteiras (Boundaries) de camada cimentadas.

### Avaliação de Prontidão da Arquitetura

**Status Geral:** READY FOR IMPLEMENTATION (PRONTA PARA IMPLEMENTAÇÃO)

**Nível de Confiança:** ALTO (Super coerência entre as tecnologias de vanguarda Server Component da Vercel + Supabase Team Starter).

**Transferência de Implementação (Primeira Prioridade Handoff)**:
O seu primeiro passo acionado deve ser o scaffold via comando oficial do Next.js Supabase:
`npx create-next-app -e with-supabase finiza`
