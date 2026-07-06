import type { AdapterId, SearchResult } from '../adapters/types';

const SOURCE_WEIGHT: Record<AdapterId, number> = {
  skillsmp: 3,
  smithery: 3,
  github: 2,
  google: 1,
};

function score(result: SearchResult): number {
  return SOURCE_WEIGHT[result.source] * 1000 + Math.min(result.stars ?? 0, 999);
}

export function rank(results: SearchResult[]): SearchResult[] {
  return [...results].sort((a, b) => score(b) - score(a));
}
