import FeaturedPosts from '@/components/blog/featured-posts';
import RecentPosts from '@/components/blog/recent-posts';
import AdUnit from '@/components/ads/ad-unit';
import { BLOG_POSTS } from '@/lib/mock-data';
import type { BlogPost } from '@/lib/types';

export default function HomePage() {
  const publishedPosts = BLOG_POSTS.filter(post => post.status === 'published');
  const featuredPosts = publishedPosts.filter(post => post.featured);
  const recentPosts = publishedPosts.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()).slice(0, 6);

  return (
    <div className="space-y-12">
      <FeaturedPosts posts={featuredPosts.length > 0 ? featuredPosts : recentPosts.slice(0,2)} />
      <AdUnit format="banner" placeholder />
      <RecentPosts posts={recentPosts} />
      <AdUnit format="banner" placeholder />
    </div>
  );
}
