# FastAPI ML Image Classification API

A production-ready FastAPI boilerplate for image classification using deep learning models. This API uses pre-trained TensorFlow/Keras models (MobileNetV2 by default) to classify images with high accuracy.

## Features`

- 🚀 **Fast & Modern**: Built with FastAPI for high performance
- 🤖 **Machine Learning**: Pre-trained MobileNetV2 model for image classification
- 📸 **Image Processing**: Support for JPEG, PNG, GIF, BMP, and WebP formats
- 📊 **Automatic Documentation**: Interactive API docs at `/docs` and `/redoc`
- 🔄 **Batch Processing**: Classify multiple images in a single request
- 📈 **Detailed Analysis**: Get image metadata along with predictions
- 🎯 **High Accuracy**: Uses ImageNet-trained models with 1000+ classes

## Project Structure

```
fastapi-ml-boilerplate/
├── app/
│   ├── __init__.py          # Package initialization
│   ├── main.py              # FastAPI application and endpoints
│   ├── ml_models.py         # ML model implementation
│   ├── schemas.py           # Pydantic models for validation
│   └── utils.py             # Utility functions
├── uploads/                 # Directory for uploaded images
├── requirements.txt         # Python dependencies
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Setup

1. **Clone or download this repository**

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

   **Note**: TensorFlow installation may take several minutes and requires ~500MB of disk space.

## Usage

### Starting the Server

Run the development server:

```bash
uvicorn app.main:app --reload
```

Or use Python directly:

```bash
python -m app.main
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

### API Endpoints

#### 1. Health Check
```http
GET /
GET /health
```

Check if the API is running and the model is loaded.

**Response**:
```json
{
  "status": "healthy",
  "message": "FastAPI ML Image Classification API is running",
  "version": "1.0.0",
  "model": "MobileNetV2"
}
```

#### 2. Classify Single Image
```http
POST /predict
```

Upload and classify a single image.

**Request**:
- Method: POST
- Content-Type: multipart/form-data
- Body: `file` (image file)

**Example using cURL**:
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@path/to/your/image.jpg"
```

**Example using Python**:
```python
import requests

url = "http://localhost:8000/predict"
files = {"file": open("image.jpg", "rb")}
response = requests.post(url, files=files)
print(response.json())
```

**Response**:
```json
{
  "filename": "cat.jpg",
  "predictions": [
    {
      "label": "Egyptian Cat",
      "confidence": 0.8234
    },
    {
      "label": "Tabby Cat",
      "confidence": 0.1456
    },
    {
      "label": "Tiger Cat",
      "confidence": 0.0234
    }
  ],
  "model": "MobileNetV2"
}
```

#### 3. Batch Classification
```http
POST /predict/batch
```

Classify multiple images at once (max 10 images).

**Request**:
- Method: POST
- Content-Type: multipart/form-data
- Body: Multiple `files` (image files)

**Example using cURL**:
```bash
curl -X POST "http://localhost:8000/predict/batch" \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg" \
  -F "files=@image3.jpg"
```

#### 4. Detailed Image Analysis
```http
POST /analyze
```

Get detailed image information including format, dimensions, and predictions.

**Response**:
```json
{
  "filename": "photo.jpg",
  "format": "JPEG",
  "mode": "RGB",
  "size": {
    "width": 1920,
    "height": 1080
  },
  "predictions": [
    {
      "label": "Golden Retriever",
      "confidence": 0.9123
    }
  ],
  "model": "MobileNetV2"
}
```

#### 5. List Available Models
```http
GET /models
```

Get information about available ML models.

## Supported Image Formats

- JPEG/JPG
- PNG
- GIF
- BMP
- WebP

## Machine Learning Model

### Default Model: MobileNetV2

- **Architecture**: MobileNetV2
- **Training Dataset**: ImageNet (1000 classes)
- **Input Size**: 224x224 pixels
- **Advantages**: 
  - Lightweight and fast
  - Good accuracy
  - Low memory footprint
  - Suitable for production

### Switching Models

You can easily switch to other pre-trained models by modifying `app/ml_models.py`:

**Available alternatives**:
- ResNet50 (higher accuracy, slower)
- InceptionV3 (good balance)
- EfficientNetB0 (efficient and accurate)

**Example** (in `ml_models.py`):
```python
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.applications.resnet50 import preprocess_input, decode_predictions

self.model = ResNet50(weights='imagenet', include_top=True)
```

## Configuration

### Environment Variables

Create a `.env` file for configuration (optional):

```env
# Server Configuration
HOST=0.0.0.0
PORT=8000

# Model Configuration
MODEL_NAME=MobileNetV2
TOP_K_PREDICTIONS=5

# File Upload
MAX_FILE_SIZE_MB=10
```

### Customization

- **Change number of predictions**: Modify `top_k` parameter in `ImageClassifier` initialization
- **Adjust input size**: Change `input_shape` in `ml_models.py`
- **Add authentication**: Implement JWT or API key authentication in `main.py`
- **Enable CORS**: Already configured, adjust origins in `main.py` as needed

## Testing

### Using the Interactive Docs

1. Navigate to http://localhost:8000/docs
2. Click on any endpoint
3. Click "Try it out"
4. Upload an image and execute

### Using Python

```python
import requests

# Test prediction
url = "http://localhost:8000/predict"
files = {"file": open("test_image.jpg", "rb")}
response = requests.post(url, files=files)

print("Status:", response.status_code)
print("Result:", response.json())
```

### Using cURL

```bash
# Health check
curl http://localhost:8000/health

# Predict
curl -X POST "http://localhost:8000/predict" \
  -F "file=@test_image.jpg"
```

## Performance

- **Startup Time**: ~5-10 seconds (model loading)
- **Prediction Time**: ~100-300ms per image (CPU)
- **Memory Usage**: ~500MB (model + runtime)
- **Concurrent Requests**: Supports multiple simultaneous requests

## Deployment

### Production Considerations

1. **Use Gunicorn with Uvicorn workers**:
   ```bash
   pip install gunicorn
   gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

2. **Set proper CORS origins** in `main.py`

3. **Add rate limiting** for API protection

4. **Use environment variables** for configuration

5. **Enable HTTPS** with reverse proxy (nginx/Apache)

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t fastapi-ml-api .
docker run -p 8000:8000 fastapi-ml-api
```

## Troubleshooting

### Common Issues

1. **TensorFlow installation fails**:
   - Ensure you have Python 3.8-3.11
   - Try: `pip install tensorflow --upgrade`

2. **Model loading is slow**:
   - First run downloads the model (~14MB for MobileNetV2)
   - Subsequent runs use cached model

3. **Out of memory errors**:
   - Reduce batch size
   - Use a lighter model (MobileNetV2 is already lightweight)
   - Increase system RAM

4. **Import errors**:
   - Ensure all dependencies are installed: `pip install -r requirements.txt`
   - Activate virtual environment

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License

This project is open source and available under the MIT License.

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [TensorFlow/Keras Models](https://www.tensorflow.org/api_docs/python/tf/keras/applications)
- [ImageNet Classes](https://gist.github.com/yrevar/942d3a0ac09ec9e5eb3a)

## Support

For questions or issues, please open an issue on the repository.

---

**Built with ❤️ using FastAPI and TensorFlow**