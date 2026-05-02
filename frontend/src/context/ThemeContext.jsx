import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('pharma-theme');
    if (saved) return saved === 'dark';
    
    // Si pas de sauvegarde, on peut soit forcer le dark (ton choix)
    // soit suivre la préférence du système :
    // return window.matchMedia('(prefers-color-scheme: dark)').matches;
    return true; 
  });

  // Unique source de vérité pour le DOM
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('pharma-theme', 'dark');
    } else {
      root.classList.remove('dark');
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