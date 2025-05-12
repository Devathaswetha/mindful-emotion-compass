
# MindfulMe: Mental Wellness Companion

MindfulMe is a comprehensive mental wellness application designed to help users track their emotional states, practice mindfulness, and improve overall mental health.

## Features

### Daily Mood & Emotion Tracker
- Quick selection of mood and intensity
- **Multimodal Emotion Detection:**
  - Camera-assisted facial emotion recognition
  - Voice-based emotion analysis
- Tag emotions with context (work, family, etc.)
- Data visualization and trends

### Intelligent Journaling
- Record thoughts and feelings
- Track emotional patterns over time

### Guided Meditation & Mindfulness Library
- Collection of guided meditations organized by need
- Timer for self-guided practice
- Progress tracking

### Educational Resource Hub
- Articles and videos about mental health topics
- Techniques for emotional regulation

### AI-Driven Recommendations
- Personalized content suggestions based on mood
- Adaptive recommendations that improve over time

### Crisis Support Resources
- Quick access to crisis resources
- Emergency contact information

## Project Structure

```
mindfulme/
├── frontend/             # React frontend application
│   ├── src/              # Source code
│   │   ├── components/   # UI components
│   │   ├── lib/          # Utility functions
│   │   ├── pages/        # Application pages
│   │   └── routes/       # Routing configuration
├── backend/              # Python backend services
│   ├── app/              # FastAPI application
│   │   ├── routers/      # API endpoints
│   │   └── services/     # Business logic services
│   └── ml/               # Machine learning models
├── docs/                 # Documentation
└── README.md             # This file
```

## Technology Stack

### Frontend
- React with TypeScript
- TailwindCSS for styling
- Shadcn/UI component library
- Chart.js for data visualization
- React Webcam for camera access
- Browser APIs for audio recording

### Backend
- FastAPI (Python)
- OpenCV for image processing
- Librosa for audio processing
- NumPy, scikit-learn for data processing
- TensorFlow/PyTorch for emotion detection models

## Getting Started

### Prerequisites
- Node.js 16+
- Python 3.8+
- npm or yarn

### Frontend Setup

1. Navigate to the project directory
```bash
cd mindfulme
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory
```bash
cd backend
```

2. Create a virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Start the API server
```bash
uvicorn app.main:app --reload
```

5. The API will be available at `http://localhost:8000`

## Datasets

For educational and development purposes, this project references:

### Facial Emotion Recognition
- **FER2013:** ~35,000 48x48 grayscale facial images with 7 emotion categories
  - Source: [Kaggle FER2013](https://www.kaggle.com/datasets/msambare/fer2013)

### Audio Emotion Recognition
- **RAVDESS:** Ryerson Audio-Visual Database of Emotional Speech and Song
  - Source: [Zenodo RAVDESS](https://zenodo.org/record/1188976)

## Privacy and Ethics

MindfulMe is designed with privacy and ethical considerations:
- All data is stored locally by default
- Emotion detection is a supplementary tool, not a definitive measure
- Users always have final say on their emotional state
- Clear explanations of how technology is being used
