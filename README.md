
# MindfulMe: Your Pocket Companion for Mental Wellness

**Slogan:** Nurturing Your Mind, One Moment at a Time. (Now with empathetic insights!)

## About

MindfulMe is a comprehensive mental wellness application designed to help users track their emotional states, practice mindfulness, and improve overall mental health. The application features innovative facial emotion detection to assist users in identifying and labeling their feelings.

## Key Features

### Daily Mood & Emotion Tracker
- Quick selection of mood and intensity
- Optional camera-assisted emotion check-in with facial expression analysis
- Tag emotions with context (work, family, etc.)
- Data visualization and trends

### Intelligent Journaling with Sentiment Analysis
- Record thoughts and feelings
- Automatic sentiment detection
- Track emotional patterns over time

### Guided Meditation & Mindfulness Library
- Collection of guided meditations organized by need
- Timer for self-guided practice
- Progress tracking

### Educational Resource Hub
- Articles and videos about mental health topics
- Techniques for emotional regulation

### SOS / Crisis Support Button
- Quick access to crisis resources
- Emergency contact information

## Technical Implementation

### Frontend Framework
- React with TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- Chart.js for data visualization

### Facial Emotion Detection
- TensorFlow.js for on-device machine learning
- Face-landmarks-detection package for facial feature extraction
- Privacy-first approach with on-device processing

### Data Management
- Local storage for privacy
- Optional data export functionality

## Running the Project

1. Install dependencies:
```
npm install
```

2. Start the development server:
```
npm run dev
```

3. Open your browser and navigate to `http://localhost:8080`

## Facial Emotion Detection

The facial emotion detection feature:
- Processes everything locally on the device
- Never sends images to any server
- Is completely opt-in
- Serves as an assistive tool, not a diagnostic one

## Dataset Information

For educational purposes, this project includes information about the FER2013 (Facial Expression Recognition) dataset that could be used to train emotion detection models:
- ~35,000 48x48 grayscale facial images
- 7 emotion categories: Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral
- Available on Kaggle: https://www.kaggle.com/datasets/msambare/fer2013

## Privacy and Ethics

MindfulMe is designed with privacy and ethical considerations at its core:
- All data is stored locally by default
- Emotion detection is a supplementary tool, not a definitive measure
- Users always have final say on their emotional state
- Clear explanations of how technology is being used

## Future Development

- Integration with wearable devices for physiological data
- Expanded meditation library
- Community features (opt-in)
- Additional language support
