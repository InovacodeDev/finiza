---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
    - /Users/titorm/Documents/finiza/_bmad/specifications/prd.md
    - /Users/titorm/Documents/finiza/_bmad-output/planning-artifacts/architecture.md
---

# finiza - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for finiza, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: The system must support secure authentication leveraging Supabase Auth (Sign up, log in, session management).
FR2: The Dashboard (Cockpit de Liquidez) must aggregate and display real-time balances across all active accounts.
FR3: Account Management: The user must be able to add, edit, and delete accounts (Checking, Savings, Credit Card, Investment).
FR4: Transaction Management: The system must support manual entry, categorization, and distinguishing between income and expenses. Form must dynamically adjust fields based on transaction type.
FR5: Internal Transfers: The system must allow transferring funds between accounts, simultaneously deducting from source and crediting destination, enforcing business logic (e.g., preventing direct transfers to credit card accounts).
FR6: The UI must implement a sidebar navigation and a floating header that reacts to scroll events for optimal screen real estate usage.
FR7: The app must be fully responsive with slide-over modals and PWA configuration for native-like installation.

### NonFunctional Requirements

NFR1: Performance: Initial page loads should be under 2 seconds; subsequent client-side transitions should be nearly instantaneous.
NFR2: Security: All user data must be strictly isolated using Supabase Row Level Security (RLS) policies.
NFR3: Privacy: Strict no-data-selling policy.
NFR4: Scalability: The architecture (Vercel + Supabase) must support scaling to thousands of concurrent users seamlessly.
NFR5: Accessibility: UI components should conform to WCAG 2.1 AA standards, ensuring proper contrast and keyboard navigability.

### Additional Requirements

- **Starter Template:** Mandatory use of `npx create-next-app -e with-supabase finiza` to initialize the project (crucial for Epic 1 / Story 1).
- **Architecture/Tech Stack:** Next.js App Router, React, Tailwind CSS, TypeScript, Supabase (DB, Auth, SSR).
- **Data Access & State:** Database accessed strictly via Next.js Server Actions (`/actions`) with Zod schema validation (both client and server side). Global state and optimistic updates via TanStack Query (React Query v5).
- **UI/UX Infrastructure:** Use of shadcn/ui and Framer Motion for accessible, premium, and zero-flash layout shifts.
- **Naming Conventions:** db in `snake_case`, React components in `PascalCase.tsx`, utils/actions in `kebab-case.ts`.
- **Date Handling:** Dates as ISO 8601 strings in transit, parsed on UI.
- **Action Responses:** Server actions must return standard `ActionResponse` object (success, data, error).

### FR Coverage Map

- **FR1:** Epic 1 (Autenticação e Sessões Supabase)
- **FR2:** Epic 6 (Agregação de saldos no Cockpit)
- **FR3:** Epic 3 (Manutenção do CRUD de Contas)
- **FR4:** Epic 4 (Manutenção do CRUD de Transações Manuais)
- **FR5:** Epic 5 (Gestão e regras de negócio para Transferências In-App)
- **FR6:** Epic 2 (Construção estrutural de Layout/Sidebar)
- **FR7:** Epic 2 (Adaptação Mobile, PWAs, Modais Deslizantes)

## Epic List

## Epic 1: Autenticação e Onboarding Seguro

O usuário pode se registrar, fazer login e acessar com segurança o ambiente privado do aplicativo. Isso entrega o acesso protegido básico estabelecendo as fundações técnicas do projeto de forma real.

### Story 1.1: Inicialização do Projeto e Configuração Base do Supabase

As a desenvolvedor,
I want inicializar o projeto usando o template oficial `with-supabase` e configurar variáveis de ambiente,
So that a base do projeto tenha integração segura com o Supabase Auth usando Server Actions e Cookies (SSR) configurados.

**Acceptance Criteria:**

**Given** um ambiente de desenvolvimento limpo
**When** o comando `npx create-next-app -e with-supabase finiza` for executado e as chaves do Supabase `.env.local` configuradas
**Then** o projeto deve rodar localmente sem erros
**And** utilitários do supabase devem existir sob `/utils/supabase` separados para Server e Client.

