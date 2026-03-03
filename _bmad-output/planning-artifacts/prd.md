---
stepsCompleted:
    - step-01-init
    - step-02-discovery
    - step-02b-vision
    - step-02c-executive-summary
    - step-03-success
    - step-04-journeys
    - step-05-domain
    - step-06-innovation
    - step-07-project-type
    - step-08-scoping
    - step-09-functional
    - step-10-nonfunctional
    - step-11-polish
inputDocuments: []
workflowType: "prd"
classification:
    projectType: web_app
    domain: fintech
    complexity: medium
    projectContext: brownfield
---

# Product Requirements Document - finiza

**Author:** Tito
**Date:** 2026-03-02

## Executive Summary

O Finiza centraliza e consolida as finanças pessoais e familiares, eliminando o estresse crônico de "fechar o mês no vermelho". Ao integrar contas e cartões, a plataforma transforma a gestão financeira reativa em uma experiência proativa. O objetivo é proporcionar uma vida financeira "leve e tranquila" através de clareza imediata do contexto financeiro.

### What Makes This Special

**Previsibilidade Inteligente de Gastos:** O Finiza atua como um **farol**, projetando ativamente o futuro financeiro do usuário ou núcleo familiar com base no histórico estabelecido, ao invés de apenas registrar o passado (retrovisor).

- **Mudança Ativa de Comportamento:** Identifica "gargalos" financeiros crônicos (ex: excesso de delivery) e alerta antecipadamente.
- **Previsão de Reserva Dinâmica:** Personaliza a meta de reserva de emergência baseada no custo de vida único do usuário (ex: custeio para X meses sem renda).

## Project Classification

- **Project Type:** Web Application (SPA/Dashboard)
- **Domain:** Fintech (Gestão de Finanças Pessoais/Familiares)
- **Complexity:** Medium (Envolve modelagem preditiva e controle compartilhado)
- **Project Context:** Brownfield (Integra e expande base existente)

## Success Criteria

### User Success

- **Precisão das Projeções:** Acurácia sustentada nas projeções mensais dentro da faixa de ±15% no 3º mês de uso.
- **Mudança de Comportamento:** Redução de despesas contínuas em categorias alertadas no mês anterior.
- **Segurança Financeira:** Cumprimento consistente da meta de "Reserva Dinâmica" acumulada de meses equivalentes ao custo de vida.

### Business Success

- **Engajamento:** Retenção mensal superior a 80%.
- **Crescimento (Efeitos de Rede):** Aumento do LTV através de convites para visão unificada (contas conjuntas/familiares).

### Technical Success

- **Usabilidade (MVP):** Mínima fricção na inserção manual/importação de dados, proporcionando "deleite" visual.
- **Confiabilidade:** 99.9% de uptime nos cálculos preditivos cruciais para a confiança do farol financeiro.

## Product Scope

### MVP - Minimum Viable Product (Phase 1)

- Cadastro e gerenciamento de perfis individuais e conjuntos (famílias/casais).
- Inserção manual e importação de CSV (_batch upload_) otimizada de transações.
- Dashboard consolidado de Visão Geral (Retrovisor).
- Motor preditivo de projeções ativas e Alertas de "Gargalos".
- Configuração de meta de Reserva Dinâmica.

### Growth Features (Post-MVP - Phase 2)

- Integração Open Finance e Scrapers (ingestão 100% automática).
- Painel Administrativo de Suporte.
- Geração de tokens/webhooks (API-First).
- Insights acionáveis via IA Generativa (Zero-Knowledge).

### Vision (Expansion - Phase 3)

- Inteligência Artificial proativa que toma decisões menores (renegociação, alocação em investimentos).
- Modelos B2B e Multi-tenant complexo.
- Aplicativos Móveis Nativos (iOS/Android) se necessário além da instalação PWA.

## User Journeys

**1. O Solteiro Ansioso (Happy Path)**
O usuário insere seu salário e importa o extrato do mês via CSV. O motor preditivo instantaneamente acende o "farol", projetando saldo negativo no fim do mês. Recebe sugestão categorizada de corte (ex: "Delivery nos fins de semana"). Adota a sugestão, acompanha as finanças com facilidade, encerra o mês com saldo positivo e direciona o excedente à Reserva Dinâmica.

**2. O Casal em Descompasso (Dinâmica Compartilhada)**
Usuário cria um tenant familiar e convida o parceiro. Ambos lançam suas contas manuais. O dashboard alerta que os gastos isolados de ambos comprometem a meta conjunta de investir 10% da renda. O sistema atua como mediador neutro; o casal freia as despesas desnecessárias e alcança a meta no mês em vigor.

**3. O Administrador / Suporte (Usuário Interno)**
Um usuário relata erro nas projeções após duplicar planilhas no upload. O Administrador aciona um painel interno, reseta o _batch_ defeituoso isoladamente e recalcula as projeções sem comprometer os demais dados do tenant, restaurando o serviço em minutos.

**4. O Power User (Alta Densidade)**
Usuário realiza upload simultâneo de 3 planilhas contendo centenas de transações. Visualiza um processo rápido de categorização massiva com regras automatizadas, limpando dados com poucos cliques. O backend processa em background sem congelar a tela.

**5. O Desenvolvedor Empreendedor (API User)**
Usuário Dev gera um API Token _read-only_ e conecta seus próprios scripts ao endpoint de predição, integrando suas finanças em dashboards customizados sem bloqueios da infraestrutura, atestando o design API-First.

## Domain Requirements

### Compliance & Regulatory

