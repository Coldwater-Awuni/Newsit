
"use client";

import Link from 'next/link';
import { BookOpenText, Search, Menu, Settings, FileText } from 'lucide-react'; 
import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation'; // Added useSearchParams

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
// Removed unused DialogTitle import from previous attempt. If SheetTitle/Description are not enough, specific Radix DialogTitle might be needed.
import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/lib/mock-data';


const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 5); 
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLinkItem = ({ href, label, onClick, isCategoryLink = false }: { href: string, label: string, onClick?: () => void, isCategoryLink?: boolean }) => {
    const componentSearchParams = useSearchParams(); // Use hook for search parameters
    let determinedIsActive = false;

    if (isCategoryLink) {
        const currentUrlCategoryQueryParam = componentSearchParams.get('category');

        let linkHrefCategory: string | null = null;
        try {
            // Use a dummy base URL as href is a path like /blog?category=Technology
            const linkUrl = new URL(href, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
            linkHrefCategory = linkUrl.searchParams.get('category');
        } catch (e) {
            console.error("Error parsing link href for category in NavLinkItem:", href, e);
        }

        // Active if: current page is /blog and category query param matches this link's category.
        if (pathname.startsWith('/blog') && linkHrefCategory && currentUrlCategoryQueryParam === linkHrefCategory) {
            determinedIsActive = true;
        } 
        // Active if: current page is /categories/[categoryName] and [categoryName] (decoded) matches this link's label.
        // (Assuming label is the plain, decoded category name)
        else if (pathname.startsWith('/categories/')) {
            const pathCategorySegment = decodeURIComponent(pathname.substring('/categories/'.length));
            if (pathCategorySegment === label) {
                determinedIsActive = true;
            }
        }
    } else {
        // For non-category links (Home, About)
        determinedIsActive = pathname === href;
    }
    
    return (
        <Link href={href} passHref>
        <Button
            variant="ghost"
            className={cn(
            "text-sm font-medium py-1 px-3 h-auto", 
            determinedIsActive ? "text-primary bg-primary/10 hover:text-primary hover:bg-primary/15" : "hover:text-primary/80 hover:bg-muted/50",
            "transition-colors duration-200 w-full justify-start text-left md:w-auto"
            )}
            onClick={onClick}
        >
            {label}
        </Button>
        </Link>
    );
  };
  
  const handleMobileLinkClick = () => {
    setIsMobileSheetOpen(false);
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-card/90 backdrop-blur-lg shadow-lg" : "bg-card/80 md:bg-transparent" 
    )}>
      {/* Main Navigation Row */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-80 transition-opacity">
          <BookOpenText size={28} />
          <span>Inkling Insights</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <div className="relative w-40 ml-2">
            <Input type="search" placeholder="Search..." className="h-9 pr-8 bg-background/70 focus:bg-background text-xs" />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <ThemeToggle />
          <Link href="/admin" passHref>
            <Button variant="outline" size="sm">
              <Settings size={16} className="mr-1 md:mr-2" /> <span className="hidden sm:inline">Admin</span>
            </Button>
          </Link>
        </nav>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu size={24} />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[280px] bg-card p-0 flex flex-col"
              aria-labelledby="mobile-sheet-title" 
              aria-describedby="mobile-sheet-description"
            >
              <SheetHeader className="p-6 border-b">
                <SheetTitle id="mobile-sheet-title" className="text-left text-lg flex items-center"> 
                  <FileText size={20} className="mr-2 text-primary" /> Menu
                </SheetTitle>
                <SheetDescription id="mobile-sheet-description" className="text-left text-xs text-muted-foreground">
                    Navigate through Inkling Insights.
                </SheetDescription>
              </SheetHeader>
              <div className="p-4 flex flex-col gap-1 flex-grow overflow-y-auto">
                <SheetClose asChild>
                  <Link href="/" onClick={handleMobileLinkClick} className="flex items-center gap-2 text-lg font-bold text-primary mb-3 p-2 rounded-md hover:bg-muted">
                    <BookOpenText size={24} />
                    Inkling Insights
                  </Link>
                </SheetClose>
                
                {navLinks.map(link => (
                   <SheetClose key={link.href} asChild><NavLinkItem {...link} onClick={handleMobileLinkClick} /></SheetClose>
                ))}
                
                <div className="my-2">
                    <p className="text-sm font-semibold text-muted-foreground px-2 mb-1">Categories</p>
                    {CATEGORIES.map((category) => (
                        <SheetClose key={category} asChild>
                          <NavLinkItem 
                              href={`/blog?category=${encodeURIComponent(category)}`} 
                              label={category}
                              onClick={handleMobileLinkClick}
                              isCategoryLink={true}
                          />
                        </SheetClose>
                    ))}
                </div>

                <div className="relative mt-auto pt-4">
                  <Input type="search" placeholder="Search posts..." className="h-9 pr-8 bg-background/70 focus:bg-background" />
                  <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground mt-2" />
                </div>
                <SheetClose asChild>
                  <Link href="/admin" passHref>
                      <Button variant="outline" className="w-full mt-2" onClick={handleMobileLinkClick}>
                      <Settings size={16} className="mr-2" /> Admin Panel
                      </Button>
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Secondary Row (Home, About, Categories) */}
      <div className={cn(
        "hidden md:block border-t",
        isScrolled ? "border-border/30" : "border-transparent md:border-border/20"
        )}>
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center gap-x-1 py-2">
            {navLinks.map(link => (
              <NavLinkItem 
                key={link.href} 
                href={link.href} 
                label={link.label}
                isCategoryLink={false}
              />
            ))}
            {CATEGORIES.map(category => (
              <NavLinkItem 
                key={category} 
                href={`/blog?category=${encodeURIComponent(category)}`} 
                label={category}
                isCategoryLink={true}
              />
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
