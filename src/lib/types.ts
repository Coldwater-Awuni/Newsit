
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
