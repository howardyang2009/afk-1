import type { SearchResult } from '@/lib/adapters/types';
import { ResultCard } from './ResultCard';

export function ResultsList({ results }: { results: SearchResult[] }) {
  if (results.length === 0) return <p className="status">No results.</p>;
  return (
    <div>
      {results.map((result) => (
        <ResultCard key={`${result.source}:${result.url}`} result={result} />
      ))}
    </div>
  );
}
