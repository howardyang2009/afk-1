# afk-1

A basic TypeScript CLI template scaffolded with [Commander](https://github.com/tj/commander.js),
[Vitest](https://vitest.dev/), and strict type checking.

## Getting started

```bash
npm ci
```

## Usage

Run the CLI directly with `tsx` (no build step needed):

```bash
npm run cli -- greet Ada
# => Hello, Ada!

npm run cli -- greet
# => Hello, there!

npm run cli -- --help
```

Or build and run the compiled output:

```bash
npm run build
node dist/index.js greet Ada
```

## Scripts

| Script               | Description                           |
| -------------------- | ------------------------------------- |
| `npm run cli`        | Run the CLI via `tsx`                 |
| `npm run build`      | Compile TypeScript to `dist/`         |
| `npm run typecheck`  | Type-check without emitting           |
| `npm run test`       | Run the Vitest suite once             |
| `npm run test:watch` | Run Vitest in watch mode              |
| `npm run ci`         | Type-check and run tests (used by CI) |

## Project structure

```
src/
  index.ts       # CLI entry point (#!/usr/bin/env node)
  cli.ts         # buildProgram() — Commander program, testable
  cli.test.ts    # CLI tests
  greet.ts       # example command logic
  greet.test.ts  # greet tests
```

## Continuous integration

`.github/workflows/ci.yml` runs `npm run typecheck` and `npm run test` on every
push to `main` and on pull requests.
