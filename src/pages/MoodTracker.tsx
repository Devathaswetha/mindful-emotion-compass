
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { loadEmotionDetectionModel } from '@/lib/emotionDetection';
import { AudioEmotionDetectionResult } from '@/lib/audioEmotionDetection';
import MoodSelector from '@/components/mood/MoodSelector';
import CameraEmotionDetector from '@/components/mood/CameraEmotionDetector';
import AudioEmotionTab from '@/components/mood/AudioEmotionTab';
import MoodContext from '@/components/mood/MoodContext';

const emotions = ['Happy', 'Sad', 'Angry', 'Surprised', 'Neutral'];

const MoodTracker = () => {
  const [activeTab, setActiveTab] = useState('manual');
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodIntensity, setMoodIntensity] = useState(3);
  const [moodTags, setMoodTags] = useState<string[]>([]);
  const [moodContext, setMoodContext] = useState('');
  const [emotionModel, setEmotionModel] = useState<any>(null);
  const [audioEmotion, setAudioEmotion] = useState<string | null>(null);
  
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

  const handleAudioEmotionDetected = (result: AudioEmotionDetectionResult) => {
    setAudioEmotion(result.emotion);
    if (!selectedMood) {
      setSelectedMood(result.emotion);
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
    setAudioEmotion(null);
    setActiveTab('manual');
  };

  const handleUseEmotion = (emotion: string) => {
    setSelectedMood(emotion);
    setActiveTab('manual');
  };

  const handleEmotionDetected = (emotion: string) => {
    setDetectedEmotion(emotion);
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
            Select your mood or use technology to help identify your emotions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="manual">Manual Select</TabsTrigger>
                <TabsTrigger value="camera">Camera Check-in</TabsTrigger>
                <TabsTrigger value="voice">Voice Check-in</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual">
                <MoodSelector 
                  emotions={emotions} 
                  selectedMood={selectedMood} 
                  onMoodSelect={setSelectedMood} 
                />
              </TabsContent>
              
              <TabsContent value="camera">
                <CameraEmotionDetector 
                  emotionModel={emotionModel}
                  onEmotionDetected={handleEmotionDetected}
                  onUseEmotion={handleUseEmotion}
                />
              </TabsContent>
              
              <TabsContent value="voice">
                <AudioEmotionTab 
                  audioEmotion={audioEmotion}
                  onEmotionDetected={handleAudioEmotionDetected}
                  onUseEmotion={handleUseEmotion}
                />
              </TabsContent>
            </Tabs>

            {/* Mood context (intensity, tags, notes) */}
            {selectedMood && (
              <MoodContext
                moodIntensity={moodIntensity}
                setMoodIntensity={setMoodIntensity}
                moodTags={moodTags}
                toggleTag={toggleTag}
                availableTags={availableTags}
                moodContext={moodContext}
                setMoodContext={setMoodContext}
              />
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
