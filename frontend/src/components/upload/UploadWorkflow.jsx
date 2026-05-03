import React, { useState } from 'react';
import { useAnalysisStore } from '../../store/analysisStore';
import { modelService } from '../../services/modelService';
import UploadZone from './UploadZone';
import FilePreview from './FilePreview';
import ImageMetadataForm from './ImageMetadataForm';

export default function UploadWorkflow({ onAnalysisComplete }) {
  const { 
    uploads, 
    isProcessing, 
    processingProgress,
    setProcessing, 
    setCurrentAnalysis,
    sortUploadsByTime,
    validateUploads,
    error: storeError
  } = useAnalysisStore();
  
  const [currentStep, setCurrentStep] = useState('upload'); // 'upload' | 'metadata' | 'processing'
  const [selectedUploadIndex, setSelectedUploadIndex] = useState(0);
  const [error, setError] = useState(null);
  
  const incompleteUploads = uploads.filter(u => u.timePoint === null || u.phLevel === null);
  const completeUploads = uploads.filter(u => u.timePoint !== null && u.phLevel !== null);
  const currentUpload = incompleteUploads[selectedUploadIndex];
  
  const handleContinueToMetadata = () => {
    if (uploads.length === 0) {
      setError('Please upload at least one image');
      return;
    }
    setError(null);
    setCurrentStep('metadata');
  };
  
  const handleNextImage = () => {
    if (selectedUploadIndex < incompleteUploads.length - 1) {
      setSelectedUploadIndex(selectedUploadIndex + 1);
    } else if (incompleteUploads.length === 0) {
      // All metadata complete, ready to analyze
      setCurrentStep('upload');
    }
  };
  
  const handlePreviousImage = () => {
    if (selectedUploadIndex > 0) {
      setSelectedUploadIndex(selectedUploadIndex - 1);
    }
  };
  
  const handleSkipImage = () => {
    handleNextImage();
  };
  
  const handleAnalyze = async () => {
    setError(null);
    
    // Validate all uploads have metadata
    if (!validateUploads()) {
      setError(storeError || 'All images must have time point and pH level');
      return;
    }
    
    try {
      setCurrentStep('processing');
      setProcessing(true, 0);
      
      // Sort uploads by time point
      sortUploadsByTime();
      
      // Prepare data for API
      const files = uploads.map(u => u.file);
      const metadata = uploads.map(u => ({
        timePoint: u.timePoint,
        phLevel: u.phLevel
      }));
      
      // Call real analysis API with image data
      const result = await modelService.analyzeImages(files, metadata);
      
      setProcessing(false, 100);
      setCurrentAnalysis(result);
      
      // Notify parent component
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
      setProcessing(false, 0);
      setCurrentStep('upload');
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        <div className={`flex items-center gap-2 ${currentStep === 'upload' ? 'text-pharma-blue-600 dark:text-pharma-blue-400' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
            currentStep === 'upload' 
              ? 'bg-pharma-blue-600 text-white' 
              : uploads.length > 0
              ? 'bg-pharma-green-600 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
          }`}>
            {uploads.length > 0 && currentStep !== 'upload' ? '✓' : '1'}
          </div>
          <span className="text-sm font-medium">Upload</span>
        </div>
        
        <div className="w-12 h-0.5 bg-slate-200 dark:bg-slate-700" />
        
        <div className={`flex items-center gap-2 ${currentStep === 'metadata' ? 'text-pharma-blue-600 dark:text-pharma-blue-400' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
            currentStep === 'metadata' 
              ? 'bg-pharma-blue-600 text-white' 
              : completeUploads.length === uploads.length && uploads.length > 0
              ? 'bg-pharma-green-600 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
          }`}>
            {completeUploads.length === uploads.length && uploads.length > 0 && currentStep !== 'metadata' ? '✓' : '2'}
          </div>
          <span className="text-sm font-medium">Metadata</span>
        </div>
        
        <div className="w-12 h-0.5 bg-slate-200 dark:bg-slate-700" />
        
        <div className={`flex items-center gap-2 ${currentStep === 'processing' ? 'text-pharma-blue-600 dark:text-pharma-blue-400' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
            currentStep === 'processing' 
              ? 'bg-pharma-blue-600 text-white' 
              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
          }`}>
            3
          </div>
          <span className="text-sm font-medium">Analyze</span>
        </div>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Step Content */}
      {currentStep === 'upload' && (
        <div className="space-y-6">
          <UploadZone />
          <FilePreview />
          
          {uploads.length > 0 && (
            <div className="flex justify-end gap-3">
              {completeUploads.length === uploads.length ? (
                <button
                  onClick={handleAnalyze}
                  className="btn-primary"
                  disabled={isProcessing}
                >
                  Start Analysis
                </button>
              ) : (
                <button
                  onClick={handleContinueToMetadata}
                  className="btn-primary"
                >
                  Continue to Metadata
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      {currentStep === 'metadata' && currentUpload && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-primary mb-2">
              Add Metadata
            </h3>
            <p className="text-sm text-secondary">
              Image {selectedUploadIndex + 1} of {incompleteUploads.length} pending
            </p>
          </div>
          
          <ImageMetadataForm upload={currentUpload} />
          
          <div className="flex justify-between gap-3">
            <button
              onClick={() => setCurrentStep('upload')}
              className="btn-secondary"
            >
              ← Back to Upload
            </button>
            
            <div className="flex gap-3">
              {selectedUploadIndex > 0 && (
                <button
                  onClick={handlePreviousImage}
                  className="btn-ghost"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleSkipImage}
                className="btn-ghost"
              >
                Skip
              </button>
              {selectedUploadIndex < incompleteUploads.length - 1 && (
                <button
                  onClick={handleNextImage}
                  className="btn-secondary"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {currentStep === 'processing' && (
        <div className="max-w-2xl mx-auto">
          <div className="card text-center space-y-6">
            <div className="w-16 h-16 mx-auto">
              <div className="spinner w-full h-full" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Analyzing Images...
              </h3>
              <p className="text-sm text-secondary">
                Processing {uploads.length} images with CNN model
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-pharma-blue-600 transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
              <p className="text-xs text-tertiary">
                {processingProgress}% complete
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Made with Bob
