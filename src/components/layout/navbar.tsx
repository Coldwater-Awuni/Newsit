"use client";

import Link from 'next/link';
import { BookOpenText, Search, Menu, X, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CATEGORIES } from '@/lib/mock-data';


const navLinks = [
  { href: '/', label: 'Home' },
  // Categories will be a dropdown
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLinkItem = ({ href, label, onClick }: { href: string, label: string, onClick?: () => void }) => (
    <Link href={href} passHref>
      <Button
        variant="ghost"
        className={cn(
          "text-sm font-medium",
          pathname === href ? "text-primary hover:text-primary" : "hover:text-primary/80",
          "transition-colors duration-200"
        )}
        onClick={onClick}
      >
        {label}
      </Button>
    </Link>
  );
  
  const CategoriesDropdown = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-sm font-medium hover:text-primary/80 transition-colors duration-200">
          Categories
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {CATEGORIES.map((category) => (
          <DropdownMenuItem key={category} asChild>
            <Link href={`/blog?category=${encodeURIComponent(category)}`} onClick={onLinkClick}>
              {category}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );


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
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map(link => <NavLinkItem key={link.href} {...link} />)}
          <CategoriesDropdown />
          <div className="relative w-48">
            <Input type="search" placeholder="Search posts..." className="h-9 pr-8 bg-background/70 focus:bg-background" />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <ThemeToggle />
          <Link href="/admin" passHref>
            <Button variant="outline" size="sm">
              <Settings size={16} className="mr-2" /> Admin Panel
            </Button>
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-6 bg-card">
              <div className="flex flex-col gap-4">
                <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary mb-4">
                  <BookOpenText size={24} />
                  Inkling Insights
                </Link>
                {navLinks.map(link => (
                  <SheetClose asChild key={link.href}>
                     <NavLinkItem {...link} />
                  </SheetClose>
                ))}
                 <SheetClose asChild>
                    <CategoriesDropdown />
                  </SheetClose>

                <div className="relative mt-4">
                  <Input type="search" placeholder="Search posts..." className="h-9 pr-8 bg-background/70 focus:bg-background" />
                  <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <SheetClose asChild>
                  <Link href="/admin" passHref>
                      <Button variant="outline" className="w-full mt-4">
                        <Settings size={16} className="mr-2" /> Admin Panel
                      </Button>
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
