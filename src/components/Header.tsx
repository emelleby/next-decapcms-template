import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandLogo } from './BrandLogo';
import { DesktopNavigation } from './DesktopNavigation';
import { ThemeToggle } from './ThemeToggle';
import { navigationItems } from '@/config/navigation';

export function Header(): React.ReactElement {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        isMobileMenuOpen
      ) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm shadow-xs supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Brand Logo */}
          <div className="flex items-center">
            <BrandLogo />
          </div>

          {/* Center: Desktop Navigation */}
          <div className="flex-1 flex justify-center">
            <DesktopNavigation />
          </div>

          <div className="flex items-center gap-x-4">

            <ThemeToggle />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-9 w-9"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div
          ref={mobileMenuRef}
          className={`md:hidden border-t border-border bg-accent overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? 'max-h-96 opacity-100'
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className={`container mx-auto px-4 transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'py-4' : 'py-0'
          }`}>
            <nav className="flex flex-col space-y-3">
              {navigationItems.map((item) => {
                const isActive = item.isActive
                  ? item.isActive(router.pathname)
                  : router.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 border-b text-base rounded-md transition-colors duration-200 ${
                      isActive
                        ? "font-bold border-primary"
                        : "border-border font-medium"
                    }`}
                    onClick={closeMobileMenu}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
