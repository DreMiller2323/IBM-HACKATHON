import io
import os
import re
from pathlib import Path
from typing import List, Dict, Any

import numpy as np
from PIL import Image

from app.image_analysis import ImageAnalyzer


class ImageClassifier:
    def __init__(self):
        self.labels = ["cat", "dog", "car", "tree", "person"]
        self.loaded = True

    def analyze_image(self, image_bytes):
        selected = np.random.choice(self.labels, size=3, replace=False)

        return [
            {"label": label, "confidence": float(np.round(np.random.uniform(0.2, 0.9), 2))}
            for label in selected
        ]


class TabletImageModel:
    def __init__(self, image_size=(128, 128)):
        self.image_size = image_size
        self.analyzer = ImageAnalyzer()
        self.weights: np.ndarray | None = None
        self.trained = False
        self.dataset_folders: List[Path] = []

    def _parse_folder_label(self, folder: Path) -> float:
        match = re.search(r"(\d+(?:[_\.]\d+)?)", folder.name)
        if not match:
            return 0.0
        return float(match.group(1).replace("_", "."))

    def _parse_timepoint(self, filename: str) -> float:
        match = re.search(r"(\d+)\s*min", filename, re.IGNORECASE)
        if not match:
            return 0.0
        return float(match.group(1))

    def _load_image_array(self, path: Path) -> np.ndarray:
        with Image.open(path) as image:
            image = image.convert("RGB")
            image = image.resize(self.image_size, Image.Resampling.LANCZOS)
            return np.asarray(image, dtype=np.float32) / 255.0

    def _prepare_image_bytes(self, image_bytes: bytes) -> np.ndarray:
        with Image.open(io.BytesIO(image_bytes)) as image:
            image = image.convert("RGB")
            image = image.resize(self.image_size, Image.Resampling.LANCZOS)
            return np.asarray(image, dtype=np.float32) / 255.0

    def _extract_features(self, image_array: np.ndarray) -> List[float]:
        image_features = self.analyzer.extract_features(image_array)
        return [
            image_features["mean_intensity"],
            image_features["std_intensity"],
            image_features["contrast"],
        ]

    def load_dataset(self, folder_paths: List[Path]) -> Dict[str, Any]:
        feature_vectors = []
        target_values = []
        file_details = []

        for folder_path in folder_paths:
            folder_path = Path(folder_path)
            if not folder_path.exists() or not folder_path.is_dir():
                continue

            ph_label = self._parse_folder_label(folder_path)
            for image_path in folder_path.glob("*.*"):
                if image_path.suffix.lower() not in {".jpg", ".jpeg", ".png", ".bmp"}:
                    continue

                timepoint = self._parse_timepoint(image_path.name)
                image_array = self._load_image_array(image_path)
                image_features = self._extract_features(image_array)

                feature_vectors.append(image_features + [timepoint])
                target_values.append(ph_label)
                file_details.append({
                    "filename": image_path.name,
                    "folder": str(folder_path.name),
                    "ph_label": ph_label,
                    "timepoint": timepoint,
                })

        if not feature_vectors:
            raise ValueError("No valid training images were found in the configured folders.")

        return {
            "features": np.array(feature_vectors, dtype=np.float32),
            "targets": np.array(target_values, dtype=np.float32),
            "files": file_details,
        }

    def train(self, folder_paths: List[Path]) -> Dict[str, Any]:
        dataset = self.load_dataset(folder_paths)
        X = dataset["features"]
        y = dataset["targets"]

        ones = np.ones((X.shape[0], 1), dtype=np.float32)
        X_design = np.hstack([ones, X])
        self.weights = np.linalg.pinv(X_design.T.dot(X_design)).dot(X_design.T).dot(y)
        self.trained = True
        self.dataset_folders = [Path(p) for p in folder_paths]

        return {
            "status": "trained",
            "samples": int(X.shape[0]),
            "feature_dim": int(X.shape[1]),
            "folders": [str(p) for p in folder_paths],
        }

    def predict(self, image_bytes_list: List[bytes], metadata: List[Dict[str, Any]]) -> List[float]:
        if not self.trained or self.weights is None:
            raise RuntimeError("Model is not trained yet")

        predictions = []
        for image_bytes, meta in zip(image_bytes_list, metadata):
            image_array = self._prepare_image_bytes(image_bytes)
            features = self._extract_features(image_array)
            timepoint = float(meta.get("timePoint", 0.0))
            x = np.array([1.0] + features + [timepoint], dtype=np.float32)
            predictions.append(float(self.weights.dot(x)))

        return predictions
