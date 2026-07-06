import type { SearchResult } from '../adapters/types';

function canonicalKey(result: SearchResult): string {
  const raw = result.githubUrl ?? result.url;
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, '').toLowerCase();
    let path = u.pathname.replace(/\/+$/, '');
    if (host === 'github.com') {
      const parts = path.split('/').filter(Boolean);
      path = '/' + parts.slice(0, 2).join('/');
    }
    return host + path.toLowerCase();
  } catch {
    return raw.toLowerCase();
  }
}

function merge(a: SearchResult, b: SearchResult): SearchResult {
  return {
    ...a,
    githubUrl: a.githubUrl ?? b.githubUrl,
    description: a.description ?? b.description,
    stars: a.stars ?? b.stars,
  };
}

export function dedupe(results: SearchResult[]): SearchResult[] {
  const map = new Map<string, SearchResult>();
  for (const result of results) {
    const key = canonicalKey(result);
    const existing = map.get(key);
    map.set(key, existing ? merge(existing, result) : result);
  }
  return [...map.values()];
}
