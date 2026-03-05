---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
    - _bmad-output/planning-artifacts/prd.md
    - _bmad-output/planning-artifacts/architecture.md
    - _bmad-output/planning-artifacts/ux-design-specification.md
    - _bmad-output/planning-artifacts/ux-design-directions.html
workflowType: "epics"
project_name: "finiza"
user_name: "Tito"
date: "2026-03-05"
lastStep: 4
status: "complete"
---

# finiza - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for finiza, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR01: O usuário realiza cadastro e login na plataforma.
FR02: O usuário gerencia dados básicos de perfil e preferences.
FR03: O usuário cria um contexto compartilhado ("Tenant" modo Família/Casal) convidando outros membros.
FR04: O administrador do tenant revoga acessos e exclui dados localmente (com _soft-delete_ protetor default).
FR05: O usuário gerencia listagem de Contas Financeiras manuais.
FR06: O usuário registra, edita e exclui transações de receitas e despesas diretamente.
FR07: O usuário realiza upload em lote (_batch_) de arquivos formato CSV assincronamente.
FR08: O usuário utiliza regras e interface de categorização rápida de faturas para edições em massa (_Speed editing_).
FR09: O usuário exclui blocos interinos de transações.
FR10: O usuário visualiza saldo consolidado atual de múltiplas contas (Dashboard Retrovisor).
FR11: O usuário aplica filtros combinados de histórico por data, conta ou categoria.
FR12: O sistema projeta matematicamente as despesas atuais versus orçamento base para prever saldo de fechamento do mês (Dashboard Preditivo).
FR13: O sistema emite Alertas Destacados evidenciando meses previstos para fechar no negativo.
FR14: O sistema isola categorias que excederam o normal ("Gargalos Financeiros") identificando-as como origem dos déficits.
FR15: O usuário interage via chat com um agente gen AI focado em redução/sugestão matemática com base zero-knowledge para mapear melhores cortes para o mês corrente.
FR19: O usuário cria transações hipotéticas (valor, data, categoria) para simular o impacto no saldo projetado sem persistir os dados no histórico real.
FR20: O sistema permite comparar dois cenários de simulação simultâneos (ex: À Vista vs. Parcelado).
FR21: O sistema visualiza graficamente a alteração na curva de projeção do "Farol" causada pela transação simulada.
FR22: O usuário define uma margem global configurável para a meta de "Reserva Dinâmica".
FR23: O sistema calcula e visualiza todo excedente de caixa livre convertido em contribuição para a Reserva e sua completude.
FR24: O usuário exporta seus dados formatados legíveis em formato CSV.

### NonFunctional Requirements

NFR-P1 (Feedback Loop Preditivo): O cálculo e o recarregamento dos painéis de projeção do "Farol" finalizam e se tornam visíveis em < 800ms após inclusão de item.
NFR-P2 (Latência de Simulação): A atualização visual da projeção durante uma simulação "What-If" deve ocorrer em < 500ms para permitir interatividade fluida.
NFR-P3 (Resiliência Bulk Upload): Transações em lote via upload CSV (<=5000 itens) concluem processo principal em < 10 segundos, não travando a thread primária da UI (Worker/Background processing).
NFR-P4 (Latência UI Routing): Roteamento em Dashboard flui com < 300ms por troca de página sob carregamento PWA ativo.
NFR-S1 (Data Separation): Separação imperativa via banco de dados usando Row Level Security (RLS) associada a cada Tenant.
NFR-S2 (Privacy-AI Guardrail): Arquiteturas e Integrações LLM devem rejeitar (falha de transação) o envio se qualquer componente da payload carregar campos identificáveis sem tratamento.
NFR-S3 (Sustain Access): Sessões JWT desativam e requerem revalidação mandatória visando regras financeiras em tempos inativos maiores de 30 minutos.
NFR-A1 (Uptime Essential): A engine fundamental de visualização (dashboard retrovisor + projeção) suporta falhas isoladas sem desligar, almejando 99.9% de SLA operacional para não romper a confiabilidade básica do usuário.

### Additional Requirements

