import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { navigationItems, NavigationItem } from '@/config/navigation';

interface DesktopNavigationProps {
  items?: NavigationItem[];
}

export function DesktopNavigation({ items = navigationItems }: DesktopNavigationProps) {
  const router = useRouter();

  return (
    <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
      {items.map((item) => {
        const isActive = item.isActive
          ? item.isActive(router.pathname)
          : router.pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium transition-colors hover:text-foreground px-2 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
              isActive
                ? "text-foreground border-b-2 border-primary"
                : "text-foreground/80"
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
