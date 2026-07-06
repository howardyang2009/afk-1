'use client';

import type { AdapterId } from '@/lib/adapters/types';

export function SourceFilter({
  sources,
  active,
  onToggle,
}: {
  sources: AdapterId[];
  active: AdapterId | 'all';
  onToggle: (id: AdapterId | 'all') => void;
}) {
  if (sources.length === 0) return null;
  const options: (AdapterId | 'all')[] = ['all', ...sources];
  return (
    <div className="chips">
      {options.map((id) => (
        <button
          key={id}
          type="button"
          className={`chip ${active === id ? 'active' : ''}`}
          onClick={() => onToggle(id)}
        >
          {id}
        </button>
      ))}
    </div>
  );
}
