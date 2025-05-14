
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/lib/mock-data';
import { ChevronRight } from 'lucide-react';

interface CategoryDisplayBarProps {
  category: string;
}

export default function CategoryDisplayBar({ category }: CategoryDisplayBarProps) {
  const otherCategories = CATEGORIES.filter(c => c !== category && c !== 'News'); // Exclude 'News' if it shouldn't be listed as "other" here, or adjust as needed

  return (
    <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-4 border-b">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 md:mb-0">
          Category: {category}
        </h1>
        <Link href="/blog" passHref>
          <Button variant="outline" size="sm">View All Posts</Button>
        </Link>
      </div>
      {otherCategories.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3 text-foreground">Explore Other Categories:</h2>
          <div className="flex flex-wrap gap-3">
            {otherCategories.map(cat => (
              <Link key={cat} href={`/blog?category=${encodeURIComponent(cat)}`} passHref>
                <Button variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary px-3 py-1 h-auto text-sm">
                  {cat}
                  <ChevronRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
