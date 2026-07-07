import { describe, expect, it, vi } from 'vitest';
import { createGoogleAdapter } from './google';

function mockFetch(payload: unknown, ok = true, status = 200) {
  return vi.fn(async () => ({ ok, status, json: async () => payload })) as unknown as typeof fetch;
}

describe('createGoogleAdapter', () => {
  it('is disabled unless both apiKey and cx are set', () => {
    expect(createGoogleAdapter({ apiKey: 'k' }).isEnabled()).toBe(false);
    expect(createGoogleAdapter({ cx: 'c' }).isEnabled()).toBe(false);
    expect(createGoogleAdapter({ apiKey: 'k', cx: 'c' }).isEnabled()).toBe(true);
  });

  it('maps items and marks github links', async () => {
    const fetchFn = mockFetch({
      items: [
        { title: 'Foo', link: 'https://github.com/foo/bar', snippet: 'a repo' },
        { title: 'Blog', link: 'https://example.com/post', snippet: 'text' },
      ],
    });
    const adapter = createGoogleAdapter({ fetchFn, apiKey: 'k', cx: 'c' });
    const results = await adapter.search('foo', 'prompt');
    expect(results[0]).toEqual({
      title: 'Foo', url: 'https://github.com/foo/bar', githubUrl: 'https://github.com/foo/bar', description: 'a repo', source: 'google',
    });
    expect(results[1].githubUrl).toBeUndefined();
  });

  it('includes the API error message when the request fails', async () => {
    const fetchFn = mockFetch(
      { error: { code: 403, message: 'This project does not have the access to Custom Search JSON API.' } },
      false,
      403,
    );
    const adapter = createGoogleAdapter({ fetchFn, apiKey: 'k', cx: 'c' });
    await expect(adapter.search('foo', 'prompt')).rejects.toThrow(
      'Google search failed: 403 — This project does not have the access to Custom Search JSON API.',
    );
  });

  it('falls back to status only when the error body is not JSON', async () => {
    const fetchFn = vi.fn(async () => ({
      ok: false,
      status: 500,
      json: async () => { throw new Error('not json'); },
    })) as unknown as typeof fetch;
    const adapter = createGoogleAdapter({ fetchFn, apiKey: 'k', cx: 'c' });
    await expect(adapter.search('foo', 'prompt')).rejects.toThrow('Google search failed: 500');
  });
});
