import { describe, expect, it } from 'vitest';
import { createAdapters, selectAdapters } from './index';

describe('adapter registry', () => {
  it('creates all four adapters', () => {
    const ids = createAdapters({}).map((a) => a.id).sort();
    expect(ids).toEqual(['github', 'google', 'skillsmp', 'smithery']);
  });

  it('routes skill to skillsmp + github + google (google disabled by default)', () => {
    const adapters = createAdapters({});
    const ids = selectAdapters(adapters, 'skill').map((a) => a.id).sort();
    expect(ids).toEqual(['github', 'google', 'skillsmp']);
  });

  it('routes mcp to smithery + github + google', () => {
    const ids = selectAdapters(createAdapters({}), 'mcp').map((a) => a.id).sort();
    expect(ids).toEqual(['github', 'google', 'smithery']);
  });

  it('routes agent to smithery + github + google', () => {
    const ids = selectAdapters(createAdapters({}), 'agent').map((a) => a.id).sort();
    expect(ids).toEqual(['github', 'google', 'smithery']);
  });

  it('routes prompt to github + google only', () => {
    const ids = selectAdapters(createAdapters({}), 'prompt').map((a) => a.id).sort();
    expect(ids).toEqual(['github', 'google']);
  });
});