### Story 1.2: Envio de Magic Link/OTP para Acesso Único

As a usuário (novo ou existente),
I want inserir meu endereço de e-mail e receber um código de acesso único (OTP),
So that eu não precise decorar senhas e possa acessar o aplicativo de maneira extremamente ágil e segura.

**Acceptance Criteria:**

**Given** que eu estou na página pública de autenticação
**When** eu preencho meu e-mail corretamente e submeto a requisição
**Then** o sistema deve solicitar o envio do OTP via Supabase Auth
**And** a interface deve renderizar o input condicionalmente pedindo o código de seis dígitos.
**And** se o email não existia antes no banco, a conta deve ser auto-provisionada pelo Auth sob demanda.

### Story 1.3: Confirmação de OTP e Acesso Protegido

As a usuário aguardando liberação,
I want preencher o OTP recebido em meu email,
So that o aplicativo valide minha identidade, crie minha sessão, e me redirecione para a área protegida do Dashboard.

**Acceptance Criteria:**

**Given** que eu inseri o OTP de 6 dígitos recebido por email
**When** eu submeto os dados ao servidor
**Then** a action deve trocar o código por uma sessão Supabase válida
**And** o usuário deve ser redirecionado para a rota privada `/dashboard`
**And** componentes de middlewares não devem permitir renderização dessa rota caso a sessão seja apagada ou não exista.
**And** o usuário deve ser capaz de clicar em um botão 'Sair' internamente que destrói essa sessão via Server Action.

## Epic 2: App Shell e Navegação (PWA)

O usuário tem uma experiência de navegação premium e responsiva no app, podendo alternar entre páginas de forma fluída e até instalar o sistema web nativamente no celular (PWA).

### Story 2.1: Implementação do Layout Base e Sidebar

As a usuário logado,
I want ver um menu de navegação lateral (Sidebar) e um cabeçalho (Header),
So that eu possa me localizar no sistema e transitar entre o Dashboard, Contas e Configurações de forma estruturada.

**Acceptance Criteria:**

**Given** que estou logado na aplicação
**When** eu acesso qualquer rota privada (como `/dashboard`)
**Then** a Sidebar deve ser renderizada com links e ícones para as páginas principais
**And** o Header deve flutuar e apresentar meu avatar/botão de perfil
**And** o item de menu atual deve estar visualmente destacado na Sidebar.

### Story 2.2: Transições Suaves e Modais Básicos

As a usuário interagindo com a interface,
I want ver animações suaves e sem flashes (zero layout shift) ao abrir componentes e fechar telas,
So that eu sinta que o aplicativo tem uma resposta premium e seja agradável de usar.

**Acceptance Criteria:**

**Given** que a interface principal está carregada
**When** eu abro um modal (ex: configuração de perfil) ou a navegação no celular
**Then** a transição deve usar fade-in/slide-in (via Framer Motion ou utilitário similar)
**And** modais como o "shadcn/ui Dialog" devem aparecer sem causar saltos bruscos no scroll da página sob eles.

### Story 2.3: Configuração do PWA (Progressive Web App)

As a usuário mobile recorrente,
I want poder adicionar o Finiza à tela inicial do meu smartphone,
So that ele se comporte como um aplicativo nativo sem ocupar espaço de storage de apps com banners ou tracking de stores de terceiros.

**Acceptance Criteria:**

**Given** que eu acesso a aplicação pelo navegador de um dispositivo compatível (ex: Safari do iOS, Chrome do Android)
**When** eu exploro a página
**Then** devo poder ver um prompt ou instalar a aplicação via opção nativa "Adicionar à Tela Principal"
**And** um arquivo `manifest.json` com ícones adequados deve ser carregado
**And** um Service Worker essencial deve ser registrado com sucesso.

## Epic 3: Gestão de Contas (Account Management)

