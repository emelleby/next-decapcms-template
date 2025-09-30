import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-9 w-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        disabled
        aria-label="Loading theme toggle"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
