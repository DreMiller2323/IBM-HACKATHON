# Component Specifications - Tablet Image Analyzer

## 🎯 Component Hierarchy

```
App
├── ThemeProvider
│   ├── ThemeToggle
│   └── Router
│       ├── Landing
│       │   ├── Hero
│       │   ├── Features
│       │   └── Stats
│       ├── UploadWorkflow
│       │   ├── UploadZone
│       │   ├── FilePreview
│       │   ├── ImageMetadataForm
│       │   └── UploadStepper
│       └── ResultsView
│           ├── ResultsHeader
│           ├── TabletViewer (Three.js)
│           ├── DissolutionChart (Recharts)
│           ├── GradCAMVisualization
│           ├── MetricsCard
│           ├── TimeScrubber
│           ├── XAIReport
│           ├── BottomBar
│           └── ExportPanel
```

---

## 📄 Page Components

### 1. Landing Page
**File:** `src/components/landing/Landing.jsx`

**Purpose:** Entry point with project overview and CTA

**Structure:**
```jsx
<div className="surface-primary min-h-screen">
  <Hero />
  <Features />
  <Stats />
  <Footer />
</div>
```

**Features Section Content:**
- Multi-Image Intake System
- 3D Visualization with Grad-CAM
- Explainable AI Reports
- Export & Share Capabilities

**Stats Section:**
- Model Accuracy: R² = 0.89
- RMSE: 11.57%
- Dual-Wavelength Analysis: 280nm + 520nm
- Processing Time: <30s

---

### 2. Upload Workflow Page
**File:** `src/components/upload/UploadWorkflow.jsx`

**Purpose:** Multi-step image upload with metadata collection

**Steps:**
1. **Upload Images** - Drag-drop zone
2. **Add Metadata** - Time point + pH for each image
3. **Review & Submit** - Validate and sort chronologically
4. **Processing** - Show progress and status

**State Flow:**
```javascript
{
  currentStep: 1 | 2 | 3 | 4,
  uploads: [
    {
      id: string,
      file: File,
      preview: string,
      timePoint: number | null,
      phLevel: number | null,
      status: 'pending' | 'complete' | 'error'
    }
  ],
  isProcessing: boolean,
  error: string | null
}
```

---

### 3. Results View Page
**File:** `src/components/results/ResultsView.jsx`

**Purpose:** Display analysis results with interactive visualizations

**Layout:**
```jsx
<div className="surface-primary min-h-screen">
  <ResultsHeader analysis={currentAnalysis} />
  
  <div className="max-w-7xl mx-auto p-6 space-y-8">
    {/* Metrics Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricsCard title="Model Accuracy" value={r2} />
      <MetricsCard title="RMSE" value={rmse} />
      <MetricsCard title="Time Points" value={count} />
    </div>
    
    {/* 3D Visualization */}
    <div className="card">
      <h2>3D Tablet Visualization</h2>
      <TabletViewer heatmapUrl={currentHeatmap} />
      <TimeScrubber 
        timePoints={timePoints}
        currentTime={selectedTimePoint}
        onTimeChange={setSelectedTimePoint}
      />
    </div>
    
    {/* Dissolution Chart */}
    <div className="card">
      <h2>Dissolution Profile</h2>
      <DissolutionChart data={dissolutionCurve} />
    </div>
    
    {/* Grad-CAM Analysis */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <GradCAMVisualization 
        wavelength="280nm"
        data={gradCam280}
      />
      <GradCAMVisualization 
        wavelength="520nm"
        data={gradCam520}
      />
    </div>
    
    {/* XAI Report */}
    <XAIReport analysis={currentAnalysis} />
    
    {/* Export Panel */}
    <ExportPanel analysisId={currentAnalysis.id} />
  </div>
  
  <BottomBar 
    currentPh={currentPh}
    currentTime={currentTime}
    severityIndex={severityIndex}
  />
</div>
```

---

## 🧩 Core Components

### UploadZone Component
**File:** `src/components/upload/UploadZone.jsx`

**Props:**
```typescript
interface UploadZoneProps {
  onFilesAdded?: (files: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
}
```

**Features:**
- Drag-and-drop support
- Click to browse
- File type validation (JPG, PNG only)
- File size validation (<10MB)
- Visual feedback on drag
- Multiple file selection

**Validation Rules:**
```javascript
const ACCEPTED_TYPES = ['image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 10;
```

