# Tablet Image Analyzer - Implementation Guide

## 📦 Phase 1: Dependencies Installation

### Required Packages
```bash
# Core dependencies
npm install zustand axios recharts three @react-three/fiber @react-three/drei react-router-dom

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer @tailwindcss/forms @tailwindcss/typography

# Initialize Tailwind
npx tailwindcss init -p
```

### Package Versions (Recommended)
```json
{
  "dependencies": {
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
    "zustand": "^5.0.2",
    "axios": "^1.7.9",
    "recharts": "^2.15.0",
    "three": "^0.172.0",
    "@react-three/fiber": "^8.18.5",
    "@react-three/drei": "^9.122.0",
    "react-router-dom": "^7.1.3"
  },
  "devDependencies": {
    "tailwindcss": "^4.1.7",
    "postcss": "^8.5.1",
    "autoprefixer": "^10.4.20",
    "@tailwindcss/forms": "^0.5.10",
    "@tailwindcss/typography": "^0.5.16"
  }
}
```

---

## 🎨 Phase 2: Tailwind Configuration

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pharma: {
          blue: {
            50: '#f0f7ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c3d66',
          },
          green: {
            50: '#f0fdf4',
            500: '#22c55e',
            600: '#16a34a',
            900: '#145631',
          },
          amber: {
            500: '#f97316',
            600: '#ea580c',
          },
          slate: {
            50: '#fafafa',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
          }
        }
      },
      backgroundColor: {
        'dark-primary': '#0f172a',
        'dark-secondary': '#1e293b',
        'dark-tertiary': '#334155',
      },
      textColor: {
        'dark-primary': '#f1f5f9',
        'dark-secondary': '#cbd5e1',
        'dark-tertiary': '#94a3b8',
      },
      borderColor: {
        'dark-border': '#334155',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
}
```

### src/styles/theme.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    color-scheme: light;
  }
  
  :root.dark {
    color-scheme: dark;
  }
}

@layer components {
  /* Surfaces */
  .surface-primary {
    @apply bg-white dark:bg-slate-950 transition-colors duration-300;
  }

  .surface-secondary {
    @apply bg-slate-50 dark:bg-slate-900 transition-colors duration-300;
  }

  .surface-tertiary {
    @apply bg-slate-100 dark:bg-slate-800 transition-colors duration-300;
  }

  /* Text */
  .text-primary {
    @apply text-slate-900 dark:text-slate-100 transition-colors duration-300;
  }

  .text-secondary {
    @apply text-slate-600 dark:text-slate-300 transition-colors duration-300;
  }

  .text-tertiary {
    @apply text-slate-500 dark:text-slate-400 transition-colors duration-300;
  }

  /* Borders */
  .border-light {
    @apply border-slate-200 dark:border-slate-700 transition-colors duration-300;
  }

  /* Cards */
  .card {
    @apply bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm dark:shadow-md transition-all duration-300;
  }

  .card-hover {
    @apply card hover:shadow-md dark:hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600;
  }

  /* Buttons */
  .btn-primary {
    @apply bg-pharma-blue-600 dark:bg-pharma-blue-600 text-white hover:bg-pharma-blue-700 dark:hover:bg-pharma-blue-700 transition-colors duration-200 px-6 py-3 rounded-lg font-medium;
  }

  .btn-secondary {
    @apply bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200 px-6 py-3 rounded-lg font-medium;
  }

  .btn-ghost {
    @apply bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 px-6 py-3 rounded-lg font-medium;
  }

  /* Inputs */
  .input-base {
    @apply bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-pharma-blue-500 dark:focus:border-pharma-blue-400 transition-colors duration-200;
  }

  /* Badges */
  .badge-success {
    @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200;
  }

  .badge-error {
    @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200;
  }

  .badge-warning {
    @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-50 dark:bg-amber-900 text-amber-700 dark:text-amber-200;
  }

  .badge-info {
    @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200;
  }
}
```

---

## 🏗️ Phase 3: Core Components

### 1. ThemeContext (src/context/ThemeContext.jsx)
```javascript
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('pharma-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pharma-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pharma-theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

### 2. Zustand Store (src/store/analysisStore.js)
```javascript
import { create } from 'zustand';

