export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  publishedDate: string;
  status: 'published' | 'draft';
  category: string;
  slug: string;
  tags: string[];
  featured?: boolean;
  imageUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'author';
}
