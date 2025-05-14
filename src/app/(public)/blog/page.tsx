
'use client'; 

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import BlogCard from '@/components/blog/blog-card';
import PostFilters from '@/components/blog/post-filters';
import CategoryDisplayBar from '@/components/blog/CategoryDisplayBar';
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

  const showPostFilters = !!searchTerm;
  const showCategoryDisplayBar = !!selectedCategory && !searchTerm;

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
    setCurrentPage(1); 
    window.scrollTo(0, 0);
  }, [searchTerm, selectedCategory, selectedTag]);
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
       window.scrollTo(0, 0);
    }
  };

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
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
