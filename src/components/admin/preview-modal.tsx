"use client";

import type { BlogPost, Author } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Tag } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: BlogPost | null;
}

export default function PreviewModal({ open, onOpenChange, post }: PreviewModalProps) {
  if (!post) return null;

  const getAuthorInfo = (author: 'admin' | 'ai' | Author) => {
    if (typeof author === 'string') {
      return {
        name: author === 'admin' ? 'Administrator' : 'AI Writer',
        avatarUrl: undefined
      };
    }
    return author;
  };

  const authorInfo = getAuthorInfo(post.author);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-2xl">Post Preview: {post.title}</DialogTitle>
          <DialogDescription>This is how your post will look. Scroll to see full content.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <article className="p-6">
            <header className="mb-6">
              <div className="mb-3">
                <Badge variant="secondary" className="text-sm">{post.category}</Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3 text-foreground">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-1.5">
                    {authorInfo.avatarUrl && (
                      <AvatarImage 
                        src={authorInfo.avatarUrl} 
                        alt={authorInfo.name} 
                      />
                    )}
                    <AvatarFallback>{authorInfo.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>By {authorInfo.name}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-3 w-3 mr-1" />
                  <span>Published on {format(new Date(post.publishDate), 'MMMM d, yyyy')}</span>
                </div>
              </div>
            </header>

            {post.imageUrl && (
              <div className="relative w-full aspect-[16/9] mb-6 rounded-md overflow-hidden shadow-md">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
                  className="object-cover"
                />
              </div>
            )}

            <div 
              className="prose dark:prose-invert prose-base max-w-none
                prose-headings:font-semibold prose-headings:text-foreground
                prose-p:text-foreground/90
                prose-a:text-primary hover:prose-a:text-primary/80 prose-a:transition-colors
                prose-strong:text-foreground
                prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
                prose-img:rounded-md prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </article>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
