// Base types
export interface Author {
  name: string;
  avatarUrl?: string;
  role?: 'admin' | 'editor' | 'viewer';
}

export interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  summary: string;
  imageUrl?: string;
  tags: string[];
  sourceUrl?: string;
  category: string;
  featured: boolean;
  publishDate: string;
  author: 'admin' | 'ai' | Author;
  status: 'draft' | 'published';
}

export type SafetyThreshold = 
  | 'BLOCK_NONE'
  | 'BLOCK_LOW_AND_ABOVE'
  | 'BLOCK_MEDIUM_AND_ABOVE'
  | 'BLOCK_HIGH_AND_ABOVE';

export type HarmCategory =
  | 'HARM_CATEGORY_HATE_SPEECH'
  | 'HARM_CATEGORY_SEXUALLY_EXPLICIT'
  | 'HARM_CATEGORY_HARASSMENT'
  | 'HARM_CATEGORY_DANGEROUS_CONTENT'
  | 'HARM_CATEGORY_CIVIC_INTEGRITY';

export interface SafetySetting {
  category: HarmCategory;
  threshold: SafetyThreshold;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  sourceUrls: Array<{
    url: string;
    description?: string;
    priority: number;
  }>;
  isActive: boolean;
}

// API Response types
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PostListResponse {
  posts: BlogPost[];
  pagination: PaginationInfo;
}

export interface ApiError {
  status: 'error' | 'fail';
  message: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}

// API Request types
export interface GeneratePostParams {
  keyword: string;
  sourceUrl?: string;
  instruction?: string;
  category: string;
  provider?: 'openai' | 'gemini' | 'groq';
  model?: string;
}

export interface PostFilters {
  category?: string;
  status?: 'draft' | 'published';
  featured?: boolean;
  author?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'admin' | 'editor' | 'viewer';
}
