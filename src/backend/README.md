
# MindfulMe Backend Architecture

This document describes the backend architecture for the MindfulMe application, specifically focusing on the emotion detection services.

## Overview

The backend consists of two main components:
1. A FastAPI server to handle API requests
2. Python-based ML services for emotion detection

## Directory Structure

```
backend/
├── app/
│   ├── main.py             # FastAPI entry point
│   ├── routers/
│   │   ├── emotions.py     # API endpoints for emotion detection
│   │   └── analytics.py    # API endpoints for user analytics
│   ├── models/
│   │   ├── user.py         # User data models
│   │   └── emotion.py      # Emotion data models
│   └── services/
│       ├── facial_emotion.py   # Facial emotion detection service
│       └── audio_emotion.py    # Audio emotion detection service
├── ml/
│   ├── facial_detection/
│   │   ├── model.py        # Model definition
│   │   ├── train.py        # Training script
│   │   └── inference.py    # Inference utilities
│   └── audio_detection/
│       ├── model.py        # Model definition
│       ├── train.py        # Training script
│       └── inference.py    # Inference utilities
├── data/
│   ├── facial/             # Facial emotion datasets
│   └── audio/              # Audio emotion datasets
├── trained_models/         # Pre-trained model files
├── requirements.txt        # Python dependencies
└── Dockerfile              # Docker configuration
```

## API Endpoints

### Facial Emotion Detection

```
POST /api/emotions/facial
```

Request:
- Content-Type: multipart/form-data
- Body: form with 'image' field containing image file

Response:
```json
{
  "emotions": [
    { "emotion": "happy", "confidence": 0.85 },
    { "emotion": "sad", "confidence": 0.10 },
    { "emotion": "angry", "confidence": 0.03 },
    { "emotion": "surprised", "confidence": 0.01 },
    { "emotion": "neutral", "confidence": 0.01 }
  ],
  "primary_emotion": "happy",
  "processing_time_ms": 152
}
```

### Audio Emotion Detection

```
POST /api/emotions/audio
```

Request:
- Content-Type: multipart/form-data
- Body: form with 'audio' field containing audio file (WAV format)

Response:
```json
{
  "emotions": [
    { "emotion": "happy", "confidence": 0.72 },
    { "emotion": "sad", "confidence": 0.15 },
    { "emotion": "angry", "confidence": 0.08 },
    { "emotion": "neutral", "confidence": 0.05 }
  ],
  "primary_emotion": "happy",
  "processing_time_ms": 203
}
```

## Setup and Deployment

### Prerequisites

- Python 3.8+
- pip
- docker (optional)

### Local Development

1. Clone the repository
```bash
git clone https://github.com/yourusername/mindfulme-backend.git
cd mindfulme-backend
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

4. Run the application
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Docker Deployment

1. Build the Docker image
```bash
docker build -t mindfulme-backend .
```

2. Run the container
```bash
docker run -d -p 8000:8000 --name mindfulme-api mindfulme-backend
```

## ML Models

### Facial Emotion Detection

The facial emotion detection model uses a convolutional neural network (CNN) trained on the FER2013 dataset. The model architecture consists of convolutional layers followed by max-pooling and fully connected layers.

### Audio Emotion Detection

The audio emotion detection model uses Mel-frequency cepstral coefficients (MFCCs) as features extracted from audio files and a recurrent neural network (RNN) for classification. The model is trained on the RAVDESS dataset.
