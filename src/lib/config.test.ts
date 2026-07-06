import { afterEach, describe, expect, it } from 'vitest';
import { getConfig } from './config.js';

describe('getConfig', () => {
  const saved = { ...process.env };
  afterEach(() => {
    process.env = { ...saved };
  });

  it('reads adapter keys from the environment', () => {
    process.env.GITHUB_TOKEN = 'gh';
    process.env.SMITHERY_API_KEY = 'sm';
    process.env.GOOGLE_CSE_API_KEY = 'gk';
    process.env.GOOGLE_CSE_CX = 'cx';
    const cfg = getConfig();
    expect(cfg.githubToken).toBe('gh');
    expect(cfg.smitheryKey).toBe('sm');
    expect(cfg.googleApiKey).toBe('gk');
    expect(cfg.googleCx).toBe('cx');
  });

  it('leaves missing keys undefined', () => {
    delete process.env.SKILLSMP_API_KEY;
    expect(getConfig().skillsmpKey).toBeUndefined();
  });
});
