import { describe, expect, it } from 'vitest';
import { POST } from './route';

function post(body: unknown): Request {
  return new Request('http://localhost/api/search', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/search', () => {
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
