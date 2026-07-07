import type { FetchLike, SearchAdapter, SearchResult } from './types';

interface GoogleItem {
  title: string;
  link: string;
  snippet?: string;
}

function githubUrlOf(link: string): string | undefined {
  try {
    return new URL(link).hostname.replace(/^www\./, '') === 'github.com' ? link : undefined;
  } catch {
    return undefined;
  }
}

export function createGoogleAdapter(
  deps: { fetchFn?: FetchLike; apiKey?: string; cx?: string } = {},
): SearchAdapter {
  const fetchFn = deps.fetchFn ?? fetch;
  return {
    id: 'google',
    supports: () => true,
    isEnabled: () => Boolean(deps.apiKey && deps.cx),
    async search(query: string): Promise<SearchResult[]> {
      const q = encodeURIComponent(query);
      const res = await fetchFn(
        `https://www.googleapis.com/customsearch/v1?key=${deps.apiKey}&cx=${deps.cx}&q=${q}`,
      );
      if (!res.ok) {
        let detail = '';
        try {
          const errBody = (await res.json()) as { error?: { message?: string } };
          detail = errBody.error?.message ?? '';
        } catch {
          // response body wasn't JSON (or empty) — fall back to status only
        }
        throw new Error(`Google search failed: ${res.status}${detail ? ` — ${detail}` : ''}`);
      }
      const body = (await res.json()) as { items?: GoogleItem[] };
      return (body.items ?? []).map((item) => ({
        title: item.title,
        url: item.link,
        githubUrl: githubUrlOf(item.link),
        description: item.snippet,
        source: 'google' as const,
      }));
    },
  };
}
