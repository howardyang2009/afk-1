import { z } from 'zod';
import { getConfig } from '@/lib/config';
import { createAdapters, selectAdapters } from '@/lib/adapters';
import { runSearch } from '@/lib/search/orchestrator';

const RequestSchema = z.object({
  type: z.enum(['skill', 'agent', 'prompt', 'mcp']),
  query: z.string().trim().min(1),
});

export async function POST(request: Request): Promise<Response> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid request: provide a type and a non-empty query' }, { status: 400 });
  }

  const { type, query } = parsed.data;
  const adapters = selectAdapters(createAdapters(getConfig()), type);
  const response = await runSearch(adapters, query, type);
  return Response.json(response);
}