**Error Messages:**
- "Only JPG and PNG files are allowed"
- "File size must be under 10MB"
- "Maximum 10 files allowed"

---

### ImageMetadataForm Component
**File:** `src/components/upload/ImageMetadataForm.jsx`

**Props:**
```typescript
interface ImageMetadataFormProps {
  upload: Upload;
  onSubmit: (metadata: { timePoint: number; phLevel: number }) => void;
  onSkip?: () => void;
}
```

**Form Fields:**
1. **Time Point**
   - Type: Number input
   - Label: "Time Point (minutes)"
   - Validation: Required, ≥0
   - Placeholder: "e.g., 0, 30, 60"

2. **pH Level**
   - Type: Slider or Dropdown
   - Label: "Medium pH Level"
   - Range: 1.2 to 7.4
   - Step: 0.1
   - Common values: 1.2 (Acidic), 6.8 (Neutral), 7.4 (Alkaline)

**Layout:**
```jsx
<div className="card">
  <img src={upload.preview} className="w-full h-48 object-cover rounded-lg mb-4" />
  
  <div className="space-y-4">
    <div>
      <label className="text-sm font-medium text-secondary">
        Time Point (minutes)
      </label>
      <input 
        type="number"
        min="0"
        className="input-base w-full mt-1"
        placeholder="e.g., 0, 30, 60"
      />
    </div>
    
    <div>
      <label className="text-sm font-medium text-secondary">
        Medium pH Level
      </label>
      <select className="input-base w-full mt-1">
        <option value="1.2">pH 1.2 (Acidic - Gastric)</option>
        <option value="6.8">pH 6.8 (Neutral - Intestinal)</option>
        <option value="7.4">pH 7.4 (Alkaline - Blood)</option>
      </select>
    </div>
    
    <div className="flex gap-3">
      <button className="btn-primary flex-1">Save Metadata</button>
      <button className="btn-ghost">Skip</button>
    </div>
  </div>
</div>
```

---

### TabletViewer Component (Three.js)
**File:** `src/components/analysis/TabletViewer.jsx`

**Props:**
```typescript
interface TabletViewerProps {
  heatmapUrl?: string;
  autoRotate?: boolean;
  showControls?: boolean;
}
```

**3D Scene Setup:**
```javascript
// Geometry
const geometry = new THREE.CylinderGeometry(
  1,      // radiusTop
  1,      // radiusBottom
  0.3,    // height
  32,     // radialSegments
  1,      // heightSegments
  false   // openEnded
);

// Material
const material = new THREE.MeshStandardMaterial({
  color: 0xf5f5f5,        // Clinical white
  map: heatmapTexture,     // Grad-CAM overlay
  metalness: 0.1,
  roughness: 0.4,
  side: THREE.DoubleSide
});

// Lighting
<ambientLight intensity={0.5} />
<directionalLight position={[10, 10, 5]} intensity={1} />
<spotLight position={[0, 5, 0]} intensity={0.3} />

// Camera
camera={{ position: [0, 0, 3], fov: 50 }}

// Controls
<OrbitControls 
  enableZoom={true}
  enablePan={false}
  autoRotate={autoRotate}
  autoRotateSpeed={2}
/>
```

**Texture Mapping:**
```javascript
useEffect(() => {
  if (heatmapUrl) {
    const loader = new THREE.TextureLoader();
    loader.load(heatmapUrl, (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
      setTexture(texture);
    });
  }
}, [heatmapUrl]);
```

---

### DissolutionChart Component (Recharts)
**File:** `src/components/analysis/DissolutionChart.jsx`

**Props:**
```typescript
interface DissolutionChartProps {
  data: Array<{ time: number; q: number }>;
  showGrid?: boolean;
  showTooltip?: boolean;
}
```

