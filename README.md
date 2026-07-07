# AI Component Search

A Next.js web app for searching AI marketplaces. Describe an AI **Skill**,
**Agent**, **Prompt**, or **MCP server** and get back a unified,
de-duplicated, ranked list of links from curated marketplaces and GitHub, with
a Google search fallback for broader coverage.

## Getting started

```bash
npm ci
cp .env.example .env.local   # optional — see Configuration below
npm run dev
```

Then open http://localhost:3000.

## How it works

The UI posts a component type + free-text description to `/api/search`, which
fans out to source adapters in parallel, merges and de-duplicates the
results by canonical URL, ranks them, and returns a unified list along with a
per-source status (`ok`, `disabled`, `error`). The UI lets you filter results
by source.

| Component type | Sources queried          |
| --------------- | ------------------------ |
| Skill            | SkillsMP, GitHub, Google |
| MCP server       | Smithery, GitHub, Google |
| Agent            | Smithery, GitHub, Google |
| Prompt           | GitHub, Google           |

See `docs/superpowers/specs/2026-07-06-ai-component-search-website-design.md`
for the full design.

## Configuration

All environment variables are optional — each adapter self-disables when its
required keys are missing, and the app still works with GitHub and SkillsMP
running live out of the box.

| Variable              | Used by  | Required for adapter? |
| ---------------------- | -------- | --------------------- |
| `GITHUB_TOKEN`         | GitHub   | No (raises rate limit) |
| `SKILLSMP_API_KEY`     | SkillsMP | No (raises rate limit) |
| `SMITHERY_API_KEY`     | Smithery | Yes |
| `GOOGLE_CSE_API_KEY`   | Google   | Yes (both required) |
| `GOOGLE_CSE_CX`        | Google   | Yes (both required) |

Copy `.env.example` to `.env.local` and fill in whichever keys you have.

## Scripts

| Script              | Description                            |
| ------------------- | --------------------------------------- |
| `npm run dev`        | Run the Next.js dev server             |
| `npm run build`      | Build for production                   |
| `npm run start`      | Run the production build               |
| `npm run typecheck`  | Type-check without emitting            |
| `npm run test`       | Run the Vitest suite once              |
| `npm run test:watch` | Run Vitest in watch mode               |
| `npm run ci`         | Type-check and run tests (used by CI)  |

## Project structure

```
src/
  app/
    page.tsx                # search UI (client component)
    layout.tsx
    api/search/route.ts      # orchestrator API endpoint
  components/
    SearchForm.tsx
    ResultsList.tsx
    ResultCard.tsx
    SourceFilter.tsx
  lib/
    adapters/                # per-source adapters (github, smithery, skillsmp, google)
    search/                  # orchestrator, dedupe, rank
    config.ts                # env reading + adapter enablement
    types.ts                 # shared types (ComponentType, SearchResult, ...)
```

Each adapter, the dedupe/rank logic, and the API route have matching
`*.test.ts` files under Vitest.

## Continuous integration

`.github/workflows/ci.yml` runs `npm run typecheck` and `npm run test` on every
push to `main` and on pull requests.
