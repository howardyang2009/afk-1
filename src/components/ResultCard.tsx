import type { SearchResult } from '@/lib/adapters/types';

export function ResultCard({ result }: { result: SearchResult }) {
  return (
    <div className="card">
      <a href={result.url} target="_blank" rel="noreferrer">{result.title}</a>
      {(result.sources ?? [result.source]).map((s) => (
        <span key={s} className="badge">{s}</span>
      ))}
      {typeof result.stars === 'number' && <span className="badge">★ {result.stars}</span>}
      {result.description && <div className="desc">{result.description}</div>}
    </div>
  );
}
