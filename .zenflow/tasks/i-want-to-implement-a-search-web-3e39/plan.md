# Auto

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

## Agent Instructions

Ask the user questions when anything is unclear or needs their input. This includes:
- Ambiguous or incomplete requirements
- Technical decisions that affect architecture or user experience
- Trade-offs that require business context

Do not make assumptions on important decisions — get clarification first.

**Debug requests, questions, and investigations:** answer or investigate first. Do not create a plan upfront — the user needs an answer, not a plan. A plan may become relevant later once the investigation reveals what needs to change.

**For all other tasks**, before writing any code, assess the scope of the actual change (not the prompt length — a one-sentence prompt can describe a large feature). Scale your approach:

- **Trivial** (typo, config tweak, single obvious change): implement directly, no plan needed.
- **Small** (a few files, clear what to do): write 2–3 sentences in `plan.md` describing what and why, then implement. No substeps.
- **Medium** (multiple components, design decisions, edge cases): write a plan in `plan.md` with requirements, affected files, key decisions, verification. Break into 3–5 steps.
- **Large** (new feature, cross-cutting, unclear scope): gather requirements and write a technical spec first (`requirements.md`, `spec.md` in `{@artifacts_path}/`). Then write `plan.md` with concrete steps referencing the spec.

**Skip planning and implement directly when** the task is trivial, or the user explicitly asks to "just do it" / gives a clear direct instruction.

To reflect the actual purpose of the first step, you can rename it to something more relevant (e.g., Planning, Investigation). Do NOT remove meta information like comments for any step.

Rule of thumb for step size: each step = a coherent unit of work (component, endpoint, test suite). Not too granular (single function), not too broad (entire feature). Unit tests are part of each step, not separate.

Update `{@artifacts_path}/plan.md` if it makes sense to have a plan and task has more than 1 big step.

---

# Implementation Steps

Design spec: `docs/superpowers/specs/2026-07-06-ai-component-search-website-design.md`
Detailed plan (full TDD steps + code): `docs/superpowers/plans/2026-07-06-ai-component-search-website.md`

Goal: a Next.js website where the user describes an AI component (skill, agent, prompt, MCP server) and gets a unified, de-duplicated, ranked list of links from GitHub, Smithery, SkillsMP, and a Google Custom Search fallback.

### [ ] Step 1: Convert CLI scaffold to a Next.js app
- Remove CLI sample files; install Next/React; wire package.json scripts, tsconfig, next.config, layout/page shell, `.env.example`, `.gitignore`, vitest config

### [ ] Step 2: Shared adapter types and config module
- `src/lib/adapters/types.ts` (ComponentType, AdapterId, SearchResult, SearchAdapter) and `src/lib/config.ts` (getConfig) with tests

### [ ] Step 3: Dedupe and rank utilities
- `src/lib/search/dedupe.ts` (canonical-URL de-dup) and `rank.ts` (source weight + stars) with tests

### [ ] Step 4: GitHub adapter
- `src/lib/adapters/github.ts` (repo search, always enabled) with tests

### [ ] Step 5: SkillsMP adapter
- `src/lib/adapters/skillsmp.ts` (skills search, always enabled) with tests

### [ ] Step 6: Smithery adapter
- `src/lib/adapters/smithery.ts` (MCP/agent registry, self-disables without key) with tests

### [ ] Step 7: Google Custom Search adapter
- `src/lib/adapters/google.ts` (fallback, self-disables without key + cx) with tests

### [ ] Step 8: Adapter registry and routing
- `src/lib/adapters/index.ts` (createAdapters, selectAdapters by component type) with tests

### [ ] Step 9: Search orchestrator
- `src/lib/search/orchestrator.ts` (parallel adapters, timeouts, dedupe+rank, per-source status) with tests

### [ ] Step 10: `/api/search` route handler
- `src/app/api/search/route.ts` (Zod validation, orchestration) with tests

### [ ] Step 11: Search UI
- `SearchForm`, `SourceFilter`, `ResultCard`, `ResultsList`, `page.tsx`, `globals.css` — unified list with source-filter chips and per-source status
