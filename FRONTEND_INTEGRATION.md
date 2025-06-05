# News-it API Frontend Integration Guide

## Base URLs
```
Development: http://localhost:3000/api
Production: https://your-production-url.com/api
```

## Authentication

Uses Firebase Authentication. All protected routes require a Firebase ID token in the Authorization header.

### Setup
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
```

### Authentication Flow
1. Authenticate with Firebase (email/password or Google)
2. Get Firebase ID token
3. Send token to backend for verification
4. Include token in all subsequent API requests

## Data Models

### User
```typescript
interface User {
    email: string;
    role: 'admin' | 'user';
    displayName?: string;
    photoURL?: string;
}
```

### Post
```typescript
interface Post {
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
    publishDate: Date;
    author: 'admin' | 'ai' | {
        name: string;
        avatarUrl?: string;
    };
    status: 'draft' | 'published';
}
```

### Category
```typescript
interface Category {
    name: string;
    description?: string;
    sourceUrls: Array<{
        url: string;
        description?: string;
        priority: number;
    }>;
    isActive: boolean;
}
```

## API Endpoints

### Authentication
- **POST** `/api/auth/verify-token`
  - Body: `{ idToken: string }`
  - Returns: User profile

- **GET** `/api/auth/profile`
  - Protected: Yes
  - Returns: User profile

- **PUT** `/api/auth/profile`
  - Protected: Yes
  - Body: `{ displayName?: string, photoURL?: string }`
  - Returns: Updated profile

### Blog Posts
- **GET** `/api/blog/posts`
  - Query params: 
    ```typescript
    {
      category?: string;
      status?: 'draft' | 'published';
      featured?: boolean;
      author?: string;
      tag?: string;
      page?: number;
      limit?: number;
    }
    ```
  - Returns: `{ posts: Post[], pagination: PaginationInfo }`

- **GET** `/api/blog/posts/:id`
  - Returns: Single post with full content

- **POST** `/api/blog/posts` (Protected)
  - Body: Post data without _id
  - Returns: Created post

- **PUT** `/api/blog/posts/:id` (Protected)
  - Body: Partial post data
  - Returns: Updated post

- **DELETE** `/api/blog/posts/:id` (Protected, Admin only)
  - Returns: 204 No Content

- **GET** `/api/blog/models`
  - Protected: No
  - Returns: Available LLM models for content generation
    ```typescript
    interface LLMProvider {
        provider: 'openai' | 'gemini' | 'groq';
        models: string[];
        default: string;
    }
    ```

- **POST** `/api/blog/generate-post` (Protected)
  - Body: 
    ```typescript
    {
      keyword: string;
      sourceUrl?: string;
      instruction?: string;
      category: string;
      provider?: 'openai' | 'gemini' | 'groq';
      model?: string;  // Model ID from the specific provider
    }
    ```
  - Returns: Generated post

### Categories
- **GET** `/api/categories`
  - Returns: All categories

- **GET** `/api/categories/:id`
  - Returns: Single category

- **POST** `/api/categories` (Protected, Admin only)
  - Body: Category data
  - Returns: Created category

- **PUT** `/api/categories/:id` (Protected, Admin only)
  - Body: Partial category data
  - Returns: Updated category

- **DELETE** `/api/categories/:id` (Protected, Admin only)
  - Returns: 204 No Content

## Example API Client Setup

```typescript
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

// Add Firebase token to requests
api.interceptors.request.use(async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle auth errors
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Handle unauthorized (sign out user)
        }
        return Promise.reject(error);
    }
);
```

## Error Handling

All endpoints return errors in this format:
```typescript
interface ApiError {
    status: 'error' | 'fail';
    message: string;
    errors?: Array<{
        field?: string;
        message: string;
    }>;
}
```

Common status codes:
- 400: Validation error
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (insufficient permissions)
- 404: Resource not found
- 500: Server error
