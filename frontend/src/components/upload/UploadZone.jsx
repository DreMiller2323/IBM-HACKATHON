import React, { useCallback, useState } from 'react';
import { useAnalysisStore } from '../../store/analysisStore';
import { validateImageFiles } from '../../utils/validation';

export default function UploadZone() {
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState([]);
  const { addUpload } = useAnalysisStore();
  
  const handleFiles = useCallback((files) => {
    setErrors([]);
    
    // Validate files
    const validation = validateImageFiles(files);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    
    const fileArray = Array.from(files);
    
    // Process each file
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        addUpload({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview: e.target.result,
          timePoint: null,
          phLevel: null,
          status: 'pending'
        });
      };
      reader.readAsDataURL(file);
    });
  }, [addUpload]);
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };
  
  return (
    <div className="space-y-4">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-12 text-center
          transition-all duration-200
          ${dragActive 
            ? 'border-pharma-blue-500 bg-pharma-blue-50 dark:bg-pharma-blue-900/20 scale-105' 
            : 'border-slate-300 dark:border-slate-600 hover:border-pharma-blue-400 dark:hover:border-pharma-blue-500'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="file-upload"
        />
        
        <div className="space-y-4">
          {/* Upload Icon */}
          <div className="flex justify-center">
            <svg 
              className={`h-16 w-16 transition-colors ${
                dragActive 
                  ? 'text-pharma-blue-600 dark:text-pharma-blue-400' 
                  : 'text-slate-400 dark:text-slate-500'
              }`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
          </div>
          
          {/* Text */}
          <div>
            <p className="text-lg font-medium text-primary">
              {dragActive ? 'Drop images here' : 'Drop tablet images here'}
            </p>
            <p className="text-sm text-secondary mt-1">
              or click to browse
            </p>
          </div>
          
          {/* File Requirements */}
          <div className="flex items-center justify-center gap-4 text-xs text-tertiary">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              JPG, PNG
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Max 10MB
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Up to 10 files
            </span>
          </div>
        </div>
      </div>
      
      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                Upload Error
              </h4>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Made with Bob
