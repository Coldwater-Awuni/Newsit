import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogAPI } from '@/lib/api-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import AdUnit from '@/components/ads/ad-unit';
import type { BlogPost } from '@/lib/types';
import { CalendarDays, Tag, UserCircle } from 'lucide-react';
import { format } from 'date-fns';

export async function generateStaticParams() {
  try {
    const { posts } = await BlogAPI.getPosts({ status: 'published' });
    return posts.map(post => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

async function getPost(slug: string): Promise<BlogPost | undefined> {
  try {
    const { posts } = await BlogAPI.getPosts({ status: 'published' });
    return posts.find(post => post.slug === slug);
  } catch (error) {
    console.error('Error fetching post:', error);
    return undefined;
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <article className="flex-1 max-w-3xl">
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

          <AdUnit format="in-article" placeholder className="my-8" />

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

          <AdUnit format="in-article" placeholder className="my-8" />

          {post.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-muted rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>

        <aside className="w-[300px] space-y-8 hidden lg:block">
          <div className="sticky top-8">
            <AdUnit format="sidebar" placeholder />
          </div>
        </aside>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) {
    return { title: 'Post Not Found' };
  }
  return {
    title: `${post.title} | NewsIt`,
    description: post.excerpt,
  };
}
