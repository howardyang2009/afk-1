import { describe, expect, it } from 'vitest';
import { createAdapters, selectAdapters } from './index';

describe('adapter registry', () => {
  it('creates github, skillsmp, google, brave and huggingface adapters', () => {
    const ids = createAdapters({}).map((a) => a.id).sort();
    expect(ids).toEqual(['brave', 'github', 'google', 'huggingface', 'skillsmp']);
  });

  it('routes skill to skillsmp + github + google + brave (google/brave disabled by default)', () => {
    const adapters = createAdapters({});
    const ids = selectAdapters(adapters, 'skill').map((a) => a.id).sort();
    expect(ids).toEqual(['brave', 'github', 'google', 'skillsmp']);
  });

  it('routes model to huggingface + github + google + brave', () => {
    const ids = selectAdapters(createAdapters({}), 'model').map((a) => a.id).sort();
    expect(ids).toEqual(['brave', 'github', 'google', 'huggingface']);
  });

  it('routes mcp to github + google + brave', () => {
    const ids = selectAdapters(createAdapters({}), 'mcp').map((a) => a.id).sort();
    expect(ids).toEqual(['brave', 'github', 'google']);
  });

  it('routes agent to github + google + brave', () => {
    const ids = selectAdapters(createAdapters({}), 'agent').map((a) => a.id).sort();
    expect(ids).toEqual(['brave', 'github', 'google']);
  });

  it('routes prompt to github + google + brave', () => {
    const ids = selectAdapters(createAdapters({}), 'prompt').map((a) => a.id).sort();
    expect(ids).toEqual(['brave', 'github', 'google']);
  });
});
