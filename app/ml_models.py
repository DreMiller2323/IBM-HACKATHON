import random


class ImageClassifier:
    def __init__(self):
        self.labels = ["cat", "dog", "car", "tree", "person"]
        self.loaded = True

    def analyze_image(self, image_bytes):
        selected = random.sample(self.labels, 3)

        return [
            {"label": label, "confidence": round(random.uniform(0.2, 0.9), 2)}
            for label in selected
        ]