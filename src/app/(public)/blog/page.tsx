'use client'; 

import { BlogAPI } from '@/lib/api-client';
import type { BlogPost } from '@/types';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import BlogCard from '@/components/blog/blog-card';
import PostFilters from '@/components/blog/post-filters';
import CategoryDisplayBar from '@/components/blog/CategoryDisplayBar';
import AdUnit from '@/components/ads/ad-unit';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const POSTS_PER_PAGE = 9;

export default function BlogPage() {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const showPostFilters = !!searchTerm;
  const showCategoryDisplayBar = !!selectedCategory && !searchTerm;

  const filteredPosts = useMemo(() => {
    return posts
      .filter(post => post.status === 'published')
      .filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(post => selectedCategory ? post.category === selectedCategory : true)
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }, [searchTerm, selectedCategory, posts]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const { posts: fetchedPosts } = await BlogAPI.getPosts({ 
          status: 'published',
          search: searchTerm,
          category: selectedCategory 
        });
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [searchTerm, selectedCategory, currentPage]);

  useEffect(() => {
    setCurrentPage(1); 
    window.scrollTo(0, 0);
  }, [searchTerm, selectedCategory]);
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
       window.scrollTo(0, 0);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {showPostFilters && (
        <>
          <h1 className="text-4xl font-bold text-center">
            Search Results for: <span className="text-primary">&quot;{searchTerm}&quot;</span>
          </h1>
          <PostFilters categories={CATEGORIES} tags={TAGS} />
        </>
      )}

      {showCategoryDisplayBar && (
        <CategoryDisplayBar category={selectedCategory} />
      )}

      {!showPostFilters && !showCategoryDisplayBar && (
         <h1 className="text-4xl font-bold text-center">Explore Our Articles</h1>
      )}
      
      {paginatedPosts.length > 0 ? (
        <>
          <AdUnit format="banner" placeholder className="mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPosts.map((post, index) => (
              <>
                <BlogCard key={post.id} post={post} />
                {/* Add in-article ads after every 6th post */}
                {(index + 1) % 6 === 0 && index !== paginatedPosts.length - 1 && (
                  <div className="col-span-full my-8">
                    <AdUnit format="in-article" placeholder />
                  </div>
                )}
              </>
            ))}
          </div>
          <AdUnit format="banner" placeholder className="mt-8" />
        </>
      ) : (
        <p className="text-center text-muted-foreground text-lg py-12">
          No posts found matching your criteria. Try adjusting your filters or search!
        </p>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              if (totalPages <= 5 || pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1) {
                return (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      href="#" 
                      isActive={currentPage === pageNum}
                      onClick={(e) => { e.preventDefault(); handlePageChange(pageNum); }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (Math.abs(pageNum - currentPage) === 2 && totalPages > 5) {
                 return <PaginationEllipsis key={`ellipsis-${i}`} />;
              }
              return null;
            })}
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} 
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
