'use client';

import { useState } from 'react';
import type { ComponentType } from '@/lib/adapters/types';

const TYPES: { value: ComponentType; label: string }[] = [
  { value: 'skill', label: 'Skill' },
  { value: 'agent', label: 'Agent' },
  { value: 'prompt', label: 'Prompt' },
  { value: 'mcp', label: 'MCP server' },
  { value: 'model', label: 'Model' },
  { value: 'claude-plugin', label: 'Claude Plugin' },
];

export function SearchForm({
  loading,
  onSearch,
}: {
  loading: boolean;
  onSearch: (type: ComponentType, query: string) => void;
}) {
  const [type, setType] = useState<ComponentType>('skill');
  const [query, setQuery] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (query.trim()) onSearch(type, query.trim());
      }}
    >
      <div className="controls">
        <select value={type} onChange={(e) => setType(e.target.value as ComponentType)}>
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <textarea
        placeholder="Describe the AI component you're looking for…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="controls">
        <button type="submit" disabled={loading || !query.trim()}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>
    </form>
  );
}
