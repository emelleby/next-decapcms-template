import React from 'react';
import Link from 'next/link';

export function BrandLogo() {
  return (
    <Link
      href="/"
      className="flex items-center space-x-2 text-foreground hover:text-foreground/80 transition-colors"
      aria-label="Go to homepage"
    >
      <div className="text-xl font-bold tracking-tight">
        Harestua bil
      </div>
    </Link>
  );
}
