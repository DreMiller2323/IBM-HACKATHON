import React from 'react';
import { motion } from 'framer-motion';
import { useAnalysisStore } from '../../store/analysisStore';

/**
 * GlobalCTA - Persistent Call-to-Action button
 * Sticky header button that's always visible and adapts to current state
 */
export default function GlobalCTA({ onStartAnalysis }) {
  const { uploads, processing } = useAnalysisStore();
  
  // Check if all uploads have complete metadata
  const allComplete = uploads.length > 0 && uploads.every(u => u.status === 'complete');
  const canAnalyze = allComplete && !processing;
  
  // Button text based on state
  const getButtonText = () => {
    if (processing) return 'Analyzing...';
    if (uploads.length === 0) return 'Upload Specimens';
    if (!allComplete) return `Complete Metadata (${uploads.filter(u => u.status === 'complete').length}/${uploads.length})`;
    return 'Start Analysis';
  };

  // Button icon based on state
  const getButtonIcon = () => {
    if (processing) {
      return (
        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      );
    }
    
    if (canAnalyze) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    }
    
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    );
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-lg"
    >
      <div className="container-app py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pharma-blue-500 to-pharma-blue-700 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary">
                Tablet Image Analyzer
              </h1>
              <p className="text-xs text-secondary">
                AI-Powered Pharmaceutical Analysis
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          {uploads.length > 0 && (
            <div className="hidden md:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-secondary">Specimens:</span>
                <span className="font-semibold text-primary">{uploads.length}</span>
              </div>
              <div className="w-px h-6 bg-slate-300 dark:bg-slate-700" />
              <div className="flex items-center gap-2">
                <span className="text-secondary">Complete:</span>
                <span className={`font-semibold ${allComplete ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {uploads.filter(u => u.status === 'complete').length}/{uploads.length}
                </span>
              </div>
            </div>
          )}

          {/* CTA Button */}
          <motion.button
            onClick={onStartAnalysis}
            disabled={!canAnalyze}
            whileHover={canAnalyze ? { scale: 1.05 } : {}}
            whileTap={canAnalyze ? { scale: 0.95 } : {}}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm
              transition-all duration-200 shadow-lg
              ${canAnalyze
                ? 'bg-gradient-to-r from-pharma-blue-600 to-pharma-blue-700 hover:from-pharma-blue-700 hover:to-pharma-blue-800 text-white shadow-pharma-blue-500/50'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
              }
            `}
          >
            {getButtonIcon()}
            <span>{getButtonText()}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// Made with Bob
