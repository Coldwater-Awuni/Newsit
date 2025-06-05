import { type BlogPost, type User } from '../types';

export type { BlogPost };

export interface Category {
    _id: string;
    name: string;
    description?: string;
    sourceUrls: Array<{
        url: string;
        description?: string;
        priority: number;
    }>;
    isActive: boolean;
}

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

export interface GeneratePostParams {
    keyword: string;
    sourceUrl?: string;
    instruction?: string;
    category: string;
    provider?: 'openai' | 'gemini' | 'groq';
    model?: string;
}

export interface SafetySetting {
    category: string;
    threshold: 'BLOCK_NONE' | 'BLOCK_LOW_AND_ABOVE' | 'BLOCK_MEDIUM_AND_ABOVE' | 'BLOCK_HIGH_AND_ABOVE';
}

export interface LLMProvider {
    provider: 'openai' | 'gemini' | 'groq';
    models: string[];
    default: string;
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
