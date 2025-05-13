
"use client";

import Link from 'next/link';
import { BookOpenText, Search, Menu, Settings, FileText } from 'lucide-react'; // Removed X as it's part of SheetClose
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
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
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLinkItem = ({ href, label, onClick, isCategoryLink = false }: { href: string, label: string, onClick?: () => void, isCategoryLink?: boolean }) => {
    // For category links, we need to check if the current pathname includes the category query parameter
    let isActive = pathname === href;
    if (isCategoryLink && href.includes('?category=')) {
      const categoryParam = new URLSearchParams(href.split('?')[1]).get('category');
      const currentCategoryParam = new URLSearchParams(pathname.split('?')[1]).get('category');
      isActive = pathname.startsWith('/blog') && categoryParam === currentCategoryParam;
    }
    
    return (
        <Link href={href} passHref>
        <Button
            variant="ghost"
            className={cn(
            "text-sm font-medium",
            isActive ? "text-primary hover:text-primary" : "hover:text-primary/80",
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
      isScrolled ? "bg-card/80 backdrop-blur-md shadow-md" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-80 transition-opacity">
          <BookOpenText size={28} />
          <span>Inkling Insights</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => <NavLinkItem key={link.href} {...link} />)}
          {CATEGORIES.map(category => (
            <NavLinkItem 
              key={category} 
              href={`/blog?category=${encodeURIComponent(category)}`} 
              label={category}
              isCategoryLink={true}
            />
          ))}
          <div className="relative w-40 ml-2"> {/* Adjusted width and margin */}
            <Input type="search" placeholder="Search..." className="h-9 pr-8 bg-background/70 focus:bg-background text-xs" /> {/* Adjusted placeholder and text size */}
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <ThemeToggle />
          <Link href="/admin" passHref>
            <Button variant="outline" size="sm">
              <Settings size={16} className="mr-1 md:mr-2" /> <span className="hidden sm:inline">Admin</span>
            </Button>
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu size={24} />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-card p-0 flex flex-col">
              <SheetHeader className="p-6 border-b">
                <SheetTitle className="text-left text-lg flex items-center">
                  <FileText size={20} className="mr-2 text-primary" /> Menu
                </SheetTitle>
                <SheetDescription className="text-left text-xs text-muted-foreground">
                    Navigate through Inkling Insights.
                </SheetDescription>
              </SheetHeader>
              <div className="p-4 flex flex-col gap-1 flex-grow overflow-y-auto"> {/* Adjusted padding and gap */}
                <SheetClose asChild>
                  <Link href="/" onClick={handleMobileLinkClick} className="flex items-center gap-2 text-lg font-bold text-primary mb-3 p-2 rounded-md hover:bg-muted">
                    <BookOpenText size={24} />
                    Inkling Insights
                  </Link>
                </SheetClose>
                
                {navLinks.map(link => (
                   <NavLinkItem key={link.href} {...link} onClick={handleMobileLinkClick} />
                ))}
                
                <div className="my-2">
                    <p className="text-sm font-semibold text-muted-foreground px-2 mb-1">Categories</p>
                    {CATEGORIES.map((category) => (
                        <NavLinkItem 
                            key={category} 
                            href={`/blog?category=${encodeURIComponent(category)}`} 
                            label={category}
                            onClick={handleMobileLinkClick}
                            isCategoryLink={true}
                        />
                    ))}
                </div>

                <div className="relative mt-auto pt-4"> {/* Pushes search and admin to bottom */}
                  <Input type="search" placeholder="Search posts..." className="h-9 pr-8 bg-background/70 focus:bg-background" />
                  <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground mt-2" /> {/* Adjusted mt for alignment */}
                </div>
                <Link href="/admin" passHref>
                    <Button variant="outline" className="w-full mt-2" onClick={handleMobileLinkClick}>
                    <Settings size={16} className="mr-2" /> Admin Panel
                    </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
