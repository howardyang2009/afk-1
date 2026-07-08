import type { AppConfig } from '../config';
import { createBraveAdapter } from './brave';
import { createClaudePluginHubAdapter } from './claude-plugin-hub';
import { createClaudePluginsDevAdapter } from './claude-plugins-dev';
import { createClaudeSkillsInfoAdapter } from './claude-skills-info';
import { createGithubAdapter } from './github';
import { createGoogleAdapter } from './google';
import { createHuggingfaceAdapter } from './huggingface';
import { createSkillsmpAdapter } from './skillsmp';
import { createSkillsPawgrammerAdapter } from './skills-pawgrammer';
import { createSkillsShAdapter } from './skills-sh';
import { createSmitheryAdapter } from './smithery';
import type { ComponentType, FetchLike, SearchAdapter } from './types';

export function createAdapters(config: AppConfig, fetchFn?: FetchLike): SearchAdapter[] {
  return [
    createGithubAdapter({ fetchFn, token: config.githubToken }),
    createSkillsmpAdapter({ fetchFn, apiKey: config.skillsmpKey }),
    createSmitheryAdapter({ fetchFn, apiKey: config.smitheryKey }),
    createGoogleAdapter({
      fetchFn,
      apiKey: config.googleApiKey,
      projectId: config.googleProjectId,
      engineId: config.googleEngineId,
    }),
    createBraveAdapter({ fetchFn, apiKey: config.braveKey }),
    createHuggingfaceAdapter({ fetchFn, token: config.huggingfaceToken }),
    //createClaudePluginsDevAdapter({ fetchFn }),
    //createClaudePluginHubAdapter({ fetchFn }),
    createClaudeSkillsInfoAdapter({ fetchFn }),
    createSkillsShAdapter({ fetchFn, token: config.skillsShToken }),
    createSkillsPawgrammerAdapter({ fetchFn }),
  ];
}

export function selectAdapters(
  adapters: SearchAdapter[],
  type: ComponentType,
): SearchAdapter[] {
  return adapters.filter((adapter) => adapter.supports(type));
}
