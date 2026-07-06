'use client';

import { useMemo, useState } from 'react';
import type { AdapterId, ComponentType, SearchResult, SourceStatus, SearchResponse } from '@/lib/types';
import { SearchForm } from '@/components/SearchForm';
import { SourceFilter } from '@/components/SourceFilter';
import { ResultsList } from '@/components/ResultsList';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [active, setActive] = useState<AdapterId | 'all'>('all');

  async function onSearch(type: ComponentType, query: string) {
    setLoading(true);
    setError(null);
    setActive('all');
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type, query }),
      });
      if (!res.ok) throw new Error(`Search failed (${res.status})`);
      setData((await res.json()) as SearchResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  const sourceIds = useMemo<AdapterId[]>(
    () => (data ? data.sources.filter((s) => s.status === 'ok' && s.count > 0).map((s) => s.source) : []),
    [data],
  );

  const visible = useMemo(
    () => (data ? data.results.filter((r) => active === 'all' || (r.sources ?? [r.source]).includes(active)) : []),
    [data, active],
  );

  return (
    <main>
      <h1>AI Component Search</h1>
      <p>Find skills, agents, prompts, and MCP servers across AI marketplaces and GitHub.</p>
      <SearchForm loading={loading} onSearch={onSearch} />

      {error && <p className="status" style={{ color: '#b00' }}>{error}</p>}

      {data && (
        <>
          <div className="status">
            {data.sources.map((s) => (
              <span key={s.source} style={{ marginRight: 12 }}>
                {s.source}: {s.status === 'ok' ? `${s.count}` : s.status}
                {s.source === 'google' && s.status === 'disabled' ? ' (add API key)' : ''}
              </span>
            ))}
          </div>
          <SourceFilter sources={sourceIds} active={active} onToggle={setActive} />
          <ResultsList results={visible} />
        </>
      )}
    </main>
  );
}