**Chart Configuration:**
```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export default function DissolutionChart({ data }) {
  const { isDark } = useTheme();
  
  const colors = {
    line: isDark ? '#3b82f6' : '#0284c7',
    grid: isDark ? '#334155' : '#e5e7eb',
    text: isDark ? '#cbd5e1' : '#6b7280',
    tooltip: isDark ? '#1e293b' : '#ffffff'
  };
  
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        <XAxis 
          dataKey="time" 
          stroke={colors.text}
          label={{ value: 'Time (minutes)', position: 'insideBottom', offset: -5 }}
        />
        <YAxis 
          stroke={colors.text}
          label={{ value: '% Dissolved', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: colors.tooltip,
            border: `1px solid ${colors.grid}`,
            borderRadius: '8px'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="q" 
          stroke={colors.line}
          strokeWidth={2}
          dot={{ fill: colors.line, r: 4 }}
          activeDot={{ r: 6 }}
          name="Dissolution (%)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

---

### GradCAMVisualization Component
**File:** `src/components/analysis/GradCAMVisualization.jsx`

**Props:**
```typescript
interface GradCAMVisualizationProps {
  wavelength: '280nm' | '520nm';
  data: {
    focusRegion: string;
    mechanism: string;
    intensity: number;
    heatmapUrl: string;
  };
}
```

**Layout:**
```jsx
<div className="card">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-primary">
      Grad-CAM Analysis - {wavelength}
    </h3>
    <span className="badge-info">{wavelength}</span>
  </div>
  
  {/* Heatmap Image */}
  <div className="relative rounded-lg overflow-hidden mb-4">
    <img 
      src={data.heatmapUrl}
      alt={`Grad-CAM ${wavelength}`}
      className="w-full h-64 object-cover"
    />
    <div className="absolute top-2 right-2 badge-warning">
      Intensity: {data.intensity}%
    </div>
  </div>
  
  {/* Interpretation */}
  <div className="space-y-2">
    <div className="flex items-start gap-2">
      <span className="text-sm font-medium text-secondary">Focus Region:</span>
      <span className="text-sm text-primary">{data.focusRegion}</span>
    </div>
    <div className="flex items-start gap-2">
      <span className="text-sm font-medium text-secondary">Mechanism:</span>
      <span className="text-sm text-primary">{data.mechanism}</span>
    </div>
  </div>
</div>
```

**Wavelength Interpretation:**
- **280nm (UV):** API detection, surface dissolution
- **520nm (Visible):** Structural changes, matrix erosion

---

### TimeScrubber Component
**File:** `src/components/analysis/TimeScrubber.jsx`

**Props:**
```typescript
interface TimeScrubberProps {
  timePoints: number[];
  currentTime: number;
  onTimeChange: (time: number) => void;
}
```

**Features:**
- Horizontal slider
- Time point markers
- Current time indicator
- Click to jump
- Keyboard navigation (arrow keys)

**Implementation:**
```jsx
<div className="card">
  <div className="flex items-center justify-between mb-4">
    <span className="text-sm font-medium text-secondary">Time Point</span>
    <span className="text-lg font-bold text-primary">{currentTime} min</span>
  </div>
  
  <div className="relative">
    {/* Timeline */}
    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
      <div 
        className="h-full bg-pharma-blue-600 rounded-full transition-all duration-300"
        style={{ width: `${(currentTime / Math.max(...timePoints)) * 100}%` }}
      />
    </div>
    
    {/* Time Point Markers */}
    <div className="relative mt-4 flex justify-between">
      {timePoints.map((time) => (
        <button
          key={time}
          onClick={() => onTimeChange(time)}
          className={`
            w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
            transition-all duration-200
            ${time === currentTime
              ? 'bg-pharma-blue-600 text-white scale-110'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:scale-105'
            }
          `}
        >
          {time}
        </button>
      ))}
    </div>
  </div>
