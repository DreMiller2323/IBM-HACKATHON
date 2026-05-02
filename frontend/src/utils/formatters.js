/**
 * Formatting utilities for display
 */

/**
 * Format number to fixed decimal places
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  return Number(value).toFixed(decimals);
};

/**
 * Format percentage
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format time duration
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
export const formatDuration = (minutes) => {
  if (minutes === null || minutes === undefined || isNaN(minutes)) {
    return 'N/A';
  }
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours} hr`;
  }
  
  return `${hours} hr ${mins} min`;
};

/**
 * Format timestamp
 * @param {Date | string | number} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatTimestamp = (date) => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }
  
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format pH level with description
 * @param {number} ph - pH level
 * @returns {string} Formatted pH with description
 */
export const formatPh = (ph) => {
  if (ph === null || ph === undefined || isNaN(ph)) {
    return 'N/A';
  }
  
  const phNum = Number(ph);
  let description = '';
  
  if (phNum < 3) {
    description = ' (Highly Acidic)';
  } else if (phNum < 6) {
    description = ' (Acidic)';
  } else if (phNum < 8) {
    description = ' (Neutral)';
  } else if (phNum < 11) {
    description = ' (Alkaline)';
  } else {
    description = ' (Highly Alkaline)';
  }
  
  return `pH ${phNum.toFixed(1)}${description}`;
};

/**
 * Format R² score with interpretation
 * @param {number} r2 - R² score
 * @returns {Object} { value: string, interpretation: string, color: string }
 */
export const formatR2Score = (r2) => {
  if (r2 === null || r2 === undefined || isNaN(r2)) {
    return { value: 'N/A', interpretation: 'Unknown', color: 'gray' };
  }
  
  const value = formatPercentage(r2 * 100, 1);
  let interpretation = '';
  let color = '';
  
  if (r2 >= 0.90) {
    interpretation = 'Excellent';
    color = 'green';
  } else if (r2 >= 0.80) {
    interpretation = 'Very Good';
    color = 'blue';
  } else if (r2 >= 0.70) {
    interpretation = 'Good';
    color = 'yellow';
  } else if (r2 >= 0.50) {
    interpretation = 'Fair';
    color = 'orange';
  } else {
    interpretation = 'Poor';
    color = 'red';
  }
  
  return { value, interpretation, color };
};

/**
 * Format RMSE with unit
 * @param {number} rmse - RMSE value
 * @returns {string} Formatted RMSE
 */
export const formatRMSE = (rmse) => {
  if (rmse === null || rmse === undefined || isNaN(rmse)) {
    return 'N/A';
  }
  return `${formatNumber(rmse, 2)}%`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format analysis ID for display
 * @param {string} id - Analysis ID
 * @returns {string} Formatted ID
 */
export const formatAnalysisId = (id) => {
  if (!id) return 'N/A';
  // Show first 8 characters
  return id.substring(0, 8).toUpperCase();
};

/**
 * Format wavelength for display
 * @param {string} wavelength - Wavelength value
 * @returns {string} Formatted wavelength
 */
export const formatWavelength = (wavelength) => {
  const wavelengthMap = {
    '280nm': '280nm (UV)',
    '520nm': '520nm (Visible)',
    'both': 'Both Wavelengths'
  };
  
  return wavelengthMap[wavelength] || wavelength;
};

/**
 * Format confidence score with color
 * @param {number} confidence - Confidence score (0-1)
 * @returns {Object} { value: string, color: string, label: string }
 */
export const formatConfidence = (confidence) => {
  if (confidence === null || confidence === undefined || isNaN(confidence)) {
    return { value: 'N/A', color: 'gray', label: 'Unknown' };
  }
  
  const percentage = confidence * 100;
  const value = formatPercentage(percentage, 1);
  let color = '';
  let label = '';
  
  if (percentage >= 90) {
    color = 'green';
    label = 'Very High';
  } else if (percentage >= 75) {
    color = 'blue';
    label = 'High';
  } else if (percentage >= 60) {
    color = 'yellow';
    label = 'Moderate';
  } else if (percentage >= 40) {
    color = 'orange';
    label = 'Low';
  } else {
    color = 'red';
    label = 'Very Low';
  }
  
  return { value, color, label };
};

/**
 * Format array as comma-separated list
 * @param {Array} arr - Array to format
 * @param {string} conjunction - Conjunction word (and/or)
 * @returns {string} Formatted list
 */
export const formatList = (arr, conjunction = 'and') => {
  if (!arr || arr.length === 0) return '';
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} ${conjunction} ${arr[1]}`;
  
  const last = arr[arr.length - 1];
  const rest = arr.slice(0, -1);
  return `${rest.join(', ')}, ${conjunction} ${last}`;
};

/**
 * Format time point for display
 * @param {number} timePoint - Time point in minutes
 * @returns {string} Formatted time point
 */
export const formatTimePoint = (timePoint) => {
  if (timePoint === null || timePoint === undefined || isNaN(timePoint)) {
    return 'N/A';
  }
  
  if (timePoint === 0) {
    return 't = 0 (Baseline)';
  }
  
  return `t = ${timePoint} min`;
};

// Made with Bob
