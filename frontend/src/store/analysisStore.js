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
  selectedWavelength: 'both', // 'both' | '280nm' | '520nm'
  selectedTimePoint: 0,
  
  // Error State
  error: null,
  
  // Actions
  setUploads: (uploads) => set({ uploads }),
  
  addUpload: (upload) => set((state) => ({
    uploads: [...state.uploads, {
      ...upload,
      id: upload.id || `${Date.now()}-${Math.random()}`,
      status: upload.status || 'pending'
    }]
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
    processingProgress: progress,
    error: null
  }),
  
  setCurrentAnalysis: (analysis) => set({ 
    currentAnalysis: analysis,
    error: null
  }),
  
  addResult: (result) => set((state) => ({
    results: [...state.results, result]
  })),
  
  clearAll: () => set({
    uploads: [],
    isProcessing: false,
    processingProgress: 0,
    currentAnalysis: null,
    error: null
  }),
  
  setSelectedWavelength: (wavelength) => set({ selectedWavelength: wavelength }),
  
  setSelectedTimePoint: (timePoint) => set({ selectedTimePoint: timePoint }),
  
  setError: (error) => set({ 
    error,
    isProcessing: false 
  }),
  
  // Utility Actions
  sortUploadsByTime: () => set((state) => ({
    uploads: [...state.uploads].sort((a, b) => 
      (a.timePoint || 0) - (b.timePoint || 0)
    )
  })),
  
  validateUploads: () => {
    const state = useAnalysisStore.getState();
    const incomplete = state.uploads.filter(u => 
      u.timePoint === null || u.timePoint === undefined || 
      u.phLevel === null || u.phLevel === undefined
    );
    
    if (incomplete.length > 0) {
      set({ error: 'All images must have time point and pH level' });
      return false;
    }
    
    if (state.uploads.length === 0) {
      set({ error: 'Please upload at least one image' });
      return false;
    }
    
    set({ error: null });
    return true;
  }
}));

// Made with Bob
