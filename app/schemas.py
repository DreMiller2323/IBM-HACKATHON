"""
Pydantic models for request/response validation
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict


class Prediction(BaseModel):
    """Single prediction result"""
    label: str = Field(..., description="Predicted class label")
    confidence: float = Field(..., description="Confidence score (0-1)")


class PredictionResponse(BaseModel):
    """Response model for image classification"""
    filename: str = Field(..., description="Name of the uploaded file")
    predictions: List[Prediction] = Field(..., description="Top predictions with confidence scores")
    model: str = Field(..., description="Name of the ML model used")
    error: Optional[str] = Field(None, description="Error message if prediction failed")


class HealthResponse(BaseModel):
    """Health check response"""
    status: str = Field(..., description="API status")
    message: str = Field(..., description="Status message")
    version: str = Field(..., description="API version")
    model: str = Field(..., description="Current ML model")


class ImageInfo(BaseModel):
    """Detailed image information"""
    filename: str = Field(..., description="Image filename")
    format: str = Field(..., description="Image format (JPEG, PNG, etc.)")
    mode: str = Field(..., description="Image mode (RGB, RGBA, etc.)")
    size: Dict[str, int] = Field(..., description="Image dimensions (width, height)")
    predictions: List[Prediction] = Field(..., description="Classification predictions")
    model: str = Field(..., description="ML model used")
# Made with Bob
