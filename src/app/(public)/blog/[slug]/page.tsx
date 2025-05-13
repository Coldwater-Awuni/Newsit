import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '@/lib/mock-data';
import type { BlogPost } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Tag, UserCircle } from 'lucide-react';
import { format } from 'date-fns';

export async function generateStaticParams() {
  return BLOG_POSTS.filter(post => post.status === 'published').map(post => ({
    slug: post.slug,
  }));
}

async function getPost(slug: string): Promise<BlogPost | undefined> {
  return BLOG_POSTS.find(post => post.slug === slug && post.status === 'published');
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto py-8">
      <header className="mb-8">
        <div className="mb-4">
          <Link href={`/blog?category=${encodeURIComponent(post.category)}`} passHref>
            <Badge variant="secondary" className="hover:bg-primary/20 transition-colors text-sm">{post.category}</Badge>
          </Link>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-foreground">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              {post.author.avatarUrl && <AvatarImage src={post.author.avatarUrl} alt={post.author.name} data-ai-hint="author avatar"/>}
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>By {post.author.name}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-1.5" />
            <span>Published on {format(new Date(post.publishDate), 'MMMM d, yyyy')}</span>
          </div>
        </div>
      </header>

      {post.imageUrl && (
        <div className="relative w-full aspect-[16/9] mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
            className="object-cover"
            priority
            data-ai-hint="blog hero image"
          />
        </div>
      )}

      <div 
        className="prose dark:prose-invert prose-lg max-w-none
                   prose-headings:font-semibold prose-headings:text-foreground
                   prose-p:text-foreground/90
                   prose-a:text-primary hover:prose-a:text-primary/80 prose-a:transition-colors
                   prose-strong:text-foreground
                   prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
                   prose-img:rounded-md prose-img:shadow-md"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />

      {post.tags.length > 0 && (
        <footer className="mt-12 pt-8 border-t">
          <h3 className="text-lg font-semibold mb-3 text-foreground">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} passHref>
                <Badge variant="outline" className="text-sm px-3 py-1 hover:bg-accent/10 transition-colors">{tag}</Badge>
              </Link>
            ))}
          </div>
        </footer>
      )}
    </article>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) {
    return { title: 'Post Not Found' };
  }
  return {
    title: `${post.title} | Inkling Insights`,
    description: post.excerpt,
  };
}
