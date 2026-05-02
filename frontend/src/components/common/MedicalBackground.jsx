import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

/**
 * MedicalBackground - Animated scientific background with floating molecules
 * Creates a subtle, professional animated backdrop for the pharmaceutical interface
 * Adapts opacity based on light/dark mode
 */
export default function MedicalBackground() {
  const { isDark } = useTheme();
  // Generate random particles with consistent positions
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-pharma-blue-950/5 to-pharma-blue-900/10 dark:from-transparent dark:via-pharma-blue-900/10 dark:to-pharma-blue-800/20" />
      
      {/* Floating molecules/particles */}
      <svg className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isDark ? 'opacity-30' : 'opacity-5'}`}>
        <defs>
          {/* Molecule structure pattern */}
          <pattern id="molecule" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="50" r="3" fill="currentColor" className="text-pharma-blue-400" />
            <circle cx="30" cy="40" r="2" fill="currentColor" className="text-pharma-blue-300" />
            <circle cx="70" cy="40" r="2" fill="currentColor" className="text-pharma-blue-300" />
            <circle cx="50" cy="70" r="2" fill="currentColor" className="text-pharma-blue-300" />
            <line x1="50" y1="50" x2="30" y2="40" stroke="currentColor" strokeWidth="0.5" className="text-pharma-blue-300" />
            <line x1="50" y1="50" x2="70" y2="40" stroke="currentColor" strokeWidth="0.5" className="text-pharma-blue-300" />
            <line x1="50" y1="50" x2="50" y2="70" stroke="currentColor" strokeWidth="0.5" className="text-pharma-blue-300" />
          </pattern>
          
          {/* DNA helix pattern */}
          <pattern id="helix" x="0" y="0" width="50" height="100" patternUnits="userSpaceOnUse">
            <path 
              d="M 10 0 Q 25 25 10 50 Q -5 75 10 100" 
              stroke="currentColor" 
              strokeWidth="1" 
              fill="none" 
              className="text-pharma-blue-400/30"
            />
            <path 
              d="M 40 0 Q 25 25 40 50 Q 55 75 40 100" 
              stroke="currentColor" 
              strokeWidth="1" 
              fill="none" 
              className="text-pharma-blue-400/30"
            />
          </pattern>
        </defs>
        
        {/* Animated particles */}
        {particles.map((particle) => (
          <motion.circle
            key={particle.id}
            cx={`${particle.x}%`}
            cy={`${particle.y}%`}
            r={particle.size}
            fill="currentColor"
            className="text-pharma-blue-400 dark:text-pharma-blue-300"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Subtle grid lines */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 2 }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <React.Fragment key={`grid-${i}`}>
              <line
                x1="0"
                y1={`${i * 10}%`}
                x2="100%"
                y2={`${i * 10}%`}
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-pharma-blue-300 dark:text-pharma-blue-700"
              />
              <line
                x1={`${i * 10}%`}
                y1="0"
                x2={`${i * 10}%`}
                y2="100%"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-pharma-blue-300 dark:text-pharma-blue-700"
              />
            </React.Fragment>
          ))}
        </motion.g>
      </svg>
      
      {/* Floating molecule structures */}
      <motion.div
        className={`absolute top-1/4 left-1/4 w-32 h-32 transition-opacity duration-300 ${isDark ? 'opacity-20' : 'opacity-5'}`}
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 60, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" className="text-pharma-blue-400" />
          <circle cx="50" cy="50" r="5" fill="currentColor" className="text-pharma-blue-500" />
          <circle cx="30" cy="30" r="3" fill="currentColor" className="text-pharma-blue-400" />
          <circle cx="70" cy="30" r="3" fill="currentColor" className="text-pharma-blue-400" />
          <circle cx="70" cy="70" r="3" fill="currentColor" className="text-pharma-blue-400" />
          <circle cx="30" cy="70" r="3" fill="currentColor" className="text-pharma-blue-400" />
          <line x1="50" y1="50" x2="30" y2="30" stroke="currentColor" strokeWidth="1" className="text-pharma-blue-400" />
          <line x1="50" y1="50" x2="70" y2="30" stroke="currentColor" strokeWidth="1" className="text-pharma-blue-400" />
          <line x1="50" y1="50" x2="70" y2="70" stroke="currentColor" strokeWidth="1" className="text-pharma-blue-400" />
          <line x1="50" y1="50" x2="30" y2="70" stroke="currentColor" strokeWidth="1" className="text-pharma-blue-400" />
        </svg>
      </motion.div>
      
      <motion.div
        className={`absolute bottom-1/4 right-1/4 w-24 h-24 transition-opacity duration-300 ${isDark ? 'opacity-20' : 'opacity-5'}`}
        animate={{
          rotate: -360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 45, repeat: Infinity, ease: "linear" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M 50 10 L 90 50 L 50 90 L 10 50 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-pharma-green-500"
          />
          <circle cx="50" cy="50" r="8" fill="currentColor" className="text-pharma-green-400" />
        </svg>
      </motion.div>
    </div>
  );
}

// Made with Bob
