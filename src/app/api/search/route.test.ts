import { describe, expect, it, vi, afterEach } from 'vitest';
import { POST } from './route';

function post(body: unknown): Request {
  return new Request('http://localhost/api/search', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/search', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns 200 with results and sources arrays on a valid request (stubbed fetch)', async () => {
    vi.stubGlobal('fetch', async () => ({
      ok: true,
      status: 200,
      json: async () => ({ items: [], data: { skills: [] } }),
    }));
    const res = await POST(post({ type: 'skill', query: 'pdf' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.results)).toBe(true);
    expect(Array.isArray(body.sources)).toBe(true);
  });

  it('rejects a missing query with 400', async () => {
    const res = await POST(post({ type: 'skill' }));
    expect(res.status).toBe(400);
  });

  it('rejects an unknown component type with 400', async () => {
    const res = await POST(post({ type: 'banana', query: 'x' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid JSON', async () => {
    const bad = new Request('http://localhost/api/search', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'not json',
    });
    const res = await POST(bad);
    expect(res.status).toBe(400);
  });
});
