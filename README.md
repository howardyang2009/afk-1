# afk-1

A clean TypeScript project scaffold, ready for the next project.

The previous application (an "AI Component Search" Next.js app) has been
removed to start fresh. Its full source remains available in the git history if
you need to reference it.

## Getting started

```bash
npm ci
npm test
```

## Scripts

| Script               | Description                            |
| -------------------- | -------------------------------------- |
| `npm run typecheck`  | Type-check without emitting            |
| `npm run test`       | Run the Vitest suite once              |
| `npm run test:watch` | Run Vitest in watch mode               |
| `npm run ci`         | Type-check and run tests (used by CI)  |

## Project structure

```
src/
  index.ts        # entry point — replace with your application code
  index.test.ts   # sample Vitest test
```

Add source files under `src/` and colocated `*.test.ts` files. The `@/*` path
alias maps to `src/*` in both `tsconfig.json` and `vitest.config.ts`.

## Continuous integration

`.github/workflows/ci.yml` runs `npm run typecheck` and `npm run test` on every
push to `main` and on pull requests.