</div>
```

---

### XAIReport Component
**File:** `src/components/analysis/XAIReport.jsx`

**Props:**
```typescript
interface XAIReportProps {
  analysis: {
    r2: number;
    rmse: number;
    parameters: {
      api: string;
      excipient: string;
      ph: string;
    };
    gradCam280: GradCAMData;
    gradCam520: GradCAMData;
  };
}
```

**Content Sections:**
1. **Confidence Score**
   - Display R² as percentage
   - Visual gauge or progress bar
   - Interpretation (Excellent/Good/Fair)

2. **Erosion Diagnostic**
   - Primary mechanism identified
   - Secondary factors
   - Risk assessment

3. **Model Explanation**
   - Why specific regions were flagged
   - Correlation with dissolution profile
   - Clinical significance

**Layout:**
```jsx
<div className="card">
  <h2 className="text-2xl font-bold text-primary mb-6">
    Explainable AI Report
  </h2>
  
  {/* Confidence Score */}
  <div className="mb-6">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-secondary">Model Confidence</span>
      <span className="text-2xl font-bold text-pharma-blue-600">
        {(analysis.r2 * 100).toFixed(1)}%
      </span>
    </div>
    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
      <div 
        className="h-full bg-pharma-blue-600 transition-all duration-500"
        style={{ width: `${analysis.r2 * 100}%` }}
      />
    </div>
    <p className="text-xs text-tertiary mt-1">
      {analysis.r2 >= 0.85 ? 'Excellent' : analysis.r2 >= 0.70 ? 'Good' : 'Fair'} prediction accuracy
    </p>
  </div>
  
  {/* Erosion Diagnostic */}
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-primary mb-3">Erosion Diagnostic</h3>
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <span className="badge-info">280nm</span>
        <div>
          <p className="text-sm font-medium text-primary">{analysis.gradCam280.focusRegion}</p>
          <p className="text-xs text-secondary">{analysis.gradCam280.mechanism}</p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <span className="badge-warning">520nm</span>
        <div>
          <p className="text-sm font-medium text-primary">{analysis.gradCam520.focusRegion}</p>
          <p className="text-xs text-secondary">{analysis.gradCam520.mechanism}</p>
        </div>
      </div>
    </div>
  </div>
  
  {/* Interpretation */}
  <div className="bg-pharma-blue-50 dark:bg-pharma-blue-900/20 rounded-lg p-4">
    <h4 className="text-sm font-semibold text-primary mb-2">Clinical Interpretation</h4>
    <p className="text-sm text-secondary leading-relaxed">
      The model identified <strong>{analysis.gradCam280.focusRegion.toLowerCase()}</strong> as 
      the primary region driving dissolution, indicating <strong>{analysis.gradCam280.mechanism.toLowerCase()}</strong>. 
      This pattern is consistent with the formulation parameters: {analysis.parameters.api} in 
      {analysis.parameters.ph} medium with {analysis.parameters.excipient} as excipient.
    </p>
  </div>
</div>
```

---

### BottomBar Component
**File:** `src/components/layout/BottomBar.jsx`

**Props:**
```typescript
interface BottomBarProps {
  currentPh: number;
  currentTime: number;
  severityIndex: number;
}
```

**Purpose:** Live telemetry display

**Layout:**
```jsx
<div className="fixed bottom-0 left-0 right-0 bg-slate-900 dark:bg-slate-950 border-t border-slate-700 px-6 py-3">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">pH Level</span>
        <span className="text-lg font-bold text-white">{currentPh.toFixed(1)}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Time Point</span>
        <span className="text-lg font-bold text-white">{currentTime} min</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Severity Index</span>
        <span className={`text-lg font-bold ${
          severityIndex > 70 ? 'text-red-400' : 
          severityIndex > 40 ? 'text-yellow-400' : 
          'text-green-400'
        }`}>
          {severityIndex}%
        </span>
      </div>
    </div>
    
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      <span className="text-xs text-slate-400">Live Analysis</span>
    </div>
  </div>
</div>
```

---

## 🎨 Common Components

### Button Component
**File:** `src/components/common/Button.jsx`

**Variants:**
- `primary` - Main actions (Submit, Analyze)
- `secondary` - Secondary actions (Cancel, Back)
- `ghost` - Tertiary actions (Skip, Close)
- `danger` - Destructive actions (Delete, Clear)

### Card Component
**File:** `src/components/common/Card.jsx`

**Variants:**
- `default` - Standard card
- `hover` - Interactive card with hover effect
- `bordered` - Card with prominent border

### Badge Component
**File:** `src/components/common/Badge.jsx`

**Variants:**
- `success` - Green (Completed, Success)
- `error` - Red (Failed, Error)
- `warning` - Orange (Pending, Warning)
- `info` - Blue (Info, Processing)

### Spinner Component
**File:** `src/components/common/Spinner.jsx`

**Sizes:**
- `sm` - 16px
- `md` - 24px (default)
- `lg` - 32px
- `xl` - 48px

---

## 📊 Data Flow Summary

```
User Upload
    ↓
UploadZone → Zustand Store (uploads)
    ↓
ImageMetadataForm → Update uploads with metadata
    ↓
Validation & Sort → Chronological order
    ↓
API Call (modelService.analyzeImages)
    ↓
Processing State → Show spinner
    ↓
API Response → Zustand Store (currentAnalysis)
    ↓
ResultsView → Display all visualizations
    ↓
User Interaction → TimeScrubber, Filters
    ↓
Export/Share → PDF generation
```

---

**Component specifications complete. Ready for implementation!**