- **Starter Template**: `npx create-next-app -e with-supabase finiza` (Mandatory for Epic 1 Story 1).
- **Tech Stack**: Next.js App Router, Supabase (PostgreSQL, Auth, SSR), Tailwind CSS, shadcn/ui, Framer Motion, TanStack Query, Zustand.
- **Data Access**: Strict "use server" for DB access via Server Actions + Zod validation. Server actions must return standard `ActionResponse` object (success, data, error).
- **Naming Patterns**: snake_case for DB, PascalCase for React components, kebab-case for utils/actions.
- **PWA**: Modern PWA plugin implementation required for mobile installation and offline resilience.
- **UX/Accessibility**: WCAG 2.1 AA compliance, including color-blind friendly textures. Responsive design from 4K to Mobile. Smooth transitions via Framer Motion.
- **Date Handling**: Dates as ISO 8601 strings in transit, parsed on UI.

### FR Coverage Map

- **FR01 a FR04:** Epic 1 (Auth/Tenant)
- **FR05:** Epic 3 (Contas)
- **FR06, 08, 09, 11, 14, 16, 17:** Epic 4 (Transações/CRUD)
- **FR07, 24:** Epic 5 (CSV/Export)
- **FR10, 18:** Epic 6 (Dashboard)
- **FR12, 13, 14:** Epic 7 (Projeções/Alertas)
- **FR19, 20, 21:** Epic 8 (Simulador)
- **FR22, 23:** Epic 9 (Metas/Reserva)
- **FR15:** Epic 10 (IA Agent)

## Epic List

### Epic 1: Fundação, Autenticação e Onboarding Seguro
O usuário pode se registrar, gerenciar seu perfil e criar contextos familiares (Tenants) com segurança.

### Epic 2: App Shell, Navegação e Experiência PWA
O usuário tem uma interface responsiva, fluida (Framer Motion) e instalável no celular para uso ágil.

### Epic 3: Gestão de Contas Financeiras (CRUD)
O usuário pode cadastrar, editar e organizar suas diferentes fontes de dinheiro (Bancos, Cartões, Dinheiro).

### Epic 4: Rastreamento de Transações e Histórico Completo
O usuário pode lançar receitas/despesas, editar erros, excluir registros e visualizar o histórico filtrado.

### Epic 5: Importação e Exportação de Dados (Batch & CSV)
O usuário pode trazer dados em massa de outros bancos via CSV e exportar seus dados para portabilidade.

### Epic 6: Cockpit de Liquidez e Dashboard Retrovisor
O usuário visualiza sua saúde financeira atual e saldo consolidado de forma instantânea e visual.

### Epic 7: Motor Preditivo e Alertas do Farol
O sistema projeta o saldo de fechamento do mês e alerta sobre gargalos e riscos de saldo negativo.

### Epic 8: Simulador de Impacto "What-If" (O Diferencial)
O usuário testa decisões de compra ("Ghost Transactions") e visualiza o impacto no futuro antes de gastar.

### Epic 9: Metas Financeiras e Reserva Dinâmica
O usuário define e acompanha metas de reserva de emergência baseadas no seu custo de vida real.

### Epic 10: Oráculo IA e Consultoria Zero-Knowledge
O usuário recebe conselhos matemáticos de IA para cortes de gastos sem expor sua identidade.

---

## Epic 1: Fundação, Autenticação e Onboarding Seguro
O usuário pode se registrar, gerenciar seu perfil e criar contextos familiares (Tenants) com segurança.

### Story 1.1: Inicialização do Projeto e Configuração Base do Supabase
As a desenvolvedor,
I want inicializar o projeto usando o template oficial `with-supabase` e configurar as variáveis de ambiente,
So that a base do projeto tenha integração segura com o Supabase Auth usando Server Actions e Cookies (SSR).

**Acceptance Criteria:**
**Given** um ambiente de desenvolvimento limpo.
**When** o comando `npx create-next-app -e with-supabase finiza` for executado e as chaves do Supabase forem configuradas no `.env.local`.
**Then** o projeto deve rodar localmente sem erros e os utilitários do Supabase (`server.ts`, `client.ts`, `middleware.ts`) devem estar presentes.

### Story 1.2: Registro e Login via Magic Link/OTP
As a usuário novo ou recorrente,
I want inserir meu e-mail para receber um código de acesso único (OTP),
So that eu possa acessar o aplicativo de forma ágil e segura sem precisar de senha.

