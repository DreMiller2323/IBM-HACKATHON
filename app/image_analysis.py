"""
Image Analysis Module for Tablet Dissolution Analysis

This module provides image processing and analysis functions for pharmaceutical
tablet dissolution imaging using Surface Dissolution Imaging (SDi2) techniques.
"""

import numpy as np
from typing import Tuple, Optional, Dict, Any
from PIL import Image
import io


class ImageAnalyzer:
    """
    Handles image preprocessing and analysis for tablet dissolution studies.
    Supports dual-wavelength imaging (280nm and 520nm).
    """
    
    def __init__(self):
        """Initialize the ImageAnalyzer with default parameters."""
        self.supported_wavelengths = [280, 520]
        self.target_size = (224, 224)  # Standard input size for CNN models
    
    def preprocess_image(
        self, 
        image_data: bytes, 
        wavelength: int = 280
    ) -> np.ndarray:
        """
        Preprocess uploaded image for model input.
        
        Args:
            image_data: Raw image bytes
            wavelength: Imaging wavelength (280nm or 520nm)
            
        Returns:
            Preprocessed image as numpy array
            
        Raises:
            ValueError: If wavelength is not supported
        """
        if wavelength not in self.supported_wavelengths:
            raise ValueError(
                f"Wavelength {wavelength}nm not supported. "
                f"Use {self.supported_wavelengths}"
            )
        
        # Load image from bytes
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize to target size
        image = image.resize(self.target_size, Image.Resampling.LANCZOS)
        
        # Convert to numpy array and normalize
        image_array = np.array(image, dtype=np.float32) / 255.0
        
        return image_array
    
    def extract_features(self, image_array: np.ndarray) -> Dict[str, float]:
        """
        Extract basic image features for analysis.
        
        Args:
            image_array: Preprocessed image array
            
        Returns:
            Dictionary of extracted features
        """
        features = {
            'mean_intensity': float(np.mean(image_array)),
            'std_intensity': float(np.std(image_array)),
            'min_intensity': float(np.min(image_array)),
            'max_intensity': float(np.max(image_array)),
            'contrast': float(np.max(image_array) - np.min(image_array))
        }
        
        return features
    
    def validate_image(
        self, 
        image_data: bytes, 
        max_size_mb: float = 10.0
    ) -> Tuple[bool, Optional[str]]:
        """
        Validate uploaded image.
        
        Args:
            image_data: Raw image bytes
            max_size_mb: Maximum allowed file size in MB
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        # Check file size
        size_mb = len(image_data) / (1024 * 1024)
        if size_mb > max_size_mb:
            return False, f"Image size ({size_mb:.2f}MB) exceeds limit ({max_size_mb}MB)"
        
        # Try to open image
        try:
            image = Image.open(io.BytesIO(image_data))
            
            # Check if image is valid
            image.verify()
            
            # Reopen for further checks (verify() closes the file)
            image = Image.open(io.BytesIO(image_data))
            
            # Check dimensions
            width, height = image.size
            if width < 100 or height < 100:
                return False, f"Image dimensions ({width}x{height}) too small (min 100x100)"
            
            if width > 4096 or height > 4096:
                return False, f"Image dimensions ({width}x{height}) too large (max 4096x4096)"
            
            return True, None
            
        except Exception as e:
            return False, f"Invalid image file: {str(e)}"
    
    def create_thumbnail(
        self, 
        image_data: bytes, 
        size: Tuple[int, int] = (150, 150)
    ) -> bytes:
        """
        Create a thumbnail of the image.
        
        Args:
            image_data: Raw image bytes
            size: Thumbnail size (width, height)
            
        Returns:
            Thumbnail image as bytes
        """
        image = Image.open(io.BytesIO(image_data))
        image.thumbnail(size, Image.Resampling.LANCZOS)
        
        # Convert back to bytes
        output = io.BytesIO()
        image.save(output, format='JPEG', quality=85)
        output.seek(0)
        
        return output.read()


def analyze_dissolution_region(
    image_array: np.ndarray, 
    threshold: float = 0.5
) -> Dict[str, Any]:
    """
    Analyze dissolution regions in the tablet image.
    
    Args:
        image_array: Preprocessed image array
        threshold: Intensity threshold for dissolution detection
        
    Returns:
        Dictionary containing dissolution analysis results
    """
    # Convert to grayscale if needed
    if len(image_array.shape) == 3:
        grayscale = np.mean(image_array, axis=2)
    else:
        grayscale = image_array
    
    # Identify dissolution regions (areas below threshold)
    dissolution_mask = grayscale < threshold
    dissolution_percentage = (np.sum(dissolution_mask) / dissolution_mask.size) * 100
    
    results = {
        'dissolution_percentage': float(dissolution_percentage),
        'affected_pixels': int(np.sum(dissolution_mask)),
        'total_pixels': int(dissolution_mask.size),
        'mean_dissolution_intensity': float(np.mean(grayscale[dissolution_mask])) if np.any(dissolution_mask) else 0.0
    }
    
    return results

# Made with Bob
