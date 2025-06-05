import axios, { AxiosError } from 'axios';
import { getAuth } from 'firebase/auth';
import type { BlogPost, Category, User, ApiError } from './types';
import type {
  PostListResponse,
  LLMProvider,
  GeneratePostParams,
} from './api-types';

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError;
    throw new HttpError(
      error.response?.status || 500,
      apiError?.message || 'An unexpected error occurred'
    );
  }
  throw error;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Firebase token to requests
api.interceptors.request.use(async (config) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error adding auth token:', error);
  }
  return config;
});

export const BlogAPI = {
  getPosts: async (params: {
    category?: string;
    status?: 'draft' | 'published';
    featured?: boolean;
    author?: string;
    tag?: string;
    page?: number;
    limit?: number;
  }): Promise<PostListResponse> => {
    try {
      const { data } = await api.get('/blog/posts', { params });
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getPost: async (id: string): Promise<BlogPost> => {
    try {
      const { data } = await api.get(`/blog/posts/${id}`);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createPost: async (post: Omit<BlogPost, '_id'>): Promise<BlogPost> => {
    try {
      const { data } = await api.post('/blog/posts', post);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updatePost: async (id: string, post: Partial<BlogPost>): Promise<BlogPost> => {
    try {
      const { data } = await api.put(`/blog/posts/${id}`, post);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deletePost: async (id: string): Promise<void> => {
    try {
      await api.delete(`/blog/posts/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  generatePost: async (params: GeneratePostParams): Promise<BlogPost> => {
    try {
      const { data } = await api.post('/blog/generate-post', params);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getAvailableModels: async (): Promise<LLMProvider[]> => {
    try {
      const { data } = await api.get('/blog/models');
      return data || [];
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    try {
      const { data } = await api.get('/categories');
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createCategory: async (category: Omit<Category, '_id'>): Promise<Category> => {
    try {
      const { data } = await api.post('/categories', category);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateCategory: async (id: string, category: Partial<Category>): Promise<Category> => {
    try {
      const { data } = await api.put(`/categories/${id}`, category);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    try {
      await api.delete(`/categories/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Auth
  verifyToken: async (idToken: string): Promise<{ user: User }> => {
    try {
      const { data } = await api.post('/auth/verify-token', { idToken });
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getProfile: async (): Promise<{ user: User }> => {
    try {
      const { data } = await api.get('/auth/profile');
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
    throw new Error('Unreachable');
  },

  updateProfile: async (profile: Partial<User>): Promise<{ user: User }> => {
    try {
      const { data } = await api.put('/auth/profile', profile);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
