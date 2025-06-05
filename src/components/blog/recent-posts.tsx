import type { BlogPost } from '@/lib/types';
import BlogCard from './blog-card';

interface RecentPostsProps {
  posts: BlogPost[];
}

export default function RecentPosts({ posts }: RecentPostsProps) {
  if (!posts || posts.length === 0) {
    return <p>No recent posts available.</p>;
  }
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 border-b pb-2 border-primary/30">Recent Articles</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}
