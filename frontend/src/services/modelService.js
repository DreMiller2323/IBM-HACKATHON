import apiClient from './api';

export const modelService = {
  /**
   * Analyze tablet images
   * @param {File[]} images - Array of image files
   * @param {Array} metadata - Array of {timePoint, phLevel} objects
   * @param {Object} options - Optional parameters (api, excipient)
   * @returns {Promise<Object>} Analysis results
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
    
    console.log('[ModelService] Sending analysis request', {
      url: '/api/v1/analyze',
      imageCount: images.length,
      metadata,
    });

    const response = await apiClient.post('/api/v1/analyze', formData, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log('[Upload Progress]', percentCompleted + '%');
        
        // You can dispatch this to a callback if needed
        if (options.onProgress) {
          options.onProgress(percentCompleted);
        }
      }
    });
    
    return response.data;
  },
  
  /**
   * Get Grad-CAM heatmap
   * @param {string} analysisId - Analysis ID
   * @param {string} wavelength - '280nm' or '520nm'
   * @returns {Promise<string>} Blob URL of the heatmap image
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
    
    return true;
  },
  
  /**
   * Compare multiple analyses
   * @param {string[]} analysisIds - Array of analysis IDs
   * @returns {Promise<Object>} Comparison results
   */
  async compareAnalyses(analysisIds) {
    const response = await apiClient.post('/api/v1/compare', {
      analysisIds
    });
    
    return response.data;
  },
  
  /**
   * Get analysis by ID
   * @param {string} analysisId - Analysis ID
   * @returns {Promise<Object>} Analysis data
   */
  async getAnalysis(analysisId) {
    const response = await apiClient.get(`/api/v1/analysis/${analysisId}`);
    return response.data;
  },
  
  /**
   * List all analyses
   * @param {Object} params - Query parameters (limit, offset, etc.)
   * @returns {Promise<Array>} List of analyses
   */
  async listAnalyses(params = {}) {
    const response = await apiClient.get('/api/v1/analyses', { params });
    return response.data;
  },
  
  /**
   * Delete an analysis
   * @param {string} analysisId - Analysis ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteAnalysis(analysisId) {
    await apiClient.delete(`/api/v1/analysis/${analysisId}`);
    return true;
  },
  
  /**
   * Mock analysis for development (when backend is not available)
   * @param {File[]} images - Array of image files
   * @param {Array} metadata - Array of {timePoint, phLevel} objects
   * @returns {Promise<Object>} Mock analysis results
   */
  async mockAnalyze(images, metadata) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock dissolution curve
    const dissolutionCurve = [];
    for (let t = 0; t <= 240; t += 5) {
      const q = Math.min(100, (t / 240) * 100 + Math.random() * 10);
      dissolutionCurve.push({ time: t, q: parseFloat(q.toFixed(2)) });
    }
    
    return {
      id: `mock-${Date.now()}`,
      r2: 0.89,
      rmse: 11.57,
      dissolution_curve: dissolutionCurve,
      parameters: {
        api: 'Acetylsalicylic Acid',
        excipient: 'Lactose',
        ph: `pH ${metadata[0]?.phLevel || 1.2}`
      },
      grad_cam_280: {
        focusRegion: 'Tablet edges',
        mechanism: 'API surface dissolution',
        intensity: 87,
        heatmapUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      },
      grad_cam_520: {
        focusRegion: 'Tablet core',
        mechanism: 'Matrix erosion & gel layer formation',
        intensity: 76,
        heatmapUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=='
      },
      timePoints: metadata.map(m => m.timePoint).sort((a, b) => a - b)
    };
  }
};

// Made with Bob
