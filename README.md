# Meu Estudo

Plataforma pessoal de organização de estudos: tarefas, matérias, caderno de anotações,
calendário, banco de questões com geração por IA e acompanhamento de evolução —
com autenticação e sincronização de dados via Supabase.

## Funcionalidades

- **Dashboard** com visão geral de tarefas, sequência de estudos (streak) e atalhos rápidos.
- **Matérias** com progresso por assunto e sessões de foco cronometradas.
- **Tarefas** com criação, conclusão e exclusão sincronizadas com o Supabase.
- **Caderno de anotações** com editor rich-text, modelos prontos (Cornell, redação, fórmulas),
  exportação para Word/PDF/Markdown/TXT e múltiplos estilos de papel.
- **Calendário** de eventos de estudo.
- **Questões** geradas sob demanda por IA (Gemini) a partir de matéria, tópico e dificuldade,
  com registro de tentativas e desempenho.
- **Biblioteca** de materiais de apoio.
- **Evolução** com métricas de desempenho por matéria.

## Stack

- React 19 + TypeScript, Vite e Tailwind CSS 4
- Express (servidor de API e proxy do Gemini)
- Supabase (autenticação e persistência)
- Sentry (monitoramento de erros, com privacidade de dados do usuário)

## Rodando localmente

**Pré-requisitos:** Node.js 20+

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Copie `.env.example` para `.env` e preencha as variáveis necessárias
   (`GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`).
3. Rode o app em modo desenvolvimento:
   ```bash
   npm run dev
   ```

## Scripts disponíveis

| Script                 | Descrição                                             |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev`          | Sobe o servidor Express + Vite em modo dev            |
| `npm run build`        | Gera o build de produção (client + servidor)          |
| `npm start`            | Roda o build de produção                              |
| `npm run preview`      | Pré-visualiza o build do Vite                         |
| `npm run typecheck`    | Verifica tipos com o TypeScript                       |
| `npm run lint`         | Executa o ESLint                                      |
| `npm run lint:fix`     | Executa o ESLint corrigindo problemas automaticamente |
| `npm run format`       | Formata o código com o Prettier                       |
| `npm run format:check` | Verifica formatação sem alterar arquivos              |

## Privacidade e monitoramento de erros

O projeto usa o Sentry para capturar erros em produção. O envio de dados pessoais
(e-mail, nome de usuário, IP e corpos de requisição) é desativado explicitamente
na inicialização (`src/main.tsx`), e um Error Boundary garante que falhas de
renderização não quebrem a aplicação inteira.
