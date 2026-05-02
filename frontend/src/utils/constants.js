/**
 * Application constants
 */

// pH Levels
export const PH_LEVELS = [
  { value: 1.2, label: 'pH 1.2 (Acidic - Gastric)', description: 'Simulates stomach environment' },
  { value: 4.5, label: 'pH 4.5 (Acidic)', description: 'Intermediate acidic environment' },
  { value: 6.8, label: 'pH 6.8 (Neutral - Intestinal)', description: 'Simulates small intestine' },
  { value: 7.4, label: 'pH 7.4 (Alkaline - Blood)', description: 'Physiological pH' }
];

// Common APIs (Active Pharmaceutical Ingredients)
export const COMMON_APIS = [
  'Acetylsalicylic Acid',
  'Ibuprofen',
  'Paracetamol',
  'Metformin',
  'Atorvastatin',
  'Amlodipine',
  'Omeprazole',
  'Losartan',
  'Simvastatin',
  'Levothyroxine'
];

// Common Excipients
export const COMMON_EXCIPIENTS = [
  'Lactose',
  'Microcrystalline Cellulose',
  'Starch',
  'Methylcellulose',
  'Hydroxypropyl Methylcellulose (HPMC)',
  'Polyvinylpyrrolidone (PVP)',
  'Magnesium Stearate',
  'Talc',
  'Silicon Dioxide',
  'Croscarmellose Sodium'
];

// Wavelengths
export const WAVELENGTHS = {
  UV: '280nm',
  VISIBLE: '520nm',
  BOTH: 'both'
};

export const WAVELENGTH_INFO = {
  '280nm': {
    name: 'UV (280nm)',
    description: 'API detection and surface dissolution',
    color: '#8b5cf6',
    focus: 'Tablet edges and API release zones'
  },
  '520nm': {
    name: 'Visible (520nm)',
    description: 'Structural changes and matrix erosion',
    color: '#22c55e',
    focus: 'Tablet core and gel layer formation'
  }
};

// Model Performance Metrics
export const MODEL_METRICS = {
  R2: 0.89,
  RMSE: 11.57,
  PROCESSING_TIME: 30, // seconds
  WAVELENGTHS_COUNT: 2
};

// File Upload Limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 10,
  ACCEPTED_TYPES: ['image/jpeg', 'image/png'],
  MIN_DIMENSION: 224
};

// Time Point Presets (in minutes)
export const TIME_POINT_PRESETS = [
  0, 5, 10, 15, 20, 30, 45, 60, 90, 120, 180, 240
];

// Dissolution Profile Stages
export const DISSOLUTION_STAGES = {
  IMMEDIATE: { min: 0, max: 30, label: 'Immediate Release', color: '#ef4444' },
  EARLY: { min: 30, max: 60, label: 'Early Phase', color: '#f97316' },
  SUSTAINED: { min: 60, max: 180, label: 'Sustained Release', color: '#eab308' },
  COMPLETE: { min: 180, max: 240, label: 'Complete Dissolution', color: '#22c55e' }
};

// Severity Index Thresholds
export const SEVERITY_THRESHOLDS = {
  LOW: { max: 40, label: 'Low', color: '#22c55e' },
  MODERATE: { min: 40, max: 70, label: 'Moderate', color: '#eab308' },
  HIGH: { min: 70, label: 'High', color: '#ef4444' }
};

// Chart Colors (Light/Dark mode compatible)
export const CHART_COLORS = {
  primary: {
    light: '#0284c7',
    dark: '#3b82f6'
  },
  secondary: {
    light: '#22c55e',
    dark: '#22c55e'
  },
  accent: {
    light: '#f97316',
    dark: '#fb923c'
  },
  grid: {
    light: '#e5e7eb',
    dark: '#334155'
  },
  text: {
    light: '#6b7280',
    dark: '#cbd5e1'
  }
};

// Export Formats
export const EXPORT_FORMATS = [
  { value: 'pdf', label: 'PDF Report', icon: '📄' },
  { value: 'json', label: 'JSON Data', icon: '📊' },
  { value: 'csv', label: 'CSV Data', icon: '📈' }
];

// Analysis Status
export const ANALYSIS_STATUS = {
  PENDING: 'pending',
  UPLOADING: 'uploading',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Error Messages
export const ERROR_MESSAGES = {
  NO_FILES: 'Please upload at least one image',
  INVALID_FILE_TYPE: 'Only JPG and PNG files are allowed',
  FILE_TOO_LARGE: 'File size exceeds 10MB limit',
  TOO_MANY_FILES: 'Maximum 10 files allowed',
  MISSING_METADATA: 'All images must have time point and pH level',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT_ERROR: 'Request timeout. Please try with smaller files.',
  VALIDATION_ERROR: 'Validation failed. Please check your inputs.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  UPLOAD_COMPLETE: 'Images uploaded successfully',
  ANALYSIS_COMPLETE: 'Analysis completed successfully',
  EXPORT_COMPLETE: 'Report exported successfully',
  METADATA_SAVED: 'Metadata saved successfully'
};

// API Endpoints (relative to base URL)
export const API_ENDPOINTS = {
  ANALYZE: '/api/v1/analyze',
  HEATMAP: '/api/v1/heatmap',
  EXPORT: '/api/v1/export',
  COMPARE: '/api/v1/compare',
  ANALYSIS: '/api/v1/analysis',
  ANALYSES: '/api/v1/analyses'
};

// Made with Bob
