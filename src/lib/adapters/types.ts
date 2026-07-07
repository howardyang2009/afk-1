export type ComponentType = 'skill' | 'agent' | 'prompt' | 'mcp' | 'model';
export type AdapterId = 'github' | 'smithery' | 'skillsmp' | 'google' | 'brave' | 'huggingface';

export interface SearchResult {
  title: string;
  url: string;
  githubUrl?: string;
  description?: string;
  source: AdapterId;
  sources?: AdapterId[];
  stars?: number;
}

export interface SearchAdapter {
  id: AdapterId;
  supports(type: ComponentType): boolean;
  isEnabled(): boolean;
  search(query: string, type: ComponentType): Promise<SearchResult[]>;
}

export type FetchLike = typeof fetch;
