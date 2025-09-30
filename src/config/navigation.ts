export interface NavigationItem {
  href: string;
  label: string;
  isActive?: (pathname: string) => boolean;
}

export const navigationItems: NavigationItem[] = [
  {
    href: '/',
    label: 'Home',
    isActive: (pathname) => pathname === '/'
  },
  {
    href: '/posts',
    label: 'Blog',
    isActive: (pathname) => pathname === '/posts' || pathname.startsWith('/posts/')
  },
  {
    href: '/program',
    label: 'Program',
    isActive: (pathname) => pathname === '/program'
  },
  {
    href: '/about',
    label: 'About',
    isActive: (pathname) => pathname === '/about'
  },
  {
    href: '/partners',
    label: 'Partners',
    isActive: (pathname) => pathname === '/partners'
  },
  {
    href: '/contact',
    label: 'Contact',
    isActive: (pathname) => pathname === '/contact'
  }
];
