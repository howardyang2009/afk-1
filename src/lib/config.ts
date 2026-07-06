export interface AppConfig {
  githubToken?: string;
  skillsmpKey?: string;
  smitheryKey?: string;
  googleApiKey?: string;
  googleCx?: string;
}

export function getConfig(): AppConfig {
  return {
    githubToken: process.env.GITHUB_TOKEN || undefined,
    skillsmpKey: process.env.SKILLSMP_API_KEY || undefined,
    smitheryKey: process.env.SMITHERY_API_KEY || undefined,
    googleApiKey: process.env.GOOGLE_CSE_API_KEY || undefined,
    googleCx: process.env.GOOGLE_CSE_CX || undefined,
  };
}
