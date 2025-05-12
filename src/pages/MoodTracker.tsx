
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import Webcam from 'react-webcam';
import { 
  loadEmotionDetectionModel, 
  getImageDataFromVideo, 
  processImageForEmotionDetection
} from '@/lib/emotionDetection';

const emotions = ['Happy', 'Sad', 'Angry', 'Surprised', 'Neutral'];

const MoodTracker = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodIntensity, setMoodIntensity] = useState(3);
  const [moodTags, setMoodTags] = useState<string[]>([]);
  const [moodContext, setMoodContext] = useState('');
  const [emotionModel, setEmotionModel] = useState<any>(null);
  
  const webcamRef = useRef<Webcam>(null);
  const availableTags = ['Work', 'Family', 'Friends', 'Health', 'Sleep', 'Exercise', 'Meditation'];

  // Load the emotion detection model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsModelLoading(true);
        const model = await loadEmotionDetectionModel();
        setEmotionModel(model);
        console.log('Emotion detection model loaded successfully');
      } catch (error) {
        console.error('Failed to load emotion detection model:', error);
      } finally {
        setIsModelLoading(false);
      }
    };

    loadModel();
  }, []);

  const handleCameraToggle = () => {
    if (!showCamera) {
      setShowCamera(true);
    } else {
      setShowCamera(false);
      setDetectedEmotion(null);
    }
  };

  const handleCapture = async () => {
    if (!webcamRef.current || !webcamRef.current.video || !emotionModel) return;
    
    setIsLoading(true);
    
    try {
      // Get image data from webcam
      const imageData = getImageDataFromVideo(webcamRef.current.video);
      
      if (imageData) {
        // Process image with model
        const result = await processImageForEmotionDetection(imageData, emotionModel);
        
        if (result) {
          setDetectedEmotion(result.emotion);
          
          // Show toast with detected emotion
          const confidencePercentage = Math.round(result.confidence * 100);
          toast({
            title: "Emotion Detected",
            description: `${result.emotion} (${confidencePercentage}% confidence)`
          });
        } else {
          toast({
            title: "Detection Issue",
            description: "Could not detect emotions clearly. Please try again.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error capturing emotion:', error);
      toast({
        title: "Detection Failed",
        description: "Unable to detect emotions. Please try again with better lighting.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    if (moodTags.includes(tag)) {
      setMoodTags(moodTags.filter(t => t !== tag));
    } else {
      setMoodTags([...moodTags, tag]);
    }
  };

  const handleSubmit = () => {
    if (!selectedMood) {
      toast({
        title: "Mood Required",
        description: "Please select a mood before saving.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, we would save this to a database
    toast({
      title: "Mood Saved",
      description: `You're feeling ${selectedMood} (intensity: ${moodIntensity}/5)`
    });

    // Reset form
    setSelectedMood(null);
    setMoodIntensity(3);
    setMoodTags([]);
    setMoodContext('');
    setDetectedEmotion(null);
    setShowCamera(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-mindful-dark">Mood Tracker</h1>
        <p className="text-gray-500">Record how you're feeling today</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How are you feeling?</CardTitle>
          <CardDescription>
            Select your mood or use the camera to help identify your emotions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Camera section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Emotion Detection</h3>
              
              <div className="flex flex-col items-center">
                {!showCamera ? (
                  <Button 
                    onClick={handleCameraToggle} 
                    className="bg-mindful-primary hover:bg-mindful-secondary"
                    disabled={isModelLoading}
                  >
                    {isModelLoading ? "Loading model..." : "Enable Camera Check-in"}
                  </Button>
                ) : (
                  <div className="space-y-4 w-full">
                    <div className="relative max-w-md mx-auto">
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                          facingMode: "user"
                        }}
                        className="w-full rounded-lg border border-gray-300"
                      />
                      
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-center space-x-4">
                      <Button 
                        onClick={handleCapture} 
                        disabled={isLoading || isModelLoading}
                        className="bg-mindful-primary hover:bg-mindful-secondary"
                      >
                        {isLoading ? "Detecting..." : "Detect Emotion"}
                      </Button>
                      
                      <Button 
                        onClick={handleCameraToggle} 
                        variant="outline"
                      >
                        Close Camera
                      </Button>
                    </div>
                    
                    {detectedEmotion && (
                      <div className="mt-4 p-4 bg-mindful-soft rounded-lg text-center">
                        <p className="text-lg font-medium">Suggested emotion:</p>
                        <p className="text-2xl text-mindful-primary font-bold">{detectedEmotion}</p>
                        <p className="mt-2 text-sm text-gray-500">
                          Is this correct? You can adjust your selection below.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Manual mood selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select Your Mood</h3>
              
              <div className="grid grid-cols-5 gap-2">
                {["😊", "😢", "😠", "😮", "😐"].map((emoji, index) => (
                  <button
                    key={emoji}
                    className={`p-3 rounded-lg text-3xl transition-all ${
                      selectedMood === emotions[index]
                        ? "bg-mindful-soft ring-2 ring-mindful-primary"
                        : "bg-white hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedMood(emotions[index])}
                  >
                    {emoji}
                    <div className="text-xs mt-1">{emotions[index]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mood intensity */}
            {selectedMood && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Intensity</h3>
                <div className="flex items-center space-x-4">
                  <span className="text-sm">Mild</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={moodIntensity}
                    onChange={(e) => setMoodIntensity(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm">Strong</span>
                </div>
              </div>
            )}

            {/* Tags */}
            {selectedMood && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">What's influencing your mood?</h3>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        moodTags.includes(tag)
                          ? "bg-mindful-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedMood && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Context</h3>
                <textarea
                  rows={3}
                  placeholder="What's on your mind? (Optional)"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={moodContext}
                  onChange={(e) => setMoodContext(e.target.value)}
                />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-mindful-primary hover:bg-mindful-secondary"
            disabled={!selectedMood}
          >
            Save Mood Entry
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MoodTracker;
