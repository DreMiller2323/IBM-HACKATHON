import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalysisStore } from '../../store/analysisStore';
import { validateImageFile } from '../../utils/validation';
import { PH_LEVELS } from '../../utils/constants';
import ImageCropper from './ImageCropper';

/**
 * AtomicImageUpload - Each image has its own inline metadata fields
 * Ensures strict binding: [{ file: File, time: number, ph: number }]
 */
export default function AtomicImageUpload({ onAnalyze }) {
  const { uploads, setUploads } = useAnalysisStore();
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [cropperImage, setCropperImage] = useState(null);

  // Handle file selection
  const handleFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    const validFiles = [];
    const newErrors = {};

    fileArray.forEach((file, index) => {
      const validation = validateImageFile(file);
      if (validation.valid) {
        validFiles.push({
          id: `${Date.now()}-${index}`,
          file,
          preview: URL.createObjectURL(file),
          time: null, // User must fill
          ph: null,   // User must fill
          status: 'pending', // pending | complete
        });
      } else {
        newErrors[file.name] = validation.error;
      }
    });

    setUploads([...uploads, ...validFiles]);
    setErrors(newErrors);
  }, [uploads, setUploads]);

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  // Update metadata for specific image
  const updateMetadata = useCallback((id, field, value) => {
    setUploads(uploads.map(upload => {
      if (upload.id === id) {
        const updated = { ...upload, [field]: value };
        // Mark as complete if both fields are filled
        if (updated.time !== null && updated.ph !== null) {
          updated.status = 'complete';
        } else {
          updated.status = 'pending';
        }
        return updated;
      }
      return upload;
    }));
  }, [uploads, setUploads]);

  // Remove image
  const removeImage = useCallback((id) => {
    const upload = uploads.find(u => u.id === id);
    if (upload?.preview) {
      URL.revokeObjectURL(upload.preview);
    }
    setUploads(uploads.filter(u => u.id !== id));
  }, [uploads, setUploads]);

  // Open cropper for specific image
  const openCropper = useCallback((upload) => {
    setCropperImage(upload);
  }, []);

  // Handle crop complete
  const handleCropComplete = useCallback(async (croppedBlob) => {
    if (!cropperImage) return;

    // Create new file from cropped blob
    const croppedFile = new File([croppedBlob], cropperImage.file.name, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });

    // Create new preview URL
    const newPreview = URL.createObjectURL(croppedBlob);

    // Revoke old preview URL
    if (cropperImage.preview) {
      URL.revokeObjectURL(cropperImage.preview);
    }

    // Update upload with cropped image
    setUploads(uploads.map(u =>
      u.id === cropperImage.id
        ? { ...u, file: croppedFile, preview: newPreview }
        : u
    ));

    // Close cropper
    setCropperImage(null);
  }, [cropperImage, uploads, setUploads]);

  // Cancel cropping
  const handleCropCancel = useCallback(() => {
    setCropperImage(null);
  }, []);

  // Check if all images have complete metadata
  const allComplete = uploads.length > 0 && uploads.every(u => u.status === 'complete');

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 transition-all duration-300
          ${dragActive 
            ? 'border-pharma-blue-500 bg-pharma-blue-50 dark:bg-pharma-blue-900/20' 
            : 'border-slate-300 dark:border-slate-700 hover:border-pharma-blue-400 dark:hover:border-pharma-blue-600'
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
        
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
            Drag and drop tablet images here
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            or click to browse (JPG, PNG • Max 10MB per file)
          </p>
        </div>
      </div>

      {/* Error Messages */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
            Upload Errors:
          </p>
          <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
            {Object.entries(errors).map(([filename, error]) => (
              <li key={filename}>• {filename}: {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Uploaded Images with Inline Metadata */}
      <AnimatePresence>
        {uploads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">
                Specimen Images ({uploads.length})
              </h3>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${allComplete ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {uploads.filter(u => u.status === 'complete').length} / {uploads.length} Complete
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {uploads.map((upload, index) => (
                <motion.div
                  key={upload.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    card p-4 border-2 transition-all duration-200
                    ${upload.status === 'complete' 
                      ? 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10' 
                      : 'border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10'
                    }
                  `}
                >
                  <div className="flex gap-4">
                    {/* Image Preview with Crop Button */}
                    <div className="flex-shrink-0 relative group">
                      <img
                        src={upload.preview}
                        alt={upload.file.name}
                        className="w-24 h-24 object-cover rounded-lg border-2 border-slate-200 dark:border-slate-700"
                      />
                      <button
                        onClick={() => openCropper(upload)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                        title="Crop image"
                      >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                        </svg>
                      </button>
                    </div>

                    {/* Metadata Form */}
                    <div className="flex-1 space-y-3">
                      {/* File Info */}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-primary truncate max-w-xs">
                            {upload.file.name}
                          </p>
                          <p className="text-xs text-secondary">
                            {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={() => removeImage(upload.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          title="Remove image"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Inline Metadata Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Time Point */}
                        <div>
                          <label className="block text-xs font-medium text-secondary mb-1">
                            Time Point (minutes) *
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={upload.time ?? ''}
                              onChange={(e) => updateMetadata(upload.id, 'time', e.target.value ? parseFloat(e.target.value) : null)}
                              placeholder="e.g., 0, 30, 60"
                              className="input-base flex-1 text-sm"
                            />
                            {/* Quick presets */}
                            <div className="flex gap-1">
                              {[0, 30, 60, 120].map(preset => (
                                <button
                                  key={preset}
                                  onClick={() => updateMetadata(upload.id, 'time', preset)}
                                  className={`
                                    px-2 py-1 text-xs rounded border transition-colors
                                    ${upload.time === preset
                                      ? 'bg-pharma-blue-600 text-white border-pharma-blue-600'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }
                                  `}
                                >
                                  {preset}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* pH Level */}
                        <div>
                          <label className="block text-xs font-medium text-secondary mb-1">
                            Medium pH Level *
                          </label>
                          <select
                            value={upload.ph ?? ''}
                            onChange={(e) => updateMetadata(upload.id, 'ph', e.target.value ? parseFloat(e.target.value) : null)}
                            className="input-base w-full text-sm"
                          >
                            <option value="">Select pH...</option>
                            {PH_LEVELS.map(level => (
                              <option key={level.value} value={level.value}>
                                {level.label} - {level.description}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        {upload.status === 'complete' ? (
                          <span className="badge-success text-xs">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Metadata Complete
                          </span>
                        ) : (
                          <span className="badge-warning text-xs">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Awaiting Metadata
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary & Action Button */}
      {uploads.length > 0 && (
        <div className="space-y-4">
          <div className="card bg-pharma-blue-50 dark:bg-pharma-blue-900/20 border-pharma-blue-200 dark:border-pharma-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary">
                  Analysis Readiness
                </p>
                <p className="text-xs text-secondary mt-1">
                  {allComplete
                    ? 'All specimens have complete metadata. Ready to analyze.'
                    : `${uploads.filter(u => u.status === 'pending').length} specimen(s) require metadata input.`
                  }
                </p>
              </div>
              {allComplete && (
                <svg className="w-8 h-8 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>

          {/* Local Action Buttons */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setUploads([])}
              className="btn-secondary flex-1"
            >
              <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
            
            <button
              onClick={() => allComplete && onAnalyze && onAnalyze()}
              disabled={!allComplete}
              className={`
                flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-sm
                transition-all duration-200 shadow-lg
                ${allComplete
                  ? 'bg-gradient-to-r from-pharma-blue-600 to-pharma-blue-700 hover:from-pharma-blue-700 hover:to-pharma-blue-800 text-white shadow-pharma-blue-500/50 hover:shadow-xl'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                }
              `}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Analysis ({uploads.length} specimen{uploads.length !== 1 ? 's' : ''})
            </button>
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      {cropperImage && (
        <ImageCropper
          image={cropperImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}

// Made with Bob
