import { describe, expect, it } from 'vitest';
import { createAdapters, selectAdapters } from './index';

describe('adapter registry', () => {
  it('creates github, skillsmp, smithery, google, brave, huggingface, claude-plugins-dev and claude-plugin-hub adapters', () => {
    const ids = createAdapters({}).map((a) => a.id).sort();
    expect(ids).toEqual([
      'brave',
      'claude-plugin-hub',
      'claude-plugins-dev',
      'github',
      'google',
      'huggingface',
      'skillsmp',
      'smithery',
    ]);
  });

  it('routes skill to skillsmp + github + google + brave + claude-plugins-dev + claude-plugin-hub (google/brave disabled by default)', () => {
    const adapters = createAdapters({});
    const ids = selectAdapters(adapters, 'skill').map((a) => a.id).sort();
    expect(ids).toEqual(['brave', 'claude-plugin-hub', 'claude-plugins-dev', 'github', 'google', 'skillsmp']);
  });

  it('routes claude-plugin to github + google + brave + claude-plugins-dev + claude-plugin-hub', () => {
    const ids = selectAdapters(createAdapters({}), 'claude-plugin').map((a) => a.id).sort();
    expect(ids).toEqual(['brave', 'claude-plugin-hub', 'claude-plugins-dev', 'github', 'google']);
  });

  it('routes model to huggingface + github + google + brave', () => {
    const ids = selectAdapters(createAdapters({}), 'model').map((a) => a.id).sort();
    expect(ids).toEqual(['brave', 'github', 'google', 'huggingface']);
  });

  it('routes mcp to smithery + github + google + brave + claude-plugin-hub', () => {
    const ids = selectAdapters(createAdapters({}), 'mcp').map((a) => a.id).sort();
    expect(ids).toEqual(['brave', 'claude-plugin-hub', 'github', 'google', 'smithery']);
  });

  it('routes agent to github + google + brave + claude-plugin-hub', () => {
    const ids = selectAdapters(createAdapters({}), 'agent').map((a) => a.id).sort();
    expect(ids).toEqual(['brave', 'claude-plugin-hub', 'github', 'google']);
  });

  it('routes prompt to github + google + brave', () => {
    const ids = selectAdapters(createAdapters({}), 'prompt').map((a) => a.id).sort();
    expect(ids).toEqual(['brave', 'github', 'google']);
  });

  it('routes hook to github + google + brave + claude-plugin-hub', () => {
    const ids = selectAdapters(createAdapters({}), 'hook').map((a) => a.id).sort();
    expect(ids).toEqual(['brave', 'claude-plugin-hub', 'github', 'google']);
  });

  it('routes slash-command to github + google + brave + claude-plugin-hub', () => {
    const ids = selectAdapters(createAdapters({}), 'slash-command').map((a) => a.id).sort();
    expect(ids).toEqual(['brave', 'claude-plugin-hub', 'github', 'google']);
  });
});
