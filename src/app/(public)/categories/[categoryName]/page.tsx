import BlogCard from '@/components/blog/blog-card';
import { BLOG_POSTS, CATEGORIES } from '@/lib/mock-data';
import type { BlogPost } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateStaticParams() {
  return CATEGORIES.map(category => ({
    categoryName: encodeURIComponent(category),
  }));
}

interface CategoryPageProps {
  params: { categoryName: string };
}

async function getPostsByCategory(categoryName: string): Promise<BlogPost[]> {
  const decodedCategory = decodeURIComponent(categoryName);
  return BLOG_POSTS.filter(post => post.category === decodedCategory && post.status === 'published')
                   .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = decodeURIComponent(params.categoryName);
  if (!CATEGORIES.includes(categoryName)) {
    return { title: 'Category Not Found' };
  }
  return {
    title: `Posts in ${categoryName} | NewsIt`,
    description: `Explore articles in the ${categoryName} category on NewsIt.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = decodeURIComponent(params.categoryName);
  
  if (!CATEGORIES.includes(categoryName)) {
    notFound();
  }

  const posts = await getPostsByCategory(params.categoryName);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center">
        Category: <span className="text-primary">{categoryName}</span>
      </h1>
      
      {posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg py-12">
          No posts found in the "{categoryName}" category yet. Check back soon!
        </p>
      )}
    </div>
  );
}
