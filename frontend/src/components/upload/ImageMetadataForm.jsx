import React, { useState } from 'react';
import { useAnalysisStore } from '../../store/analysisStore';
import { validateTimePoint, validatePhLevel } from '../../utils/validation';
import { PH_LEVELS, TIME_POINT_PRESETS } from '../../utils/constants';

export default function ImageMetadataForm({ upload }) {
  const { updateUpload } = useAnalysisStore();
  const [timePoint, setTimePoint] = useState(upload.timePoint ?? '');
  const [phLevel, setPhLevel] = useState(upload.phLevel ?? '');
  const [errors, setErrors] = useState({});
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    const timePointValidation = validateTimePoint(timePoint);
    const phLevelValidation = validatePhLevel(phLevel);
    
    const newErrors = {};
    if (!timePointValidation.valid) {
      newErrors.timePoint = timePointValidation.error;
    }
    if (!phLevelValidation.valid) {
      newErrors.phLevel = phLevelValidation.error;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Update upload with metadata
    updateUpload(upload.id, {
      timePoint: Number(timePoint),
      phLevel: Number(phLevel),
      status: 'complete'
    });
    
    setErrors({});
  };
  
  const handleTimePointPreset = (value) => {
    setTimePoint(value);
    setErrors(prev => ({ ...prev, timePoint: undefined }));
  };
  
  const handlePhPreset = (value) => {
    setPhLevel(value);
    setErrors(prev => ({ ...prev, phLevel: undefined }));
  };
  
  const isComplete = upload.timePoint !== null && upload.phLevel !== null;
  
  return (
    <div className="card">
      {/* Image Preview */}
      <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden mb-4">
        <img
          src={upload.preview}
          alt={upload.file.name}
          className="w-full h-full object-cover"
        />
        {isComplete && (
          <div className="absolute inset-0 bg-pharma-green-600/10 flex items-center justify-center">
            <div className="bg-pharma-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Metadata Complete</span>
            </div>
          </div>
        )}
      </div>
      
      {/* File Name */}
      <p className="text-sm font-medium text-primary mb-4 truncate" title={upload.file.name}>
        {upload.file.name}
      </p>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Time Point */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Time Point (minutes) <span className="text-red-500">*</span>
          </label>
          
          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2 mb-2">
            {TIME_POINT_PRESETS.slice(0, 6).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleTimePointPreset(preset)}
                className={`
                  px-3 py-1 text-xs rounded-md transition-colors
                  ${timePoint == preset
                    ? 'bg-pharma-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }
                `}
              >
                {preset} min
              </button>
            ))}
          </div>
          
          <input
            type="number"
            min="0"
            step="1"
            value={timePoint}
            onChange={(e) => {
              setTimePoint(e.target.value);
              setErrors(prev => ({ ...prev, timePoint: undefined }));
            }}
            className={`input-base w-full ${errors.timePoint ? 'border-red-500' : ''}`}
            placeholder="e.g., 0, 30, 60, 120"
          />
          {errors.timePoint && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.timePoint}</p>
          )}
        </div>
        
        {/* pH Level */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Medium pH Level <span className="text-red-500">*</span>
          </label>
          
          {/* pH Presets */}
          <div className="space-y-2 mb-2">
            {PH_LEVELS.map((ph) => (
              <button
                key={ph.value}
                type="button"
                onClick={() => handlePhPreset(ph.value)}
                className={`
                  w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                  ${phLevel == ph.value
                    ? 'bg-pharma-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }
                `}
              >
                <div className="font-medium">{ph.label}</div>
                <div className={`text-xs ${phLevel == ph.value ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                  {ph.description}
                </div>
              </button>
            ))}
          </div>
          
          <input
            type="number"
            min="1.0"
            max="14.0"
            step="0.1"
            value={phLevel}
            onChange={(e) => {
              setPhLevel(e.target.value);
              setErrors(prev => ({ ...prev, phLevel: undefined }));
            }}
            className={`input-base w-full ${errors.phLevel ? 'border-red-500' : ''}`}
            placeholder="Custom pH (1.0 - 14.0)"
          />
          {errors.phLevel && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.phLevel}</p>
          )}
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary w-full"
        >
          {isComplete ? 'Update Metadata' : 'Save Metadata'}
        </button>
      </form>
    </div>
  );
}

// Made with Bob
