"""
Utility functions for image processing and helpers
"""

import os
from pathlib import Path
from typing import Optional
import hashlib
from datetime import datetime


def generate_filename(original_filename: str, prefix: str = "") -> str:
    """
    Generate a unique filename with timestamp
    
    Args:
        original_filename: Original file name
        prefix: Optional prefix for the filename
    
    Returns:
        Unique filename
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    name, ext = os.path.splitext(original_filename)
    
    if prefix:
        return f"{prefix}_{timestamp}_{name}{ext}"
    return f"{timestamp}_{name}{ext}"


def get_file_hash(file_bytes: bytes) -> str:
    """
    Generate MD5 hash of file content
    
    Args:
        file_bytes: File content as bytes
    
    Returns:
        MD5 hash string
    """
    return hashlib.md5(file_bytes).hexdigest()


def validate_image_size(file_bytes: bytes, max_size_mb: int = 10) -> bool:
    """
    Validate image file size
    
    Args:
        file_bytes: Image file bytes
        max_size_mb: Maximum allowed size in MB
    
    Returns:
        True if valid, False otherwise
    """
    size_mb = len(file_bytes) / (1024 * 1024)
    return size_mb <= max_size_mb


def create_directory(path: str) -> Path:
    """
    Create directory if it doesn't exist
    
    Args:
        path: Directory path
    
    Returns:
        Path object
    """
    dir_path = Path(path)
    dir_path.mkdir(parents=True, exist_ok=True)
    return dir_path


def format_confidence(confidence: float) -> str:
    """
    Format confidence score as percentage
    
    Args:
        confidence: Confidence score (0-1)
    
    Returns:
        Formatted percentage string
    """
    return f"{confidence * 100:.2f}%"


def get_supported_formats() -> list:
    """
    Get list of supported image formats
    
    Returns:
        List of supported formats
    """
    return [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/webp"
    ]


def is_supported_format(content_type: str) -> bool:
    """
    Check if image format is supported
    
    Args:
        content_type: MIME type of the file
    
    Returns:
        True if supported, False otherwise
    """
    return content_type.lower() in get_supported_formats()

# Made with Bob
