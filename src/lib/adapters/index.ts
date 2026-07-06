import type { AppConfig } from '../config.js';
import { createGithubAdapter } from './github.js';
import { createGoogleAdapter } from './google.js';
import { createSkillsmpAdapter } from './skillsmp.js';
import { createSmitheryAdapter } from './smithery.js';
import type { ComponentType, FetchLike, SearchAdapter } from './types.js';

export function createAdapters(config: AppConfig, fetchFn?: FetchLike): SearchAdapter[] {
  return [
    createGithubAdapter({ fetchFn, token: config.githubToken }),
    createSkillsmpAdapter({ fetchFn, apiKey: config.skillsmpKey }),
    createSmitheryAdapter({ fetchFn, apiKey: config.smitheryKey }),
    createGoogleAdapter({ fetchFn, apiKey: config.googleApiKey, cx: config.googleCx }),
  ];
}

export function selectAdapters(
  adapters: SearchAdapter[],
  type: ComponentType,
): SearchAdapter[] {
  return adapters.filter((adapter) => adapter.supports(type));
}