**Acceptance Criteria:**
**Given** que o usuário está na página de login.
**When** o usuário insere um e-mail válido e clica em "Enviar Código".
**Then** o sistema deve invocar o Supabase Auth para enviar o OTP e exibir o campo de entrada para o código de 6 dígitos.

### Story 1.3: Confirmação de Identidade e Redirecionamento Protegido
As a usuário aguardando validação,
I want inserir o código OTP recebido,
So that o sistema valide minha sessão e me direcione para o Dashboard privado.

**Acceptance Criteria:**
**Given** que o usuário recebeu o código OTP.
**When** o usuário insere o código correto e submete.
**Then** a sessão deve ser criada via cookies (SSR) e o usuário deve ser redirecionado para `/dashboard`.
**And** se o código for inválido, uma mensagem de erro amigável deve ser exibida.

### Story 1.4: Gestão de Perfil e Contexto (Tenant)
As a usuário logado,
I want editar meu nome e avatar, além de criar ou convidar membros para um "Tenant" familiar,
So that eu possa personalizar minha experiência e compartilhar minhas finanças com minha família.

**Acceptance Criteria:**
**Given** que o usuário está na página de configurações de perfil.
**When** o usuário altera seus dados ou envia um convite por e-mail para outro membro.
**Then** as alterações devem ser persistidas na tabela `user_profiles` e o convite deve ser registrado via Supabase Auth/Invitations.

## Epic 2: App Shell, Navegação e Experiência PWA
O usuário tem uma interface responsiva, fluida (Framer Motion) e instalável no celular para uso ágil.

### Story 2.1: Estrutura de Layout e Navegação Lateral (Sidebar)
As a usuário logado,
I want ver um menu de navegação lateral e um cabeçalho fixo,
So that eu possa transitar entre as telas de Dashboard, Contas e Transações de forma intuitiva.

**Acceptance Criteria:**
**Given** que o usuário está autenticado.
**When** qualquer página interna é carregada.
**Then** a Sidebar deve exibir links para as rotas principais e o Header deve mostrar o perfil do usuário.
**And** a Sidebar deve ser colapsável em dispositivos mobile.

### Story 2.2: Transições de Página e Modais Suaves (Framer Motion)
As a usuário interagindo com o app,
I want ver animações fluidas ao abrir modais e trocar de página,
So that a experiência pareça premium e sem "flashes" cognitivos (Zero Layout Shift).

**Acceptance Criteria:**
**Given** o uso de Framer Motion.
**When** o usuário clica em um link de navegação ou abre um `Dialog`.
**Then** a transição deve ocorrer com um efeito de fade/slide suave.
**And** as transições de página devem ocorrer em menos de 300ms e o feedback de interação em menos de 100ms.

## Epic 3: Gestão de Contas Financeiras (CRUD)
O usuário pode cadastrar, editar e organizar suas diferentes fontes de dinheiro (Bancos, Cartões, Dinheiro).

### Story 3.1: CRUD de Contas via Server Actions (Supabase)
As a usuário organizando meu dinheiro,
I want cadastrar minhas contas bancárias e carteiras,
So that eu possa centralizar meus saldos em um só lugar.

**Acceptance Criteria:**
**Given** a tabela `accounts` protegida por RLS.
**When** o usuário submete o formulário de nova conta (Nome, Tipo, Saldo Inicial).
**Then** os dados devem ser validados via Zod e persistidos no Supabase através de uma Server Action.

### Story 3.2: Listagem e Edição de Contas no Dashboard
As a usuário com múltiplas contas,
I want visualizar e editar os dados das minhas contas existentes,
So that eu possa corrigir saldos ou nomes conforme necessário.

**Acceptance Criteria:**
**Given** que o usuário possui contas cadastradas.
**When** ele acessa a tela de "Contas".
**Then** o sistema deve listar os cards de cada conta com seus respectivos saldos e permitir a edição via modal.

## Epic 4: Rastreamento de Transações e Histórico Completo
O usuário pode lançar receitas/despesas, editar erros, excluir registros e visualizar o histórico filtrado.

### Story 4.1: Registro de Receitas e Despesas com Categorização
As a usuário no dia-a-dia,
I want lançar meus gastos e ganhos rapidamente escolhendo a conta e a categoria,
So that meu fluxo de caixa seja registrado com precisão.

