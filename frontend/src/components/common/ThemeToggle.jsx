import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  const handleClick = () => {
    console.log('🖱️ Theme toggle button clicked!');
    toggleTheme();
  };

  return (
    <button
      onClick={handleClick}
      className={`
        fixed top-4 right-4 z-50
        w-12 h-12 rounded-full
        flex items-center justify-center
        transition-all duration-300
        ${isDark 
          ? 'bg-slate-800 text-yellow-300 hover:bg-slate-700 border border-slate-600' 
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
        }
        shadow-lg hover:shadow-xl
      `}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle theme"
    >
      {isDark ? (
        // Sun icon (show in dark mode to switch to light)
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 18a6 6 0 100-12 6 6 0 000 12zm0-2a4 4 0 110-8 4 4 0 010 8zm0-12v-2m0 16v-2m6-6h2m-16 0h2m12.95-3.05l1.41-1.41M4.64 4.64l1.41 1.41m8.9 14.14l1.41 1.41m-14.14-1.41l1.41-1.41" />
        </svg>
      ) : (
        // Moon icon (show in light mode to switch to dark)
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

// Made with Bob
