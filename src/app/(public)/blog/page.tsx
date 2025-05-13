'use client'; // For query params and filtering logic

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import BlogCard from '@/components/blog/blog-card';
import PostFilters from '@/components/blog/post-filters';
import { BLOG_POSTS, CATEGORIES, TAGS } from '@/lib/mock-data';
import type { BlogPost } from '@/lib/types';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const POSTS_PER_PAGE = 9;

export default function BlogPage() {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  const searchTerm = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedTag = searchParams.get('tag') || '';

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS
      .filter(post => post.status === 'published')
      .filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(post => selectedCategory ? post.category === selectedCategory : true)
      .filter(post => selectedTag ? post.tags.includes(selectedTag) : true)
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }, [searchTerm, selectedCategory, selectedTag]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm, selectedCategory, selectedTag]);
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
       window.scrollTo(0, 0);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center">Explore Our Articles</h1>
      <PostFilters categories={CATEGORIES} tags={TAGS} />
      
      {paginatedPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg py-12">
          No posts found matching your criteria. Try adjusting your filters!
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
              // Basic pagination display logic (can be improved for many pages)
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
