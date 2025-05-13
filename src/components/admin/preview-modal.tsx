"use client";

import type { BlogPost } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Tag } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: BlogPost | null;
}

export default function PreviewModal({ isOpen, onClose, post }: PreviewModalProps) {
  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                {post.author.avatarUrl && <AvatarImage src={post.author.avatarUrl} alt={post.author.name} data-ai-hint="author avatar"/>}
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>By {post.author.name}</span>
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
                data-ai-hint="blog preview image"
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
            <footer className="mt-8 pt-6 border-t">
            <h3 className="text-md font-semibold mb-2 text-foreground">Tags</h3>
            <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5">{tag}</Badge>
                ))}
            </div>
            </footer>
          )}
          </article>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
