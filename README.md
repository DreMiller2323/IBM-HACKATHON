# 🧪 Tablet Image Analyzer - Full Stack Application

AI-powered pharmaceutical tablet dissolution analysis platform combining FastAPI backend with React frontend.

## 📋 Project Overview

This application analyzes pharmaceutical tablet dissolution using Surface Dissolution Imaging (SDi2) and Convolutional Neural Networks with Grad-CAM explainability.

**Based on research:** [Explainable AI in Pharmaceutics](https://www.mdpi.com/1999-4923/18/4/481)

### Key Features

- 🤖 **AI-Powered Analysis**: CNN model for dissolution prediction (R² = 0.89, RMSE = 11.57%)
- 📊 **Dual-Wavelength Imaging**: 280nm (API detection) + 520nm (structural analysis)
- 🔍 **Explainable AI**: Grad-CAM heatmaps showing model attention
- 📈 **Real-time Dashboard**: Dissolution curves and metrics visualization
- 🎨 **Modern UI**: Dark/light mode, responsive design, smooth animations
- 🖼️ **Image Processing**: Upload, crop, and analyze multiple tablet images

## 🏗️ Architecture

```
IBM-HACKATHON/
├── app/                    # FastAPI Backend
│   ├── main.py            # API endpoints
│   ├── ml_models.py       # ML model implementation
│   ├── schemas.py         # Pydantic models
│   └── utils.py           # Utility functions
├── frontend/              # React Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── store/         # State management
│   │   └── styles/        # Tailwind CSS
│   └── public/            # Static assets
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites

- **Backend**: Python 3.8+, pip
- **Frontend**: Node.js 18+, npm

### 1. Backend Setup (FastAPI)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --reload --port 8000
```

Backend will be available at: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

### 2. Frontend Setup (React)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: http://localhost:5173

## 📡 API Endpoints

### Backend (FastAPI)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/analyze` | POST | Analyze tablet image and predict dissolution |
| `/metrics` | GET | Get model performance metrics (R², RMSE) |
| `/dissolution` | GET | Get dissolution timeline stages |
| `/explain` | POST | Get Grad-CAM explanation for image |
| `/health` | GET | Health check endpoint |

### Example Request

```bash
curl -X POST "http://localhost:8000/analyze" \
  -F "file=@tablet_image.jpg"
```

### Example Response

```json
{
  "predictions": [
    {
      "label": "early_dissolution",
      "confidence": 0.85
    },
    {
      "label": "mid_dissolution",
      "confidence": 0.12
    }
  ],
  "model": "SDi2-CNN-Mock-v1"
}
```

## 🎨 Frontend Features

### Current Features ✅

- **Multi-Image Upload**: Drag-drop interface with batch processing
- **Image Cropping**: Built-in cropper with zoom and rotation
- **Metadata Input**: Time point and pH level for each image
- **Dark/Light Mode**: Automatic theme switching
- **Animated Background**: Medical-themed particle effects
- **Responsive Design**: Works on desktop and mobile

### Coming Soon 🚧

- **3D Tablet Viewer**: Three.js visualization with texture mapping
- **Dissolution Charts**: Interactive Recharts graphs
- **Grad-CAM Overlay**: Heatmap visualization on 3D model
- **Time Scrubber**: Navigate through dissolution stages
- **Export Reports**: PDF generation with analysis results

## 🔧 Configuration

### Backend Configuration

Edit `app/main.py` to configure:
- CORS origins
- Model parameters
- File upload limits

### Frontend Configuration

Edit `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:8000
VITE_API_KEY=dev_key_test
VITE_MODEL_ENDPOINT=/analyze
VITE_TIMEOUT=30000
```

## 📊 Model Performance

Current metrics (from research paper):
- **R² Score**: 0.89
- **RMSE**: 11.57%
- **Wavelengths**: 280nm + 520nm
- **Inference Time**: <30s per image

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **TensorFlow/Keras** - Deep learning models
- **Pillow** - Image processing
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Zustand** - State management
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **react-easy-crop** - Image cropping

## 📚 Documentation

- **Frontend README**: `frontend/README.md`
- **Architecture**: `frontend/ARCHITECTURE.md`
- **Component Specs**: `frontend/COMPONENT_SPECS.md`
- **Implementation Guide**: `frontend/IMPLEMENTATION_GUIDE.md`

## 🧪 Testing

### Backend Tests
```bash
pytest
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 🐛 Troubleshooting

### Backend Issues

**TensorFlow installation fails:**
```bash
pip install tensorflow --upgrade
```

**Port 8000 already in use:**
```bash
uvicorn app.main:app --reload --port 8001
```

### Frontend Issues

**Backend not responding:**
- Ensure FastAPI is running on port 8000
- Check CORS is enabled in `app/main.py`
- Verify `.env.local` has correct API URL

**Build errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🚢 Deployment

### Backend (Docker)

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app/ ./app/
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy dist/ folder
```

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For questions or issues, please open an issue on the repository.

---

**Built with ❤️ using FastAPI, React, and TensorFlow**