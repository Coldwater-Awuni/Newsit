
export interface Author {
  name: string;
  avatarUrl?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  author: Author;
  publishDate: string; // ISO 8601 date string
  tags: string[];
  category: string;
  featured?: boolean;
  status: 'draft' | 'published';
}

export interface SafetySetting {
  category:
    | 'HARM_CATEGORY_HATE_SPEECH'
    | 'HARM_CATEGORY_SEXUALLY_EXPLICIT'
    | 'HARM_CATEGORY_HARASSMENT'
    | 'HARM_CATEGORY_DANGEROUS_CONTENT'
    | 'HARM_CATEGORY_CIVIC_INTEGRITY';
  threshold:
    | 'BLOCK_LOW_AND_ABOVE'
    | 'BLOCK_MEDIUM_AND_ABOVE'
    | 'BLOCK_ONLY_HIGH'
    | 'BLOCK_NONE';
}
