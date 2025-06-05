import type { BlogPost } from '@/lib/types';
import BlogCard from './blog-card';

interface FeaturedPostsProps {
  posts: BlogPost[];
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 border-b pb-2 border-primary/30">Featured Insights</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {posts.slice(0,2).map(post => ( // Show up to 2 featured posts
          <BlogCard key={post._id} post={post} variant="featured" />
        ))}
      </div>
    </section>
  );
}