O usuário pode configurar e controlar as fontes de seu dinheiro, criando, editando e removendo contas de diferentes tipos (Conta Corrente, Cartão de Crédito, Carteira, Financiamentos).

### Story 3.1: Modelagem e CRUD Sever Action de Contas

As a sistema interno da aplicação,
I want que a tabela de Contas seja modelada no Supabase e protegida por rotas do backend (Sever Actions),
So that os dados fiquem 100% isolados por usuário usando RLS (Row Level Security).

**Acceptance Criteria:**

**Given** o banco de dados configurado
**When** a tabela `accounts` for criada via migration ou dashboard
**Then** as chaves RLS devem permitir apenas acesso aos próprios dados onde `user_id` bate com `auth.uid()`
**And** Server Actions para `createAccount`, `updateAccount`, `deleteAccount` devem existir validando payload via Zod antes de prosseguir com `supabase-js`.

### Story 3.2: Formulário e Criação de Contas na Interface

As a usuário organizando meu dinheiro,
I want um formulário simples que me permita adicionar minhas contas reais,
So that eu possa escolher nome, banco, saldo inicial e o tipo da conta (Corrente, Poupança, Cartão).

**Acceptance Criteria:**

**Given** que estou na tela de Contas ou Cockpit
**When** clico no botão "Nova Conta" e preencho o formulário
**Then** o formulário deve validar via Zod no cliente (impedindo envios vazios/errados)
**And** ao salvar, a Action de criação é invocada
**And** um feedback de sucesso (Toaster) deve aparecer se e somente se as mutações do React Query retornarem true.

### Story 3.3: Lista e Edição de Contas

As a usuário,
I want visualizar um cardápio de todas minhas contas cadastradas para editá-las ou arquivá-las/excluí-las,
So that meu sistema reflita sempre a minha organização bancária do mundo real.

**Acceptance Criteria:**

**Given** que tenho contas já ativas cadastradas em banco
**When** navego na aba "Accounts"
**Then** elas devem renderizar na tela como UI Cards mostrando seu saldo inicial ou atual
**And** ao editar/excluir, o status visual deve ser alterado proativamente (Atualização Otimista) antes da Server Action concluir de fato
**And** exclusão exige confirmação extra do usuário (modal de _are you sure_).

## Epic 4: Lançamento de Transações (Income & Expense)

O usuário pode registrar de maneira ágil seu dia-a-dia financeiro através de receitas e despesas com um formulário de categorização dinâmico.

### Story 4.1: Modelagem e Inserções Server Action de Transações

As a sistema interno da aplicação,
I want que as transações tenham um schema de validação pesada,
So that garanta a categorização correta do movimento (Positivo/Receita ou Negativo/Despesa).

**Acceptance Criteria:**

**Given** a estrutura banco relacional
**When** a tabela `transactions` e RLS forem ativados
**Then** propriedades como `amount` (moeda inteira ou decimal controlada), `type` (income/expense), e `date` devem existir
**And** a Server Action Zod associada restrinja os ENUMs de tipos (barrando hacks via request).

### Story 4.2: Formulário Inteligente de Transação

As a usuário no dia-a-dia,
I want abrir um modal de lançamento rápido em que as opções de "Categorias" se filtrem sozinhas caso eu mude de 'Despesa' para 'Receita',
So that o preenchimento seja ágil e sem poluição visual.

**Acceptance Criteria:**

**Given** o click no botão Global de Inserir "Novo Fluxo"
**When** o modal (Dialog shadcn) abre
**Then** ele exibirá Tabs (Despesa | Receita)
**And** se selecionado Despesa, a listagem do `<select>` exibe Lazer, Combustível, etc.
**And** se Receita, exibe Salário, Rendimentos, Pix Recebido, etc.
**And** o campo de R$ aceita formatação automática (mask) amigável.

### Story 4.3: Atualização Sincronizada de Referência (Transação -> Balanço de Conta)

