# Tablet Image Analyzer - Frontend

React-based frontend for pharmaceutical tablet dissolution analysis using AI.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at http://localhost:5173

### Build for Production

```bash
npm run build
npm run preview
```

## 🔗 Backend Connection

This frontend connects to the FastAPI backend in the parent directory.

### Start Backend First

```bash
# In the root directory (IBM-HACKATHON/)
cd ..
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Configure API URL

Edit `.env.local`:
```env
VITE_API_URL=http://localhost:8000
```

## 📦 Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Zustand** - State management
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **react-easy-crop** - Image cropping

## 🎨 Features

- ✅ Dark/Light mode toggle
- ✅ Multi-image upload with drag-drop
- ✅ Image cropping tool
- ✅ Atomic metadata input (time point, pH)
- ✅ Animated medical background
- ✅ Global CTA button
- 🚧 Three.js 3D tablet viewer (coming soon)
- 🚧 Dissolution chart (coming soon)
- 🚧 Grad-CAM heatmap visualization (coming soon)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Shared components
│   │   └── upload/          # Upload workflow
│   ├── context/             # React contexts
│   ├── services/            # API services
│   ├── store/               # Zustand stores
│   ├── styles/              # Global styles
│   └── utils/               # Utilities
├── public/                  # Static assets
└── .env.local              # Environment variables
```

## 🔧 Configuration

### Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:8000)
- `VITE_API_KEY` - API key for authentication
- `VITE_MODEL_ENDPOINT` - Model endpoint path
- `VITE_TIMEOUT` - Request timeout in ms

## 📚 Documentation

See parent directory for:
- `ARCHITECTURE.md` - System architecture
- `COMPONENT_SPECS.md` - Component specifications
- `IMPLEMENTATION_GUIDE.md` - Implementation guide
- `PROJECT_SUMMARY.md` - Project summary

## 🐛 Troubleshooting

### Backend not responding
- Ensure FastAPI backend is running on port 8000
- Check CORS is enabled in `app/main.py`
- Verify `.env.local` has correct API URL

### Build errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear Vite cache: `rm -rf .vite`

## 📄 License

MIT License - See parent directory for details
