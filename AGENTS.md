<!-- bmad:context -->
<!-- Verified 2026-10-21 against dd99ed2. Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. -->

## angular-conduit (web)

Front-end Angular 21 em TypeScript da aplicação Conduit (RealWorld), com bun como gerenciador de pacotes. A API .NET fica no repositório irmão `../api`. As specs e2e de referência vêm do submódulo `realworld/`.

## Política

- Nunca edite `realworld/`: é o submódulo upstream das specs, e `ignore = dirty` esconde alterações locais do `git status`. Ajustes de teste vão em `testes/interface/`.
- Testes e2e novos são só Cypress em TypeScript, em `testes/interface/`; nunca crie testes Playwright. As specs Playwright do submódulo servem apenas como baseline de comportamento.
- Relatórios e artefatos de teste vão em `testes/report/`.

## Onde ficam as coisas

- Testes unitários: Vitest em `src/**/*.spec.ts`, ao lado do código; não os mova para `testes/`.
- `window.__conduit_debug__` (definido em `src/app/app.config.ts`) expõe o estado da app para testes e2e; exemplos de uso em `realworld/specs/e2e/helpers/debug.ts`.

## Rodar e verificar

- Use `bun`/`bunx`, nunca `npm`/`npx`: o CI e o `bun.lock` são bun.
- Rode `bun run setup` depois de clonar ou de atualizar o submódulo `realworld`; sem ele as specs de baseline não existem.
- Para e2e rode só Cypress; não rode `bun run test:e2e` (Playwright). TODO: o comando Cypress ainda não existe e será definido na configuração do framework (bmad-tea-framework).
- Rode `bun run format` antes de apresentar código; o CI falha em `format:check`.

<!-- /bmad:context -->
