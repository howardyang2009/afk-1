'use client';

import { useState } from 'react';
import type { SearchResult } from '@/lib/adapters/types';

const MAX_DESC_CHARS = 1024;
const TOP_BUTTON_MIN_CHARS = 4096;

export function ResultCard({ result }: { result: SearchResult }) {
  const [expanded, setExpanded] = useState(false);
  const description = result.description ?? '';
  const isLong = description.length > MAX_DESC_CHARS;
  const isVeryLong = description.length > TOP_BUTTON_MIN_CHARS;
  const shown = expanded || !isLong ? description : `${description.slice(0, MAX_DESC_CHARS)}…`;

  return (
    <div className="card">
      <a href={result.url} target="_blank" rel="noreferrer">{result.title}</a>
      {(result.sources ?? [result.source]).map((s) => (
        <span key={s} className="badge">{s}</span>
      ))}
      {typeof result.stars === 'number' && <span className="badge">★ {result.stars}</span>}
      {isVeryLong && expanded && (
        <button type="button" className="link-btn" onClick={() => setExpanded(false)}>
          Show less
        </button>
      )}
      {description && (
        <div className="desc">
          <span className={expanded ? '' : 'desc-clamped'}>{shown}</span>
          {isLong && (
            <button type="button" className="link-btn" onClick={() => setExpanded((v) => !v)}>
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
