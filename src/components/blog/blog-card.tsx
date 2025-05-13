import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Tag, UserCircle } from 'lucide-react';
import type { BlogPost } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured';
}

export default function BlogCard({ post, variant = 'default' }: BlogCardProps) {
  const isFeatured = variant === 'featured';

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        {post.imageUrl && (
          <Link href={`/blog/${post.slug}`} passHref>
            <div className={cn("relative w-full", isFeatured ? "aspect-[2/1]" : "aspect-video")}>
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint="blog post image"
              />
            </div>
          </Link>
        )}
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <div className="mb-2">
          <Link href={`/blog?category=${encodeURIComponent(post.category)}`} passHref>
            <Badge variant="secondary" className="hover:bg-primary/20 transition-colors">{post.category}</Badge>
          </Link>
        </div>
        <Link href={`/blog/${post.slug}`} passHref>
          <CardTitle className={cn("leading-tight hover:text-primary transition-colors", isFeatured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl")}>
            {post.title}
          </CardTitle>
        </Link>
        <p className={cn("mt-3 text-muted-foreground", isFeatured ? "text-base" : "text-sm")}>
          {post.excerpt}
        </p>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex flex-col items-start gap-3">
        <div className="flex items-center text-xs text-muted-foreground">
          <Avatar className="h-6 w-6 mr-2">
            {post.author.avatarUrl && <AvatarImage src={post.author.avatarUrl} alt={post.author.name} data-ai-hint="author avatar"/>}
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{post.author.name}</span>
          <span className="mx-2">·</span>
          <CalendarDays className="h-3 w-3 mr-1" />
          <span>{format(new Date(post.publishDate), 'MMM d, yyyy')}</span>
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <Tag className="h-3 w-3 text-muted-foreground" />
            {post.tags.slice(0, 3).map(tag => (
              <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} passHref>
                <Badge variant="outline" className="text-xs hover:bg-accent/10 transition-colors">{tag}</Badge>
              </Link>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

// Helper to make cn available for class concatenation
import { cn } from '@/lib/utils';
