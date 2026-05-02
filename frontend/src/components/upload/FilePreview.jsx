import React from 'react';
import { useAnalysisStore } from '../../store/analysisStore';
import { formatFileSize } from '../../utils/formatters';

export default function FilePreview() {
  const { uploads, removeUpload } = useAnalysisStore();
  
  if (uploads.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary">
          Uploaded Images ({uploads.length})
        </h3>
        {uploads.length > 0 && (
          <button
            onClick={() => uploads.forEach(u => removeUpload(u.id))}
            className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
          >
            Clear All
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {uploads.map((upload) => (
          <div
            key={upload.id}
            className="card-hover relative group"
          >
            {/* Image Preview */}
            <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden mb-3">
              <img
                src={upload.preview}
                alt={upload.file.name}
                className="w-full h-full object-cover"
              />
              
              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                {upload.timePoint !== null && upload.phLevel !== null ? (
                  <span className="badge-success text-xs">
                    ✓ Complete
                  </span>
                ) : (
                  <span className="badge-warning text-xs">
                    ⚠ Pending
                  </span>
                )}
              </div>
              
              {/* Remove Button */}
              <button
                onClick={() => removeUpload(upload.id)}
                className="absolute top-2 left-2 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove image"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* File Info */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-primary truncate" title={upload.file.name}>
                {upload.file.name}
              </p>
              
              <div className="flex items-center justify-between text-xs text-secondary">
                <span>{formatFileSize(upload.file.size)}</span>
                <span>{upload.file.type.split('/')[1].toUpperCase()}</span>
              </div>
              
              {/* Metadata Display */}
              {(upload.timePoint !== null || upload.phLevel !== null) && (
                <div className="pt-2 border-t border-light space-y-1">
                  {upload.timePoint !== null && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-tertiary">Time Point:</span>
                      <span className="text-primary font-medium">{upload.timePoint} min</span>
                    </div>
                  )}
                  {upload.phLevel !== null && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-tertiary">pH Level:</span>
                      <span className="text-primary font-medium">{upload.phLevel}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary */}
      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-secondary">
            Total: <span className="font-semibold text-primary">{uploads.length}</span> images
          </span>
          <span className="text-secondary">
            Complete: <span className="font-semibold text-pharma-green-600 dark:text-pharma-green-400">
              {uploads.filter(u => u.timePoint !== null && u.phLevel !== null).length}
            </span>
          </span>
          <span className="text-secondary">
            Pending: <span className="font-semibold text-pharma-amber-600 dark:text-pharma-amber-400">
              {uploads.filter(u => u.timePoint === null || u.phLevel === null).length}
            </span>
          </span>
        </div>
        
        <div className="text-xs text-tertiary">
          {formatFileSize(uploads.reduce((sum, u) => sum + u.file.size, 0))} total
        </div>
      </div>
    </div>
  );
}

// Made with Bob
