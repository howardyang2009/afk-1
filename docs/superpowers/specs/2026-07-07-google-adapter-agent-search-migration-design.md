# Google Adapter: Migrate from Custom Search API to Agent Search — Design

**Date:** 2026-07-07
**Status:** Approved (design phase)

## Purpose

Google's Custom Search JSON API (used by `src/lib/adapters/google.ts`) is being
shut down (existing customers must migrate by 2027-01-01, new engines already
blocked from full-web search). Replace it with Google's recommended successor,
**Agent Search** (formerly Vertex AI Search / AI Applications), built on the
Discovery Engine API, while keeping the adapter's existing interface and
site-restricted behavior unchanged.

## Scope

**In scope**
- Swap the Google adapter's backend from `customsearch/v1` to Discovery
  Engine's `searchLite` REST method.
- Update config/env vars and adapter wiring accordingly.
- Preserve the adapter's public contract (`SearchAdapter`), error-handling
  shape, and site-restriction behavior (now configured server-side in the
  Agent Search data store instead of via a `cx` param).

**Out of scope**
- Any other adapter (GitHub, Smithery, SkillsMP).
- Using generative features of Agent Search (summaries, extractive answers,
  follow-up questions) — deliberately disabled to keep this a plain
  results-only search, matching old CSE behavior and minimizing cost.
- OAuth/service-account auth path (`search` method) — not needed since
  `searchLite` supports plain API-key auth, matching the existing adapter's
  auth model.

## GCP setup (already completed, for reference)

An "AI Applications" **app** of type **"Site search with AI mode"** was
created in project `808359232572` ("My Project 16547"):
- Enterprise edition: **on** (required to attach a Website data store)
- Generative Responses: **off** (plain results, no AI summaries)
- Location: `global`

A **Website Content** data store (`aiblocks-data-store_1783423619148`) was
attached, with:
- Advanced website indexing: **off** (not needed for parity; also the sites
  searched aren't owned by this project, so domain verification isn't
  possible)
- "Exclude from generative AI features": **checked**
- Pricing: **General** (standard consumption-based billing)
- Sites to include: the existing site-restriction list (`agent37.com/*`,
  `aihero.dev/*`, `aiskill.market/*`, `claude-plugins.dev/*`,
  `claudemarketplaces.com/*`, `claudeskills.ai/*`, `claudeskill.site/*`,
  `claudeskillhub.com/*`, `claudeskills.info/*`, `claudeskillsmarket.com/*`,
  `crossaitools.com/*`, `huggingface.co/*`, `mcpservers.org/*`,
  `skills.pawgrammer.com/*`, `skills.pub/*`, `skillsdirectory.org/*`,
  `skillstore.io/*`, `dev.to/*`)

App/Engine ID: `aiblocks_1783423314341`. An API key was created (no
service-account binding — not needed/supported for Discovery Engine) and
restricted to the Discovery Engine API.

Verified live via:
```
POST https://discoveryengine.googleapis.com/v1/projects/808359232572/locations/global/collections/default_collection/engines/aiblocks_1783423314341/servingConfigs/default_search:searchLite?key=API_KEY
Body: {"query": "..."}
```

## API shape

**Request:** `POST` to
`https://discoveryengine.googleapis.com/v1/projects/{projectId}/locations/global/collections/default_collection/engines/{engineId}/servingConfigs/default_search:searchLite?key={apiKey}`,
JSON body `{ "query": "<query>" }`. No URL-encoding of the query needed (it's
in the JSON body, not the URL).

**Response (confirmed from a live call):**
```jsonc
{
  "results": [
    {
      "document": {
        "derivedStructData": {
          "title": "...",
          "link": "https://...",
          "snippets": [{ "snippet": "...", "htmlSnippet": "..." }],
          // ...displayLink, formattedUrl, pagemap, etc. — unused
        }
      }
    }
  ]
}
```
Some results omit `title`/`link` entirely (observed in live data — a result
with only `pagemap`/`snippets`/`displayLink`). These must be filtered out
since `title`/`url` are required fields on this app's `SearchResult` type.

**Errors:** shape is `{ "error": { "code": ..., "message": ..., "status": ... } }`
— close enough to the old CSE error shape that the existing
`errBody.error?.message` extraction and `Google search failed: <status> — <message>`
error format carry over unchanged.

## Config changes

`src/lib/config.ts` — replace:
```ts
googleApiKey?: string;   // GOOGLE_CSE_API_KEY  ->  GOOGLE_SEARCH_API_KEY
googleCx?: string;       // GOOGLE_CSE_CX       ->  (removed)
```
with:
```ts
googleApiKey?: string;    // GOOGLE_SEARCH_API_KEY
googleProjectId?: string; // GOOGLE_SEARCH_PROJECT_ID  (808359232572)
googleEngineId?: string;  // GOOGLE_SEARCH_ENGINE_ID   (aiblocks_1783423314341)
```

## Adapter changes

`src/lib/adapters/google.ts`:
- `createGoogleAdapter(deps: { fetchFn?; apiKey?; projectId?; engineId? })`
- `isEnabled()` → `Boolean(apiKey && projectId && engineId)`
- `search(query)` → POST to the `searchLite` URL above with `{ query }` body;
  same error handling as today; map `body.results` through
  `document.derivedStructData`, filtering out entries missing `title` or
  `link`, then to `SearchResult { title, url, githubUrl, description, source }`
  — `githubUrlOf` logic unchanged.

`src/lib/adapters/index.ts` — update the `createGoogleAdapter(...)` call site
to pass `projectId`/`engineId` instead of `cx`.

## Testing

- `config.test.ts` — update env var names and assertions.
- `google.test.ts` — update mocked payloads to the Discovery Engine
  `results[].document.derivedStructData` shape; add a case covering a result
  missing `title`/`link` being filtered out; keep the existing error-handling
  tests (shape is compatible, only need to adjust the deps passed to the
  adapter constructor).

No other files reference `GOOGLE_CSE_*` or `googleCx`, so this is a
self-contained migration.
