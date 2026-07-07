import { afterEach, describe, expect, it } from 'vitest';
import { getConfig } from './config';

describe('getConfig', () => {
  const saved = { ...process.env };
  afterEach(() => {
    process.env = { ...saved };
  });

  it('reads adapter keys from the environment', () => {
    process.env.GITHUB_TOKEN = 'gh';
    process.env.SMITHERY_API_KEY = 'sm';
    process.env.GOOGLE_SEARCH_API_KEY = 'gk';
    process.env.GOOGLE_SEARCH_PROJECT_ID = 'proj';
    process.env.GOOGLE_SEARCH_ENGINE_ID = 'engine';
    const cfg = getConfig();
    expect(cfg.githubToken).toBe('gh');
    expect(cfg.smitheryKey).toBe('sm');
    expect(cfg.googleApiKey).toBe('gk');
    expect(cfg.googleProjectId).toBe('proj');
    expect(cfg.googleEngineId).toBe('engine');
  });

  it('leaves missing keys undefined', () => {
    delete process.env.SKILLSMP_API_KEY;
    expect(getConfig().skillsmpKey).toBeUndefined();
  });
});
