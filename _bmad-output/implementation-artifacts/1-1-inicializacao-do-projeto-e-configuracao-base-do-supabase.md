# Story 1.1: Inicialização do Projeto e Configuração Base do Supabase

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a desenvolvedor,
I want inicializar o projeto usando o template oficial `with-supabase` e configurar as variáveis de ambiente,
so that a base do projeto tenha integração segura com o Supabase Auth usando Server Actions e Cookies (SSR).

## Acceptance Criteria

1. **Given** um ambiente de desenvolvimento limpo.
2. **When** o comando `npx create-next-app -e with-supabase finiza` for executado e as chaves do Supabase forem configuradas no `.env.local`.
3. **Then** o projeto deve rodar localmente sem erros e os utilitários do Supabase (`server.ts`, `client.ts`, `middleware.ts`) devem estar presentes.
4. **And** a estrutura de pastas deve seguir o padrão do Next.js App Router com o diretório `src/` (se aplicável ao template).

## Tasks / Subtasks

- [ ] Task 1: Scaffold do Projeto (AC: 1, 2)
  - [ ] Executar `npx create-next-app -e with-supabase finiza`
  - [ ] Mover arquivos para o diretório de trabalho se necessário
  - [ ] Instalar dependências iniciais (`npm install` ou `pnpm install`)
- [ ] Task 2: Configuração de Variáveis de Ambiente (AC: 2)
  - [ ] Criar arquivo `.env.local` baseado no `.env.example`
  - [ ] Configurar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Task 3: Validação da Estrutura Supabase SSR (AC: 3)
  - [ ] Verificar existência de `utils/supabase/server.ts`
  - [ ] Verificar existência de `utils/supabase/client.ts`
  - [ ] Verificar existência de `utils/supabase/middleware.ts`
- [ ] Task 4: Teste de Inicialização (AC: 3)
  - [ ] Executar o projeto em modo desenvolvimento (`npm run dev`)
  - [ ] Verificar se a página inicial carrega sem erros de conexão com Supabase

## Dev Notes

- **Template:** O template `with-supabase` é a base oficial recomendada pela Vercel e Supabase para Next.js 15+ com App Router.
- **Autenticação:** Utiliza `@supabase/ssr` para gerenciar sessões via cookies, garantindo segurança entre Server e Client Components.
- **Padrões de Nomenclatura:** Seguir `kebab-case` para nomes de arquivos utilitários conforme definido na Arquitetura. [Source: _bmad-output/planning-artifacts/architecture.md#Padrões de Nomenclatura]
- **Tecnologia:** Next.js 15+, Supabase, TypeScript, Tailwind CSS.

### Project Structure Notes

- A estrutura deve seguir o padrão:
  - `/app`: Rotas e layouts
  - `/utils/supabase`: Utilitários de conexão
  - `/components`: Componentes UI (shadcn/ui será adicionado em histórias futuras)
- **Atenção:** O comando de scaffold criará uma pasta `finiza/`. Certifique-se de que o conteúdo esteja na raiz correta do projeto conforme esperado pelo BMAD.

### References

- [Architecture Decision Document: Avaliação do Template Inicial](_bmad-output/planning-artifacts/architecture.md#Avaliação do Template Inicial (Starter))
- [PRD: MVP Phase 1](_bmad-output/planning-artifacts/prd.md#MVP---Minimum Viable Product (Phase 1))
- [Supabase SSR Documentation](https://supabase.com/docs/guides/auth/server-side/nextjs)

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-thinking-exp-01-21

### Debug Log References

### Completion Notes List

### File List