export const useAnalysisStore = create((set) => ({
  // Upload State
  uploads: [],
  isProcessing: false,
  processingProgress: 0,
  
  // Current Analysis
  currentAnalysis: null,
  
  // Results History
  results: [],
  
  // Filters
  selectedWavelength: 'both',
  selectedTimePoint: 0,
  
  // Actions
  setUploads: (uploads) => set({ uploads }),
  
  addUpload: (upload) => set((state) => ({
    uploads: [...state.uploads, upload]
  })),
  
  updateUpload: (id, data) => set((state) => ({
    uploads: state.uploads.map(upload =>
      upload.id === id ? { ...upload, ...data } : upload
    )
  })),
  
  removeUpload: (id) => set((state) => ({
    uploads: state.uploads.filter(upload => upload.id !== id)
  })),
  
  setProcessing: (isProcessing, progress = 0) => set({
    isProcessing,
    processingProgress: progress
  }),
  
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  
  addResult: (result) => set((state) => ({
    results: [...state.results, result]
  })),
  
  clearAll: () => set({
    uploads: [],
    isProcessing: false,
    processingProgress: 0,
    currentAnalysis: null
  }),
  
  setSelectedWavelength: (wavelength) => set({ selectedWavelength: wavelength }),
  
  setSelectedTimePoint: (timePoint) => set({ selectedTimePoint: timePoint })
}));
```

### 3. API Service (src/services/api.js)
```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_KEY = import.meta.env.VITE_API_KEY || 'dev_key_test';
const TIMEOUT = parseInt(import.meta.env.VITE_TIMEOUT || '30000');

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log('[API] Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('[API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('[API] Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('[API] Response Error:', error.response?.status, error.message);
    
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      switch (status) {
        case 422:
          throw new Error(data.message || 'Invalid image format or size');
        case 408:
          throw new Error('Analysis timeout. Please try with smaller images.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(data.message || 'An error occurred');
      }
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Check your connection.');
    } else {
      // Error in request setup
      throw new Error(error.message);
    }
  }
);

export default apiClient;
```

### 4. Model Service (src/services/modelService.js)
```javascript
import apiClient from './api';

export const modelService = {
  /**
   * Analyze tablet images
   * @param {File[]} images - Array of image files
   * @param {Array} metadata - Array of {timePoint, phLevel} objects
   * @param {Object} options - Optional parameters (api, excipient)
   */
  async analyzeImages(images, metadata, options = {}) {
    const formData = new FormData();
    
    // Append images
    images.forEach((image, index) => {
      formData.append('images', image);
    });
    
    // Append metadata
    formData.append('metadata', JSON.stringify(metadata));
    
    // Append optional parameters
    if (options.api) formData.append('api', options.api);
    if (options.excipient) formData.append('excipient', options.excipient);
    
    const response = await apiClient.post('/api/v1/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log('[Upload Progress]', percentCompleted + '%');
      }
    });
    
    return response.data;
  },
  
  /**
   * Get Grad-CAM heatmap
   * @param {string} analysisId - Analysis ID
   * @param {string} wavelength - '280nm' or '520nm'
   */
  async getGradCAMHeatmap(analysisId, wavelength) {
    const response = await apiClient.get(
      `/api/v1/heatmap/${analysisId}/${wavelength}`,
      { responseType: 'blob' }
    );
    
    return URL.createObjectURL(response.data);
  },
  
  /**
   * Export analysis report
   * @param {string} analysisId - Analysis ID
   * @param {string} format - 'pdf' or 'json'
   */
  async exportReport(analysisId, format = 'pdf') {
    const response = await apiClient.post('/api/v1/export', {
      analysisId,
      format
    }, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analysis-${analysisId}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
  
  /**
   * Compare multiple analyses
   * @param {string[]} analysisIds - Array of analysis IDs
   */
  async compareAnalyses(analysisIds) {
    const response = await apiClient.post('/api/v1/compare', {
      analysisIds
    });
    
    return response.data;
  }
};
```

---

## 🎯 Phase 4: Key Component Specifications

### UploadZone Component
```javascript
// src/components/upload/UploadZone.jsx
import React, { useCallback, useState } from 'react';
import { useAnalysisStore } from '../../store/analysisStore';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png'];

export default function UploadZone() {
  const [dragActive, setDragActive] = useState(false);
  const { addUpload } = useAnalysisStore();
  
  const validateFile = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      throw new Error(`${file.name}: Only JPG and PNG files are allowed`);
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`${file.name}: File size must be under 10MB`);
    }
    return true;
  };
  
  const handleFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    
    fileArray.forEach((file) => {
      try {
        validateFile(file);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          addUpload({
            id: `${Date.now()}-${Math.random()}`,
            file,
            preview: e.target.result,
            timePoint: null,
            phLevel: null,
            status: 'pending'
          });
        };
        reader.readAsDataURL(file);
      } catch (error) {
        alert(error.message);
      }
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
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-12 text-center
        transition-all duration-200
        ${dragActive 
          ? 'border-pharma-blue-500 bg-pharma-blue-50 dark:bg-pharma-blue-900/20' 
          : 'border-slate-300 dark:border-slate-600 hover:border-pharma-blue-400'
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
      />
      
      <div className="space-y-4">
        <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        
        <div>
          <p className="text-lg font-medium text-primary">
            Drop tablet images here
          </p>
          <p className="text-sm text-secondary mt-1">
            or click to browse (JPG, PNG • Max 10MB)
          </p>
        </div>
      </div>
    </div>
  );
}
```

### TabletViewer Component (Three.js)
```javascript
// src/components/analysis/TabletViewer.jsx
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Tablet({ heatmapTexture }) {
  const meshRef = useRef();
  
  // Create chamfered cylinder geometry
  const geometry = new THREE.CylinderGeometry(1, 1, 0.3, 32, 1, false);
  
  // Apply texture if available
  const material = new THREE.MeshStandardMaterial({
    color: heatmapTexture ? 0xffffff : 0xf5f5f5,
    map: heatmapTexture,
    metalness: 0.1,
    roughness: 0.4,
  });
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });
  
  return (
    <mesh ref={meshRef} geometry={geometry} material={material}>
      <meshStandardMaterial
        color={heatmapTexture ? 0xffffff : 0xf5f5f5}
        map={heatmapTexture}
        metalness={0.1}
        roughness={0.4}
      />
    </mesh>
  );
}

