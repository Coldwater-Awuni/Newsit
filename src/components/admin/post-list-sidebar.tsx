
'use client';

import { useState } from 'react';
import type { BlogPost } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { FileEdit, PlusCircle, Search, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PostListSidebarProps {
  posts: BlogPost[];
  selectedPostId: string | null;
  onSelectPost: (postId: string) => void;
  onCreateNew: () => void;
}

export default function PostListSidebar({
  posts,
  selectedPostId,
  onSelectPost,
  onCreateNew,
}: PostListSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  return (
    <aside className="w-80 md:w-96 bg-card border-r flex flex-col h-full shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-1">Manage Posts</h2>
        <p className="text-xs text-muted-foreground">Select a post or create new.</p>
      </div>
      
      <div className="p-4 space-y-3 border-b">
        <Button onClick={onCreateNew} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Post
        </Button>
        <div className="relative">
            <Input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-8"
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex gap-2">
            {(['all', 'published', 'draft'] as const).map(status => (
                <Button 
                    key={status}
                    variant={statusFilter === status ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className="flex-1 capitalize"
                >
                    {status}
                </Button>
            ))}
        </div>
      </div>

      <ScrollArea className="flex-grow min-h-0"> {/* Added min-h-0 here */}
        {filteredPosts.length > 0 ? (
          <ul className="divide-y">
            {filteredPosts.map(post => (
              <li key={post.id}>
                <button
                  onClick={() => onSelectPost(post.id)}
                  className={cn(
                    "w-full text-left p-4 hover:bg-muted/50 transition-colors focus:outline-none focus:bg-muted",
                    selectedPostId === post.id && "bg-muted"
                  )}
                >
                  <h3 className="font-medium truncate">{post.title}</h3>
                  <div className="text-xs text-muted-foreground flex items-center justify-between mt-1">
                    <span>{format(new Date(post.publishDate), 'MMM d, yyyy')}</span>
                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className="capitalize">
                      {post.status}
                    </Badge>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-sm text-muted-foreground text-center">No posts match your filters.</p>
        )}
      </ScrollArea>
    </aside>
  );
}

