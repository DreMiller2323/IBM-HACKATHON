import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('pharma-theme');
    if (saved) return saved === 'dark';
    
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Single source of truth for the DOM
  useEffect(() => {
    const root = document.documentElement;
    console.log('🌓 Theme changing. isDark:', isDark);
    if (isDark) {
      root.classList.add('dark');
      console.log('✅ Added .dark class to html');
      localStorage.setItem('pharma-theme', 'dark');
    } else {
      root.classList.remove('dark');
      console.log('❌ Removed .dark class from html');
      localStorage.setItem('pharma-theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (undefined === context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};