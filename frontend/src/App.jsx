import React, { useState } from 'react';
import ThemeToggle from './components/common/ThemeToggle';
import MedicalBackground from './components/common/MedicalBackground';
import GlobalCTA from './components/common/GlobalCTA';
import AtomicImageUpload from './components/upload/AtomicImageUpload';
import { useAnalysisStore } from './store/analysisStore';
import { modelService } from './services/modelService';

function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'upload' | 'results'
  const { uploads, currentAnalysis, setProcessing, setCurrentAnalysis, clearAll } = useAnalysisStore();
  
  const handleStartAnalysis = async () => {
    // If on landing, go to upload view
    if (view === 'landing') {
      clearAll();
      setView('upload');
      return;
    }
    
    // If on upload view with complete data, start analysis
    const allComplete = uploads.length > 0 && uploads.every(u => u.status === 'complete');
    if (view === 'upload' && allComplete) {
      try {
        setProcessing(true);
        
        // Prepare data for API
        const analysisData = uploads.map(u => ({
          file: u.file,
          time: u.time,
          ph: u.ph,
        }));
        
        // Call mock API
        const result = await modelService.mockAnalyze(analysisData);
        
        setCurrentAnalysis(result);
        setProcessing(false);
        setView('results');
      } catch (error) {
        console.error('Analysis failed:', error);
        setProcessing(false);
        alert('Analysis failed. Please try again.');
      }
    }
  };
  
  const handleBackToLanding = () => {
    setView('landing');
  };
  
  return (
    <div className="min-h-screen surface-primary transition-colors duration-300 relative">
        {/* Animated Medical Background */}
        <MedicalBackground />
        
        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* Global Sticky CTA (only show on upload and results views) */}
        {(view === 'upload' || view === 'results') && (
          <GlobalCTA onStartAnalysis={handleStartAnalysis} />
        )}
        
        {/* Main Content - Add padding-top when GlobalCTA is visible */}
        <div className={view !== 'landing' ? 'pt-24' : ''}>
          {/* Landing View */}
          {view === 'landing' && (
            <div className="container-app py-12 relative z-10">
              <div className="text-center space-y-8">
                {/* Hero Section */}
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl font-bold text-primary">
                    Tablet Image Analyzer
                  </h1>
                  <p className="text-xl text-secondary max-w-2xl mx-auto">
                    AI-powered pharmaceutical tablet dissolution analysis using Surface Dissolution Imaging (SDi²) with CNN and Grad-CAM explainability
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
                  <div className="card text-center">
                    <p className="text-3xl font-bold text-pharma-blue-600 dark:text-pharma-blue-400">
                      R² = 0.89
                    </p>
                    <p className="text-sm text-secondary mt-2">Model Accuracy</p>
                  </div>
                  <div className="card text-center">
                    <p className="text-3xl font-bold text-pharma-green-600 dark:text-pharma-green-400">
                      11.57%
                    </p>
                    <p className="text-sm text-secondary mt-2">RMSE</p>
                  </div>
                  <div className="card text-center">
                    <p className="text-3xl font-bold text-pharma-amber-600 dark:text-pharma-amber-400">
                      520nm
                    </p>
                    <p className="text-sm text-secondary mt-2">Wavelength</p>
                  </div>
                  <div className="card text-center">
                    <p className="text-3xl font-bold text-pharma-blue-600 dark:text-pharma-blue-400">
                      {'<'}30s
                    </p>
                    <p className="text-sm text-secondary mt-2">Processing</p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-12">
                  <button 
                    onClick={handleStartAnalysis}
                    className="btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-shadow"
                  >
                    <svg className="w-6 h-6 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Start Analysis
                  </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
                  <div className="card-hover">
                    <div className="w-12 h-12 bg-pharma-blue-100 dark:bg-pharma-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-6 h-6 text-pharma-blue-600 dark:text-pharma-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-primary mb-2">Atomic Metadata Upload</h3>
                    <p className="text-sm text-secondary">
                      Each specimen image has inline time point and pH metadata fields for precise tracking
                    </p>
                  </div>

                  <div className="card-hover">
                    <div className="w-12 h-12 bg-pharma-green-100 dark:bg-pharma-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-6 h-6 text-pharma-green-600 dark:text-pharma-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-primary mb-2">Wavelength Analysis</h3>
                    <p className="text-sm text-secondary">
                      520nm visible light for structural erosion pattern detection
                    </p>
                  </div>

                  <div className="card-hover">
                    <div className="w-12 h-12 bg-pharma-amber-100 dark:bg-pharma-amber-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-6 h-6 text-pharma-amber-600 dark:text-pharma-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-primary mb-2">Explainable AI Reports</h3>
                    <p className="text-sm text-secondary">
                      Grad-CAM heatmaps reveal which tablet regions drive dissolution predictions
                    </p>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="mt-16 pt-8 border-t border-light">
                  <p className="text-sm text-tertiary">
                    Based on research: <span className="text-pharma-blue-600 dark:text-pharma-blue-400 font-medium">
                      "Explainable AI in Pharmaceutics: Grad-CAM Analysis of Surface Dissolution Imaging"
                    </span>
                  </p>
                  <p className="text-xs text-tertiary mt-2">
                    520nm visible light analysis • CNN with Grad-CAM explainability • R² = 0.89
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Upload View */}
          {view === 'upload' && (
            <div className="container-app py-12 relative z-10">
              <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                  <button
                    onClick={handleBackToLanding}
                    className="btn-ghost mb-4"
                  >
                    ← Back to Home
                  </button>
                  <h2 className="text-3xl font-bold text-primary mb-2">
                    Specimen Upload & Metadata
                  </h2>
                  <p className="text-secondary">
                    Upload tablet images and provide time point + pH metadata for each specimen
                  </p>
                </div>
                
                {/* Atomic Image Upload Component */}
                <AtomicImageUpload onAnalyze={handleStartAnalysis} />
              </div>
            </div>
          )}
          
          {/* Results View */}
          {view === 'results' && currentAnalysis && (
            <div className="container-app py-12 relative z-10">
              <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-primary mb-2">
                      Analysis Results
                    </h2>
                    <p className="text-secondary">
                      Analysis ID: {currentAnalysis.id}
                    </p>
                  </div>
                  <button
                    onClick={handleBackToLanding}
                    className="btn-secondary"
                  >
                    ← Back to Home
                  </button>
                </div>
                
                {/* Results Content */}
                <div className="space-y-6">
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="card">
                      <p className="text-sm font-medium text-secondary mb-2">Model Accuracy</p>
                      <p className="text-3xl font-bold text-pharma-blue-600 dark:text-pharma-blue-400">
                        R² = {currentAnalysis.r2.toFixed(2)}
                      </p>
                    </div>
                    <div className="card">
                      <p className="text-sm font-medium text-secondary mb-2">Root Mean Square Error</p>
                      <p className="text-3xl font-bold text-pharma-green-600 dark:text-pharma-green-400">
                        {currentAnalysis.rmse.toFixed(2)}%
                      </p>
                    </div>
                    <div className="card">
                      <p className="text-sm font-medium text-secondary mb-2">Time Points Analyzed</p>
                      <p className="text-3xl font-bold text-pharma-amber-600 dark:text-pharma-amber-400">
                        {currentAnalysis.timePoints?.length || uploads.length}
                      </p>
                    </div>
                  </div>
                  
                  {/* Parameters */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-primary mb-4">Analysis Parameters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-secondary mb-1">Active Pharmaceutical Ingredient</p>
                        <p className="text-base font-medium text-primary">{currentAnalysis.parameters.api}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary mb-1">Excipient Matrix</p>
                        <p className="text-base font-medium text-primary">{currentAnalysis.parameters.excipient}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary mb-1">Dissolution Medium pH</p>
                        <p className="text-base font-medium text-primary">{currentAnalysis.parameters.ph}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Grad-CAM Results */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="card">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-primary">Grad-CAM 280nm (UV)</h3>
                        <span className="badge-info">API Detection</span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-secondary">Focus Region</p>
                          <p className="text-base font-medium text-primary">{currentAnalysis.grad_cam_280.focusRegion}</p>
                        </div>
                        <div>
                          <p className="text-sm text-secondary">Dissolution Mechanism</p>
                          <p className="text-base font-medium text-primary">{currentAnalysis.grad_cam_280.mechanism}</p>
                        </div>
                        <div>
                          <p className="text-sm text-secondary">Activation Intensity</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-pharma-blue-500 transition-all duration-500"
                                style={{ width: `${currentAnalysis.grad_cam_280.intensity}%` }}
                              />
                            </div>
                            <span className="text-base font-medium text-primary">{currentAnalysis.grad_cam_280.intensity}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-primary">Grad-CAM 520nm (Visible)</h3>
                        <span className="badge-success">Structural Analysis</span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-secondary">Focus Region</p>
                          <p className="text-base font-medium text-primary">{currentAnalysis.grad_cam_520.focusRegion}</p>
                        </div>
                        <div>
                          <p className="text-sm text-secondary">Erosion Mechanism</p>
                          <p className="text-base font-medium text-primary">{currentAnalysis.grad_cam_520.mechanism}</p>
                        </div>
                        <div>
                          <p className="text-sm text-secondary">Activation Intensity</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-pharma-green-500 transition-all duration-500"
                                style={{ width: `${currentAnalysis.grad_cam_520.intensity}%` }}
                              />
                            </div>
                            <span className="text-base font-medium text-primary">{currentAnalysis.grad_cam_520.intensity}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dissolution Data Preview */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-primary mb-4">Dissolution Profile Data</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-light">
                            <th className="text-left py-2 px-4 text-secondary font-medium">Time (min)</th>
                            <th className="text-left py-2 px-4 text-secondary font-medium">% Dissolved (Q)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentAnalysis.dissolution_curve.slice(0, 10).map((point, index) => (
                            <tr key={index} className="border-b border-light">
                              <td className="py-2 px-4 text-primary">{point.time}</td>
                              <td className="py-2 px-4 text-primary">{point.q.toFixed(2)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {currentAnalysis.dissolution_curve.length > 10 && (
                        <p className="text-xs text-tertiary mt-2 text-center">
                          Showing 10 of {currentAnalysis.dissolution_curve.length} data points
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}

export default App;

// Made with Bob
