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
          : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-md'
        }
        shadow-lg hover:shadow-xl
      `}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle theme"
    >
      {isDark ? (
        // Sun icon (show in dark mode to switch to light)
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
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
