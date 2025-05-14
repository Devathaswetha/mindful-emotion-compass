
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
import MoodHistory from '@/components/mood/MoodHistory';
import MoodRecommendations from '@/components/mood/MoodRecommendations';
import EmotionChatbot from '@/components/EmotionChatbot';
import { MoodEntry } from '@/lib/mockData';
import { MessageCircle } from 'lucide-react';

const emotions = ['Happy', 'Sad', 'Angry', 'Surprised', 'Neutral', 'Anxious', 'Excited'];

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
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [accuracy, setAccuracy] = useState<number>(0);
  
  const availableTags = ['Work', 'Family', 'Friends', 'Health', 'Sleep', 'Exercise', 'Meditation', 'Stress', 'Anxiety', 'Depression', 'Joy'];

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

  // Load mood history from localStorage on component mount
  useEffect(() => {
    const savedMoodHistory = localStorage.getItem('moodHistory');
    if (savedMoodHistory) {
      try {
        setMoodHistory(JSON.parse(savedMoodHistory));
      } catch (e) {
        console.error('Error loading mood history:', e);
      }
    }

    // Auto-open chatbot if there's detected negative emotions from previous session
    const lastUserEmotion = localStorage.getItem('lastUserEmotion');
    if (lastUserEmotion && ['Sad', 'Angry', 'Anxious'].includes(lastUserEmotion)) {
      setTimeout(() => {
        toast({
          title: "Welcome back",
          description: `Last time you were feeling ${lastUserEmotion}. Would you like to chat about it?`,
          action: (
            <Button
              onClick={() => setShowChatbot(true)}
              className="bg-mindful-primary hover:bg-mindful-secondary"
            >
              Chat now
            </Button>
          )
        });
      }, 2000);
    }
  }, []);

  const handleAudioEmotionDetected = (result: AudioEmotionDetectionResult) => {
    setAudioEmotion(result.emotion);
    setAccuracy(Math.round(result.confidence * 100));
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

    // Create new mood entry
    const newMoodEntry: MoodEntry = {
      id: `mood-${Date.now()}`,
      date: new Date().toISOString(),
      mood: selectedMood,
      intensity: moodIntensity,
      tags: [...moodTags],
      notes: moodContext || undefined,
      aiDetectedEmotion: detectedEmotion || audioEmotion
    };

    // Update mood history
    const updatedHistory = [newMoodEntry, ...moodHistory];
    setMoodHistory(updatedHistory);
    
    // Save to localStorage
    localStorage.setItem('moodHistory', JSON.stringify(updatedHistory));
    localStorage.setItem('lastUserEmotion', selectedMood);

    // Display toast
    toast({
      title: "Mood Saved",
      description: `You're feeling ${selectedMood} (intensity: ${moodIntensity}/5)`
    });

    // Ask if they want to talk to the chatbot if they're not feeling great
    if (['Sad', 'Angry', 'Anxious'].includes(selectedMood) && !showChatbot) {
      setTimeout(() => {
        toast({
          title: "Would you like some support?",
          description: "Our emotional support chatbot can help you process these feelings.",
          action: (
            <Button
              onClick={() => setShowChatbot(true)}
              className="bg-mindful-primary hover:bg-mindful-secondary"
            >
              Chat now
            </Button>
          )
        });
      }, 1000);
    }

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
    
    toast({
      title: "Emotion Selected",
      description: `Using detected emotion: ${emotion}`,
    });
  };

  const handleEmotionDetected = (emotion: string, confidence: number = 0) => {
    setDetectedEmotion(emotion);
    setAccuracy(Math.round(confidence * 100));
    
    // If strong confidence, suggest using it
    if (confidence > 0.7 && !selectedMood) {
      toast({
        title: `Detected ${emotion}`,
        description: "Would you like to use this detected emotion?",
        action: (
          <Button
            onClick={() => handleUseEmotion(emotion)}
            className="bg-mindful-primary hover:bg-mindful-secondary"
          >
            Use it
          </Button>
        )
      });
    }
  };

  const handleDeleteMoodEntry = (id: string) => {
    const updatedHistory = moodHistory.filter(entry => entry.id !== id);
    setMoodHistory(updatedHistory);
    localStorage.setItem('moodHistory', JSON.stringify(updatedHistory));
    toast({
      title: "Entry Deleted",
      description: "Mood entry has been removed from your history."
    });
  };

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-mindful-dark mb-1">Mood Tracker</h1>
          <p className="text-gray-500">Record how you're feeling and get personalized support</p>
        </div>
        <Button
          onClick={toggleChatbot}
          className={`flex items-center gap-2 ${
            showChatbot 
            ? 'bg-gray-300 hover:bg-gray-400 text-gray-800' 
            : 'bg-gradient-to-r from-mindful-primary to-mindful-secondary hover:from-mindful-secondary hover:to-mindful-primary text-white'
          }`}
        >
          <MessageCircle size={18} />
          {showChatbot ? "Hide Support" : "Emotional Support"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 border-mindful-soft shadow-lg overflow-hidden rounded-xl">
            <CardHeader className="bg-gradient-to-r from-mindful-soft to-white pb-4">
              <CardTitle className="text-xl text-mindful-dark">How are you feeling?</CardTitle>
              <CardDescription>
                Select your mood or use technology to help identify your emotions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-6">
                <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="manual">Manual Select</TabsTrigger>
                    <TabsTrigger value="camera">Camera Check-in</TabsTrigger>
                    <TabsTrigger value="voice">Voice Check-in</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="manual" className="pt-4">
                    <MoodSelector 
                      emotions={emotions} 
                      selectedMood={selectedMood} 
                      onMoodSelect={setSelectedMood} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="camera" className="pt-4">
                    <CameraEmotionDetector 
                      emotionModel={emotionModel}
                      onEmotionDetected={handleEmotionDetected}
                      onUseEmotion={handleUseEmotion}
                    />
                    {accuracy > 0 && detectedEmotion && (
                      <div className="mt-2 text-center text-sm text-gray-500">
                        Detection confidence: {accuracy}%
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="voice" className="pt-4">
                    <AudioEmotionTab 
                      audioEmotion={audioEmotion}
                      onEmotionDetected={handleAudioEmotionDetected}
                      onUseEmotion={handleUseEmotion}
                    />
                    {accuracy > 0 && audioEmotion && (
                      <div className="mt-2 text-center text-sm text-gray-500">
                        Detection confidence: {accuracy}%
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Mood recommendations when mood is selected */}
                {selectedMood && (
                  <div className="mt-6 animate-fade-in">
                    <MoodRecommendations 
                      mood={selectedMood} 
                      intensity={moodIntensity}
                      tags={moodTags}
                    />
                  </div>
                )}

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
            <CardFooter className="bg-gradient-to-r from-white to-mindful-soft p-5">
              <Button 
                onClick={handleSubmit} 
                className="w-full bg-gradient-to-r from-mindful-primary to-mindful-secondary hover:from-mindful-secondary hover:to-mindful-primary text-white"
                disabled={!selectedMood}
              >
                Save Mood Entry
              </Button>
            </CardFooter>
          </Card>

          {/* Mood History Card */}
          <MoodHistory moodHistory={moodHistory} onDeleteEntry={handleDeleteMoodEntry} />
        </div>

        {/* Emotion Chatbot Column */}
        <div className={`transition-all duration-500 ${showChatbot ? 'opacity-100 transform-none' : 'opacity-0 lg:opacity-100 hidden lg:block'}`}>
          {showChatbot || window.innerWidth >= 1024 ? (
            <EmotionChatbot detectedEmotion={selectedMood || detectedEmotion || audioEmotion} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