As a usuário que acabou de adicionar uma transação,
I want que a respectiva Conta anexada na transação atualize seu saldo consolidado imediatamente,
So that o aplicativo não perca consistência da totalidade do meu saldo após o movimento.

**Acceptance Criteria:**

**Given** uma conta A com R$ 100 de saldo
**When** eu submeto um Cadastro de Transação (Despesa) de R$ 30 vinculado à Conta A
**Then** as Server Actions devem garantir (esquematicamente ou via RPC) que o saldo de Conta A chegue a R$ 70 de forma segura.
**And** o cliente web (React Query) deve recarregar a fetch-key relacional instantaneamente, refletindo o novo número na tela.

## Epic 5: Transferências Internas

O usuário pode espelhar a movimentação real do seu dinheiro transferindo fundos entre suas próprias contas, com a tranquilidade de travas de segurança (ex: bloquear envios para o Crédito).

### Story 5.1: Formulário de Transferências com Bloqueios Lógicos

As a usuário realocando meus saldos,
I want usar um formulário para transferir montantes e selecionar Conta Origem e Conta Destino,
So that eu ajuste minha organização sem alterar meu patrimônio total.

**Acceptance Criteria:**

**Given** que acesso "Nova Transação" ou secção de transferências
**When** seleciono que é do tipo "Transferência"
**Then** os dropdowns de categoria devem sumir e dar espaço a "De: [Conta 1]" e "Para: [Conta 2]"
**And** ao preencher valores, o botão 'Salvar' deve invocar a respectiva Action
**And** devo ser logicamente impedido de escolher uma conta Cartão de Crédito como "Destino" (segurança extra front/back).

### Story 5.2: Lógica de Dupla Mutação (Débito e Crédito Simultâneos)

As a sistema mantenedor de integridade de dados,
I want que uma Transferência seja uma operação atômica,
So that eu tire o dinheiro da Conta de Origem e coloque exatamente a mesma quantia na Conta de Destino simultaneamente.

**Acceptance Criteria:**

**Given** um trigger Server Action de Transfer
**When** executado com sucesso
**Then** um registro de "Saída" logado na tabela Transactions vinculada à Conta A
**And** um registro de "Entrada" logado na tabela Transactions vinculada à Conta B
**And** os saldos reais de A e B são instantaneamente atualizados em banco e via cache do React Query na UI.

## Epic 6: O Cockpit de Liquidez (Dashboard Global)

O usuário pode abrir o aplicativo e ter uma percepção instantânea da sua liquidez total através da agregação em tempo real dos balanços de todas as suas contas cadastradas.

### Story 6.1: Agregação Dinâmica de Saldos Globais

As a usuário buscando inteligência financeira rápida,
I want abrir a aba principal do projeto (Dashboard) e visualizar meu saldo total agregado de todas as contas combinadas,
So that eu elimine as suposições sobre minha liquidez em poucos segundos.

**Acceptance Criteria:**

**Given** os dados populados de n contas ativas no Supabase
**When** navego para `/dashboard`
**Then** um Component Widget deve buscar em tempo real e somar via React Query (ou Server Component inicial) todos os `current_balances`
**And** o valor exibido deve refletir instantaneamente as mudanças sem necessidade de dar F5 (se eu acabei de adicionar uma despesa).

### Story 6.2: View por Tipos de Contas (Cartões x Corrente) no Cockpit

As a usuário organizado visualmente,
I want que o Cockpit separe graficamente o dinheiro em minhas Contas Correntes das minhas Faturas de Cartão,
So that a percepção do meu caixa disponível (livre) não seja ofuscada pelo que eu já devo aos cartões.

**Acceptance Criteria:**

**Given** renderização final da página `/dashboard`
**When** eu analiso a divisão visual
**Then** devo enxergar Cards consolidados de `Total Geral`, e sub-divisões limpas (ex: "Em Contas: R$ 5.000 / Faturas Abertas: R$ 1.000")
**And** a formatação visual (Tailwind) deve utilizar tipografia e cores diferenciadas, ressaltando acessibilidade ao invés de gráficos pesados ou genéricos.