- **LGPD:** Consentimento explícito do armazenamento e compartilhamento de dados (ex: casal).
- **Portabilidade:** Recursos para deleção e exportação de CSV a pedido.
- **Preparação Padrões:** Adoção de camadas de autenticação e fluxos adaptáveis para integração futura Open Finance (OAuth2/FAPI).

### Technical Constraints (Fintech AI)

- **Data Sanitization:** Interceptação mandatória para anonimização de _PII (Personally Identifiable Information)_. Apenas tensores numéricos chegam a APIs de Inteligência Artificial externas (LLMs), mantendo a interpretação analítica sem expor o titular.
- **Isolamento Básico Criptográfico:** Dados em repouso isolados por Tenant através das regras do banco de dados relacional.
- **Controle Destrutivo:** Deleções em grupo/casal aplicam _soft delete_ com retenção de 30 dias na lixeira para prevenir acidentes relacionais maliciosos.

## Innovation Analysis

**Previsão Preditiva (Comportamental):**
Inversão do valor tradicional de softwares financeiros que focam no retrovisor para focar no comportamento atual através da predição futura.

**Inteligência Artificial "Zero-Knowledge":**
Capacidade de abstrair a análise matemática e interpretá-la usando grandes modelos de linguagem fundacionais preservando 100% o sigilo transacional do indivíduo.

**Validação de Inovação Prática:**
Acompanhar a redução mensal nas despesas atreladas a alertas para testar a premissa de que o "impacto de visualização futura" anula a preguiça da inserção manual.

## Project-Type Requirements

**Arquitetura SPA / PWA:**
Aplicação Web responsiva operando como tela de Dashboard Single Page Application com capacidades e instalação nativa PWA (Progressive Web App) para mobile. Retenção estratégica offline via Service Workers para inicialização fluida e resiliência visual.

**Responsividade e Acessibilidade:**
Interfaces flexíveis de desktops de alta resolução (4K) a celulares. Inclusão de recursos contrastantes e texturas em gráficos para acomodar visualização financeira (Vermelho/Verde) por usuários daltônicos.

**Estratégia SEO:**
Área administrativa "No-Index", sigilosa e livre de _crawlers_. SEO otimizado estritamente nas "Public Pages" (Página Inicial).

## Functional Requirements

### User & Tenant Management

- **FR01:** O usuário realiza cadastro e login na plataforma.
- **FR02:** O usuário gerencia dados básicos de perfil e preferências.
- **FR03:** O usuário cria um contexto compartilhado ("Tenant" modo Família/Casal) convidando outros membros.
- **FR04:** O administrador do tenant revoga acessos e exclui dados localmente (com _soft-delete_ protetor default).

### Accounts & Transactions Management

- **FR05:** O usuário gerencia listagem de Contas Financeiras manuais.
- **FR06:** O usuário registra, edita e exclui transações de receitas e despesas diretamente.
- **FR07:** O usuário realiza upload em lote (_batch_) de arquivos formato CSV assincronamente.
- **FR08:** O usuário utiliza regras e interface de categorização rápida de faturas para edições em massa (_Speed editing_).
- **FR09:** O usuário exclui blocos interinos de transações.

### Financial Dashboard & Predictive Engine ("Farol")

- **FR10:** O usuário visualiza saldo consolidado atual de múltiplas contas (Dashboard Retrovisor).
- **FR11:** O usuário aplica filtros combinados de histórico por data, conta ou categoria.
- **FR12:** O sistema projeta matematicamente as despesas atuais versus orçamento base para prever saldo de fechamento do mês (Dashboard Preditivo).
- **FR13:** O sistema emite Alertas Destacados evidenciando meses previstos para fechar no negativo.
- **FR14:** O sistema isola categorias que excederam o normal ("Gargalos Financeiros") identificando-as como origem dos déficits.
- **FR15:** O usuário interage via chat com um agente gen AI focado em redução/sugestão matemática com base zero-knowledge para mapear melhores cortes para o mês corrente.

### Financial Goals & Export

- **FR16:** O usuário define uma margem global configurável para a meta de "Reserva Dinâmica".
- **FR17:** O sistema calcula e visualiza todo excedente de caixa livre convertido em contribuição para a Reserva e sua completude.
- **FR18:** O usuário exporta seus dados formatados legíveis em formato CSV.

## Non-Functional Requirements

### Performance

- **NFR-P1 (Feedback Loop Preditivo):** O cálculo e o recarregamento dos painéis de projeção do "Farol" finalizam e se tornam visíveis em < 800ms após inclusão de item.
- **NFR-P2 (Resiliência Bulk Upload):** Transações em lote via upload CSV (<=5000 itens) concluem processo principal em < 10 segundos, não travando a thread primária da UI (Worker/Background processing).
- **NFR-P3 (Latência UI Routing):** Roteamento em Dashboard flui com < 300ms por troca de página sob carregamento PWA ativo.

### Security

- **NFR-S1 (Data Separation):** Separação imperativa via banco de dados usando Row Level Security (RLS) associada a cada Tenant.
- **NFR-S2 (Privacy-AI Guardrail):** Arquiteturas e Integrações LLM devem rejeitar (falha de transação) o envio se qualquer componente da _payload_ carregar campos identificáveis sem tratamento.
- **NFR-S3 (Sustain Access):** Sessões JWT desativam e requerem revalidação mandatória visando regras financeiras em tempos inativos maiores de 30 minutos.

### Scalability

- **NFR-A1 (Uptime Essential):** A engine fundamental de visualização (dashboard retrovisor + projeção) suporta falhas isoladas sem desligar, almejando 99.9% de SLA operacional para não romper a confiabilidade básica do usuário.
