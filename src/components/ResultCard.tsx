import type { SearchResult } from '@/lib/adapters/types';

export function ResultCard({ result }: { result: SearchResult }) {
  return (
    <div className="card">
      <a href={result.url} target="_blank" rel="noreferrer">{result.title}</a>
      <span className="badge">{result.source}</span>
      {typeof result.stars === 'number' && <span className="badge">★ {result.stars}</span>}
      {result.description && <div className="desc">{result.description}</div>}
    </div>
  );
}
