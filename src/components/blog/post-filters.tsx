"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { XCircle } from 'lucide-react';

interface PostFiltersProps {
  categories: string[];
  tags: string[];
}

export default function PostFilters({ categories, tags }: PostFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentTag = searchParams.get('tag') || '';

  const handleFilterChange = (type: 'search' | 'category' | 'tag', value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (value) {
      current.set(type, value);
    } else {
      current.delete(type);
    }
    
    const query = current.toString();
    router.push(`/blog${query ? `?${query}` : ''}`);
  };

  const clearFilters = () => {
    router.push('/blog');
  };
  
  const hasActiveFilters = !!currentSearch || !!currentCategory || !!currentTag;

  return (
    <div className="p-6 bg-card rounded-lg shadow mb-8 space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
      <div className="flex-grow">
        <label htmlFor="search" className="block text-sm font-medium text-muted-foreground mb-1">Search Posts</label>
        <Input
          id="search"
          type="text"
          placeholder="Enter keywords..."
          defaultValue={currentSearch}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="bg-background/70 focus:bg-background"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
        <Select value={currentCategory} onValueChange={(value) => handleFilterChange('category', value === 'all' ? '' : value)}>
          <SelectTrigger className="w-full md:w-[180px] bg-background/70 focus:bg-background">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="tag" className="block text-sm font-medium text-muted-foreground mb-1">Tag</label>
        <Select value={currentTag} onValueChange={(value) => handleFilterChange('tag', value === 'all' ? '' : value)}>
          <SelectTrigger className="w-full md:w-[180px] bg-background/70 focus:bg-background">
            <SelectValue placeholder="All Tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {tags.map(tag => (
              <SelectItem key={tag} value={tag}>{tag}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {hasActiveFilters && (
        <Button variant="ghost" onClick={clearFilters} className="w-full md:w-auto text-destructive hover:text-destructive hover:bg-destructive/10">
          <XCircle className="mr-2 h-4 w-4" /> Clear Filters
        </Button>
      )}
    </div>
  );
}
