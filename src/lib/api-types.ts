import type { BlogPost, Category, User, ApiError } from './types';

// API Response Types
export interface AuthResponse {
  user: User;
}

export interface PostListResponse {
  posts: BlogPost[];
  pagination: PaginationInfo;
}

export interface LLMProvider {
  provider: 'openai' | 'gemini' | 'groq';
  models: string[];
  default: string;
}

// API Request Types
export interface PostFilters {
  category?: string;
  status?: 'draft' | 'published';
  featured?: boolean;
  author?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

export interface GeneratePostParams {
  keyword: string;
  sourceUrl?: string;
  instruction?: string;
  category: string;
  provider?: 'openai' | 'gemini' | 'groq';
  model?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