**Acceptance Criteria:**
**Given** o formulário de transação.
**When** o usuário seleciona "Despesa" ou "Receita".
**Then** as categorias disponíveis no select devem filtrar dinamicamente de acordo com o tipo escolhido.

### Story 4.2: Edição e Exclusão de Transações com Sincronia de Saldo
As a usuário que cometeu um erro no lançamento,
I want editar ou excluir uma transação passada,
So that o saldo das minhas contas seja recalculado automaticamente pelo sistema.

**Acceptance Criteria:**
**Given** uma transação existente.
**When** ela é editada ou excluída.
**Then** o sistema deve atualizar o saldo da conta vinculada (Rollback/Update) de forma atômica no banco de dados.

### Story 4.3: Filtros Avançados de Histórico (FR11)
As a usuário com muitos lançamentos,
I want filtrar meu histórico por período, conta e categoria simultaneamente,
So that eu encontre transações específicas sem esforço.

**Acceptance Criteria:**
**Given** uma lista extensa de transações.
**When** os filtros de busca são aplicados na UI.
**Then** a listagem deve ser atualizada instantaneamente via cache do TanStack Query.

### Story 4.4: Speed Editing e Categorização em Massa (FR08)
As a usuário que preza pela agilidade,
I want editar categorias de múltiplas transações de uma só vez,
So that eu organize meses inteiros de faturas em poucos cliques.

**Acceptance Criteria:**
**Given** transações selecionadas na lista.
**When** o usuário escolhe uma categoria e clica em "Aplicar em Massa".
**Then** uma Server Action deve atualizar todos os registros de forma atômica no Supabase.

## Epic 5: Importação e Exportação de Dados (Batch & CSV)
O usuário pode trazer dados em massa de outros bancos via CSV e exportar seus dados para portabilidade.

### Story 5.1: Upload de CSV e Mapeamento de Colunas
As a usuário vindo de outro app ou banco,
I want fazer o upload de um arquivo CSV de extrato,
So that eu não precise lançar centenas de transações manualmente.

**Acceptance Criteria:**
**Given** um arquivo CSV padrão.
**When** o usuário realiza o upload.
**Then** o sistema deve permitir o mapeamento das colunas (Data, Descrição, Valor) antes de processar os dados.

### Story 5.2: Exportação de Dados para CSV (FR24)
As a usuário que deseja portabilidade,
I want baixar meu histórico completo em formato CSV,
So that eu possa analisar meus dados em planilhas externas ou fazer backup.

**Acceptance Criteria:**
**Given** o histórico de transações filtrado ou completo.
**When** o usuário aciona o botão "Exportar CSV".
**Then** um arquivo formatado e legível deve ser gerado e baixado automaticamente.

## Epic 6: Cockpit de Liquidez e Dashboard Retrovisor
O usuário visualiza sua saúde financeira atual e saldo consolidado de forma instantânea e visual.

### Story 6.1: Agregação Dinâmica de Saldos (Cockpit)
As a usuário que abriu o app,
I want ver meu saldo total agregado e a liquidez por tipo de conta,
So that eu tenha uma percepção instantânea do meu patrimônio disponível.

**Acceptance Criteria:**
**Given** que o usuário possui múltiplas contas.
**When** o Dashboard inicial é carregado.
**Then** o sistema deve somar todos os saldos positivos das contas e subtrair as faturas de cartão de crédito.

### Story 6.2: Histórico Visual de Fluxo Mensal (Dashboard Retrovisor)
As a usuário organizando o mês,
I want ver o resumo de entradas vs saídas em um gráfico de barras,
So that eu identifique rapidamente onde gastei mais.

**Acceptance Criteria:**
**Given** as transações do mês vigente.
**When** o gráfico de fluxo é exibido.
**Then** as receitas e despesas devem ser agrupadas por categoria e comparadas visualmente.

## Epic 7: Motor Preditivo e Alertas do Farol
O sistema projeta o saldo de fechamento do mês e alerta sobre gargalos e riscos de saldo negativo.

### Story 7.1: Projeção Matemática de Saldo (Farol Preditivo)
As a usuário ansioso pelo futuro,
I want ver uma curva de projeção de saldo até o fim do mês,
So that eu antecipe se vou fechar no vermelho.