export default function TabletViewer({ heatmapUrl }) {
  const [texture, setTexture] = React.useState(null);
  
  useEffect(() => {
    if (heatmapUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(heatmapUrl, (loadedTexture) => {
        loadedTexture.wrapS = THREE.RepeatWrapping;
        loadedTexture.wrapT = THREE.RepeatWrapping;
        setTexture(loadedTexture);
      });
    }
  }, [heatmapUrl]);
  
  return (
    <div className="w-full h-96 bg-slate-100 dark:bg-slate-900 rounded-lg">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Tablet heatmapTexture={texture} />
        <OrbitControls enableZoom={true} enablePan={false} />
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}
```

---

## 🔄 Phase 5: Workflow Implementation

### Complete Upload to Results Flow
```javascript
// src/hooks/useUpload.js
import { useState } from 'react';
import { useAnalysisStore } from '../store/analysisStore';
import { modelService } from '../services/modelService';

export const useUpload = () => {
  const [error, setError] = useState(null);
  const { uploads, setProcessing, setCurrentAnalysis } = useAnalysisStore();
  
  const submitAnalysis = async () => {
    try {
      setError(null);
      setProcessing(true, 0);
      
      // Validate all uploads have metadata
      const incomplete = uploads.filter(u => !u.timePoint || !u.phLevel);
      if (incomplete.length > 0) {
        throw new Error('All images must have time point and pH level');
      }
      
      // Sort by time point
      const sorted = [...uploads].sort((a, b) => a.timePoint - b.timePoint);
      
      // Prepare data
      const files = sorted.map(u => u.file);
      const metadata = sorted.map(u => ({
        timePoint: u.timePoint,
        phLevel: u.phLevel
      }));
      
      // Call API
      const result = await modelService.analyzeImages(files, metadata);
      
      setCurrentAnalysis(result);
      setProcessing(false, 100);
      
      return result;
    } catch (err) {
      setError(err.message);
      setProcessing(false, 0);
      throw err;
    }
  };
  
  return { submitAnalysis, error };
};
```

---

## 📝 Environment Setup

### .env.local (Development)
```
VITE_API_URL=http://localhost:8000
VITE_API_KEY=dev_key_test
VITE_MODEL_ENDPOINT=/api/v1/analyze
VITE_TIMEOUT=30000
```

### .env.production (Production)
```
VITE_API_URL=https://api.pharma-analyzer.com
VITE_API_KEY=prod_key_****
VITE_MODEL_ENDPOINT=/api/v1/analyze
VITE_TIMEOUT=60000
```

---

## 🚀 Next Steps

1. Install all dependencies
2. Configure Tailwind
3. Set up theme system
4. Create folder structure
5. Implement Zustand store
6. Build API services
7. Create core components
8. Implement upload flow
9. Build 3D visualization
10. Create results dashboard

**Ready to begin implementation!**