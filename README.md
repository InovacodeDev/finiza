# Finiza 🟢

A primeira plataforma de finanças pessoais focada na previsibilidade do seu fluxo de caixa. O Finiza é um SaaS desenhado para prover controle real sobre gastos estruturais, não estruturais e de lazer, com uma interface bonita, dinâmica e responsiva.

## 🚀 Sobre o Projeto

O Finiza foi idealizado e construído com um foco extremo em UX/UI, utilizando cores precisas, _dark mode_ premium, efeitos de _glassmorphism_ e animações fluidas para proporcionar a melhor experiência possível.

A plataforma também atua como um PWA (Progressive Web App), permitindo a instalação do aplicativo diretamente no seu celular ou desktop.

### 🛠 Tecnologias Principais

- **Core & Framework:** [Next.js 16](https://nextjs.org) (App Router) + [React 19](https://react.dev)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização & UI:** [Tailwind CSS v4](https://tailwindcss.com) + [Framer Motion](https://www.framer.com/motion/) + [Lucide React](https://lucide.dev/)
- **Backend (BaaS):** [Supabase](https://supabase.com) (Autenticação, Banco de Dados, RLS)
- **PWA:** [Serwist](https://serwist.build/)

## 💻 Começando

### Pré-requisitos

- Node.js (v20+)
- Gerenciador de pacotes (`pnpm` é recomendado)

### Passos para Desenvolvimento

1. Instale as dependências:

```bash
pnpm install
```

2. Configure o seu ambiente criando um arquivo `.env.local` na raiz:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

3. Geração de tipos do Supabase (Opcional, caso tenha a CLI rodando):

```bash
pnpm supabase:types
```

4. Execute o servidor de desenvolvimento:

```bash
pnpm dev
```

A aplicação estará rodando em [http://localhost:9991](http://localhost:9991).

## 📁 Estrutura de Diretórios

- `/src/app`: Rotas da aplicação (incluindo Landing Page e o novo `/dashboard`);
- `/src/components`: Componentes desacoplados, seguindo uma arquitetura modular;
- `/src/lib` / `/src/utils`: Funções de interface, integrações com Supabase e _helpers_ visuais;
- `/src/types`: Definições globais de TypeScript do projeto.

---

_Feito com muita dedicação pela equipe Finiza. © 2026 Todos os direitos reservados._
