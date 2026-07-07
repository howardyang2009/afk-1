export interface AppConfig {
  githubToken?: string;
  skillsmpKey?: string;
  smitheryKey?: string;
  googleApiKey?: string;
  googleProjectId?: string;
  googleEngineId?: string;
  braveKey?: string;
  huggingfaceToken?: string;
}

export function getConfig(): AppConfig {
  return {
    githubToken: process.env.GITHUB_TOKEN || undefined,
    skillsmpKey: process.env.SKILLSMP_API_KEY || undefined,
    smitheryKey: process.env.SMITHERY_API_KEY || undefined,
    googleApiKey: process.env.GOOGLE_SEARCH_API_KEY || undefined,
    googleProjectId: process.env.GOOGLE_SEARCH_PROJECT_ID || undefined,
    googleEngineId: process.env.GOOGLE_SEARCH_ENGINE_ID || undefined,
    braveKey: process.env.BRAVE_SEARCH_API_KEY || undefined,
    huggingfaceToken: process.env.HUGGINGFACE_API_TOKEN || undefined,
  };
}
