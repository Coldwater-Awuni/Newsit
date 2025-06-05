# News-it API Frontend Integration Guide

## Base URLs
```
Development: http://localhost:3000/api
Production: https://your-production-url.com/api
```

## Database Models

### User Model
```typescript
interface User {
    email: string;
    firebaseUid: string;
    role: 'admin' | 'user';
    displayName?: string;
    photoURL?: string;
    lastLogin?: Date;
    metadata: {
        createdAt: Date;
        lastSignInTime: Date;
    }
}
```

### Post Model
```typescript
interface Post {
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
    author: string | { name: string } | 'admin' | 'ai';
    status: 'draft' | 'published';
    metadata?: {
        llmProvider?: string;
        llmModel?: string;
    }
}
```

### Category Model
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

## Authentication

Uses Firebase Authentication. All protected routes require a Firebase ID token in the Authorization header.

### Firebase Setup
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
1. Register or sign in user with Firebase
2. Get Firebase ID token
3. Verify token with backend
4. Include token in all subsequent API requests

### Authentication Methods

#### Register
```typescript
const register = async (email: string, password: string, displayName?: string) => {
    try {
        // 1. Call backend registration endpoint
        const response = await api.post('/api/auth/register', {
            email,
            password,
            displayName
        });
        
        // 2. Sign in with Firebase using custom token
        const { customToken } = response.data.data;
        await signInWithCustomToken(auth, customToken);
        
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};
```

#### Sign In with Email/Password
```typescript
const signIn = async (email: string, password: string) => {
    try {
        // 1. Sign in with Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // 2. Get Firebase ID token
        const idToken = await userCredential.user.getIdToken();
        
        // 3. Verify token with backend
        const response = await api.post('/api/auth/verify-token', { idToken });
        return response.data;
    } catch (error) {
        console.error('Sign in error:', error);
        throw error;
    }
};
```

## API Client Setup

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

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
- Public endpoint
- Creates a new user account
- Body:
  ```typescript
  {
    email: string;
    password: string;
    displayName?: string;
  }
  ```
- Returns:
  ```typescript
  {
    status: 'success';
    data: {
      customToken: string;
      user: User;
    }
  }
  ```

#### POST /api/auth/verify-token
- Public endpoint
- Verifies Firebase ID token
- Body:
  ```typescript
  {
    idToken: string;
  }
  ```
- Returns:
  ```typescript
  {
    status: 'success';
    data: {
      user: User;
    }
  }
  ```

#### PUT /api/auth/profile
- Protected endpoint
- Updates user profile
- Body:
  ```typescript
  {
    displayName?: string;
    photoURL?: string;
  }
  ```

### Blog Endpoints

#### GET /api/blog/posts
- Public endpoint
- Query parameters:
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
- Returns paginated posts list

#### GET /api/blog/posts/:id
- Public endpoint
- Returns single post details

#### POST /api/blog/generate-post
- Protected endpoint
- Generates blog post using AI
- Body:
  ```typescript
  {
    keyword?: string;
    sourceUrl?: string;
    instruction?: string;
    category: string;
    provider: string;
    model: string;
  }
  ```
- Workflow:
  1. Validates category existence
  2. Uses provided sourceUrl or gets one from category's sourceUrls
  3. Scrapes content from URL
  4. Generates content using specified AI model
  5. Creates post in draft status

#### GET /api/blog/llm-models
- Protected endpoint
- Returns available AI models:
  ```typescript
  {
    status: 'success';
    data: {
      models: Array<{
        provider: string;
        name: string;
        description?: string;
      }>;
    }
  }
  ```

#### POST /api/blog/posts
- Protected endpoint
- Creates a new post manually
- Body: Post model fields

#### PUT /api/blog/posts/:id
- Protected endpoint
- Updates existing post
- Body: Post model fields

#### DELETE /api/blog/posts/:id
- Protected (Admin only)
- Deletes post

### Category Endpoints

#### GET /api/categories
- Public endpoint
- Returns all categories

#### GET /api/categories/:id
- Public endpoint
- Returns single category details

#### POST /api/categories
- Protected (Admin only)
- Creates new category
- Body:
  ```typescript
  {
    name: string;
    description?: string;
    sourceUrls: Array<{
      url: string;
      description?: string;
      priority?: number;
    }>;
    isActive?: boolean;
  }
  ```

#### PUT /api/categories/:id
- Protected (Admin only)
- Updates category
- Body: Same as POST

#### DELETE /api/categories/:id
- Protected (Admin only)
- Deletes category

## Admin Dashboard Integration

### Dashboard Features

1. **User Management**
   - View all users
   - Update user roles
   - Delete users
   - Monitor user activity

2. **Content Management**
   - View all posts with filtering options
   - Edit/Delete posts
   - Toggle post status (draft/published)
   - Feature/unfeature posts

3. **Category Management**
   - Create/Edit/Delete categories
   - Manage source URLs for each category
   - Toggle category active status

4. **AI Content Generation**
   - Select AI provider and model
   - Available providers:
     - OpenAI
     - Google Gemini
     - Groq
   - Input options:
     - Keywords
     - Source URLs
     - Custom instructions
     - Category selection
   - Content workflow states:
     1. Content generation
     2. Review/Edit
     3. Publish

### Access Control

- Role-based access:
  - Admin: Full access to all features
  - User: Limited to:
    - Viewing public content
    - Generating content
    - Managing own posts

### API Integration Tips

1. **Error Handling**
   ```typescript
   interface ApiError {
     status: 'error';
     message: string;
     code?: string;
   }
   ```

2. **Authorization Header**
   ```typescript
   headers: {
     Authorization: `Bearer ${firebaseIdToken}`
   }
   ```

3. **Content Generation Status Monitoring**
   - Poll the post status after generation
   - Handle draft review process
   - Implement auto-save during editing

4. **File Upload**
   - Support image uploads for posts
   - Handle featured images
   - Support multiple formats