**Acceptance Criteria:**
**Given** o histórico de gastos fixos e variáveis.
**When** o motor preditivo calcula a projeção.
**Then** o sistema deve projetar o saldo diário até o fim do mês corrente com base no orçamento base.

### Story 7.2: Alertas de Gargalos Financeiros e Déficits
As a usuário prestes a estourar o orçamento,
I want receber alertas visuais destacados sobre categorias excedentes,
So that eu pare de gastar nessas áreas imediatamente.

**Acceptance Criteria:**
**Given** que uma categoria excedeu 20% da média histórica.
**When** o usuário acessa o Dashboard.
**Then** um alerta de "Gargalo" deve ser exibido com destaque visual (laranja/vermelho).

## Epic 8: Simulador de Impacto "What-If" (O Diferencial)
O usuário testa decisões de compra ("Ghost Transactions") e visualiza o impacto no futuro antes de gastar.

### Story 8.1: Criação de Transação Hipotética (Ghost Transaction)
As a usuário planejando uma compra,
I want criar uma transação temporária com valor e data futura,
So that eu possa ver como isso afetará meu saldo sem alterar meus dados reais.

**Acceptance Criteria:**
**Given** que o usuário ativou o modo "Simulador" no dashboard.
**When** o usuário preenche o valor, data e categoria da simulação.
**Then** os dados devem ser armazenados apenas no estado local (Zustand Store) e não devem ser enviados para o banco de dados.

### Story 8.2: Visualização da Curva de Impacto (Farol Simulado)
As a usuário simulando compras,
I want ver uma linha tracejada no gráfico de projeção,
So that eu possa comparar visualmente a diferença entre o meu saldo atual e o saldo com a compra simulada.

**Acceptance Criteria:**
**Given** que existe uma transação hipotética ativa.
**When** o gráfico do "Farol" é renderizado.
**Then** o sistema deve calcular a nova curva de saldo e exibi-la como uma linha tracejada (dashed) em destaque.

### Story 8.3: Comparação de Cenários (À Vista vs. Parcelado)
As a usuário indeciso sobre a forma de pagamento,
I want comparar dois cenários de simulação simultâneos,
So that eu possa escolher a opção que mantém minha saúde financeira a longo prazo.

**Acceptance Criteria:**
**Given** que o usuário está na interface de comparação.
**When** o usuário define o cenário A (À vista) e o cenário B (12x parcelado).
**Then** o sistema deve exibir graficamente as duas curvas projetadas e destacar qual delas preserva melhor a "Reserva Dinâmica".

## Epic 9: Metas Financeiras e Reserva Dinâmica
O usuário define e acompanha metas de reserva de emergência baseadas no seu custo de vida real.

### Story 9.1: Configuração da Meta de Reserva Dinâmica
As a usuário focado em segurança,
I want definir quantos meses de custo de vida quero ter guardados,
So that o sistema calcule automaticamente meu objetivo financeiro.

**Acceptance Criteria:**
**Given** que o usuário define "6 meses" como meta.
**When** o sistema analisa o custo médio mensal.
**Then** o valor alvo da reserva deve ser calculado e exibido em progresso (%).

### Story 9.2: Visualização de Excedente e Aporte Virtual
As a usuário que economizou no mês,
I want ver meu saldo livre sendo "convertido" em progresso da meta,
So that eu me sinta motivado a poupar mais.

**Acceptance Criteria:**
**Given** um saldo livre no fim do mês.
**When** o gráfico de metas é exibido.
**Then** o sistema deve destacar o quanto falta para a meta ser atingida.

## Epic 10: Oráculo IA e Consultoria Zero-Knowledge
O usuário recebe conselhos matemáticos de IA para cortes de gastos sem expor sua identidade.

### Story 10.1: Chat com Agente de Redução Financeira (Zero-Knowledge)
As a usuário buscando conselhos,
I want conversar com uma IA sobre onde posso cortar gastos,
So that eu receba sugestões sem que meus dados pessoais sejam expostos a APIs externas.

**Acceptance Criteria:**
**Given** a integração com LLM.
**When** o sistema envia dados para análise.
**Then** apenas tensores numéricos e categorias anonimizadas devem ser transmitidos.
**And** a resposta deve ser apresentada em linguagem natural amigável e não-acusatória.
