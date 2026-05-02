/**
 * Validation utilities for file uploads and form inputs
 */

// File validation constants
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES = 10;
export const MIN_IMAGE_DIMENSION = 224; // Recommended for CNN model

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {Object} { valid: boolean, error: string | null }
 */
export const validateImageFile = (file) => {
  // Check file type
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `${file.name}: Only JPG and PNG files are allowed`
    };
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `${file.name}: File size (${sizeMB}MB) exceeds 10MB limit`
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate multiple image files
 * @param {FileList | File[]} files - Files to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export const validateImageFiles = (files) => {
  const fileArray = Array.from(files);
  const errors = [];
  
  // Check number of files
  if (fileArray.length > MAX_FILES) {
    errors.push(`Maximum ${MAX_FILES} files allowed. You selected ${fileArray.length} files.`);
    return { valid: false, errors };
  }
  
  if (fileArray.length === 0) {
    errors.push('Please select at least one image file');
    return { valid: false, errors };
  }
  
  // Validate each file
  fileArray.forEach(file => {
    const result = validateImageFile(file);
    if (!result.valid) {
      errors.push(result.error);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validate time point
 * @param {number} timePoint - Time point in minutes
 * @returns {Object} { valid: boolean, error: string | null }
 */
export const validateTimePoint = (timePoint) => {
  if (timePoint === null || timePoint === undefined || timePoint === '') {
    return { valid: false, error: 'Time point is required' };
  }
  
  const num = Number(timePoint);
  
  if (isNaN(num)) {
    return { valid: false, error: 'Time point must be a number' };
  }
  
  if (num < 0) {
    return { valid: false, error: 'Time point cannot be negative' };
  }
  
  if (num > 1440) { // 24 hours
    return { valid: false, error: 'Time point cannot exceed 1440 minutes (24 hours)' };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate pH level
 * @param {number} phLevel - pH level
 * @returns {Object} { valid: boolean, error: string | null }
 */
export const validatePhLevel = (phLevel) => {
  if (phLevel === null || phLevel === undefined || phLevel === '') {
    return { valid: false, error: 'pH level is required' };
  }
  
  const num = Number(phLevel);
  
  if (isNaN(num)) {
    return { valid: false, error: 'pH level must be a number' };
  }
  
  if (num < 1.0 || num > 14.0) {
    return { valid: false, error: 'pH level must be between 1.0 and 14.0' };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate upload metadata
 * @param {Object} metadata - { timePoint, phLevel }
 * @returns {Object} { valid: boolean, errors: Object }
 */
export const validateMetadata = (metadata) => {
  const errors = {};
  
  const timePointResult = validateTimePoint(metadata.timePoint);
  if (!timePointResult.valid) {
    errors.timePoint = timePointResult.error;
  }
  
  const phLevelResult = validatePhLevel(metadata.phLevel);
  if (!phLevelResult.valid) {
    errors.phLevel = phLevelResult.error;
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Check if image dimensions meet minimum requirements
 * @param {File} file - Image file
 * @returns {Promise<Object>} { valid: boolean, width: number, height: number, error: string | null }
 */
export const validateImageDimensions = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      if (img.width < MIN_IMAGE_DIMENSION || img.height < MIN_IMAGE_DIMENSION) {
        resolve({
          valid: false,
          width: img.width,
          height: img.height,
          error: `Image dimensions (${img.width}x${img.height}) are too small. Minimum ${MIN_IMAGE_DIMENSION}x${MIN_IMAGE_DIMENSION} recommended.`
        });
      } else {
        resolve({
          valid: true,
          width: img.width,
          height: img.height,
          error: null
        });
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        valid: false,
        width: 0,
        height: 0,
        error: 'Failed to load image'
      });
    };
    
    img.src = url;
  });
};

// Made with Bob
