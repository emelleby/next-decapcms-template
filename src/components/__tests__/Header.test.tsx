import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import { Header } from '../Header';
import { ThemeProvider } from '../../contexts/ThemeContext';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockRouter = {
  pathname: '/',
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  reload: jest.fn(),
};

(useRouter as jest.Mock).mockReturnValue(mockRouter);

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const HeaderWithTheme = () => (
  <ThemeProvider>
    <Header />
  </ThemeProvider>
);

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  test('renders brand logo', () => {
    render(<HeaderWithTheme />);
    expect(screen.getByText('AI JAM')).toBeInTheDocument();
  });

  test('renders desktop navigation links', () => {
    render(<HeaderWithTheme />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('AI JAM 2025')).toBeInTheDocument();
    expect(screen.getByText('Program')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Partners')).toBeInTheDocument();
    expect(screen.getByText('Rules')).toBeInTheDocument();
  });

  test('renders theme toggle button', () => {
    render(<HeaderWithTheme />);
    const themeToggle = screen.getByLabelText(/switch to/i);
    expect(themeToggle).toBeInTheDocument();
  });

  test('renders join hackathon button', () => {
    render(<HeaderWithTheme />);
    expect(screen.getByText('Join Hackathon')).toBeInTheDocument();
  });

  test('mobile menu toggle works', () => {
    render(<HeaderWithTheme />);
    
    // Mobile menu should not be visible initially
    expect(screen.queryByRole('navigation', { name: /main navigation/i })).not.toBeVisible();
    
    // Click mobile menu button
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);
    
    // Mobile navigation should now be visible
    const mobileNavLinks = screen.getAllByText('Home');
    expect(mobileNavLinks.length).toBeGreaterThan(1); // Desktop + Mobile
  });

  test('theme toggle functionality', async () => {
    render(<HeaderWithTheme />);
    
    const themeToggle = screen.getByLabelText(/switch to/i);
    
    // Click theme toggle
    fireEvent.click(themeToggle);
    
    // Should attempt to save theme to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
});
