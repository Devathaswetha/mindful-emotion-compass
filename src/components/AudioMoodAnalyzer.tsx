
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mic, MicOff, Volume2, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  loadAudioEmotionDetectionModel,
  startAudioRecording,
  stopAudioRecording,
  AudioEmotionDetectionResult
} from '@/lib/audioEmotionDetection';

interface AudioMoodAnalyzerProps {
  onEmotionDetected?: (result: AudioEmotionDetectionResult) => void;
}

const AudioMoodAnalyzer = ({ onEmotionDetected }: AudioMoodAnalyzerProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<AudioEmotionDetectionResult | null>(null);
  const [audioModel, setAudioModel] = useState<any>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingVolume, setRecordingVolume] = useState(0); // 0-100
  const [continuousMode, setContinuousMode] = useState(false);
  
  const recordingRef = useRef<{
    mediaRecorder: MediaRecorder;
    audioChunks: Blob[];
    stream: MediaStream;
  } | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const volumeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const continuousModeRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();
  
  // Maximum recording time in seconds
  const MAX_RECORDING_TIME = 20;
  
  const emotionGradients: Record<string, string> = {
    Happy: "from-yellow-300 to-yellow-500",
    Sad: "from-blue-300 to-blue-500",
    Angry: "from-red-300 to-red-500",
    Surprised: "from-purple-300 to-purple-500",
    Neutral: "from-gray-300 to-gray-500",
    Anxious: "from-orange-300 to-orange-500",
    Excited: "from-green-300 to-green-500"
  };

  // Load the audio emotion detection model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsModelLoading(true);
        const model = await loadAudioEmotionDetectionModel();
        setAudioModel(model);
        console.log('Audio emotion detection model loaded successfully');
      } catch (error) {
        console.error('Failed to load audio emotion detection model:', error);
        toast({
          title: 'Error',
          description: 'Failed to load audio analysis model',
          variant: 'destructive'
        });
      } finally {
        setIsModelLoading(false);
      }
    };

    loadModel();
    
    return () => {
      // Clean up on component unmount
      if (timerRef.current) clearInterval(timerRef.current);
      if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
      if (continuousModeRef.current) clearInterval(continuousModeRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [toast]);

  // Handle recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          // Auto-stop recording if it reaches max time
          if (newTime >= MAX_RECORDING_TIME && !continuousMode) {
            handleStopRecording();
            return MAX_RECORDING_TIME;
          }
          return newTime;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRecording, continuousMode]);

  const handleStartRecording = async () => {
    if (!audioModel) {
      toast({
        title: 'Model not ready',
        description: 'Please wait for the audio analysis model to load',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const recording = await startAudioRecording();
      recordingRef.current = recording;
      setIsRecording(true);
      
      // Setup audio analyzer for volume visualization
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      
      const stream = recording.stream;
      const audioContext = audioContextRef.current;
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      // Start monitoring volume levels
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      volumeIntervalRef.current = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
        const volume = Math.min(100, Math.round((average / 256) * 100) * 1.8); // Scale to 0-100
        setRecordingVolume(volume);
      }, 100);
      
      // Continuous mode setup
      if (continuousMode) {
        continuousModeRef.current = setInterval(async () => {
          // Every 5 seconds, process the audio without stopping recording
          if (recordingRef.current && recordingRef.current.mediaRecorder.state === 'recording') {
            // Create a temporary data holder while ongoing recording continues
            const currentData = [...recordingRef.current.audioChunks];
            const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
            const tempAudioBlob = new Blob(currentData, { type: mimeType });
            
            try {
              // Process the current audio snapshot
              setIsProcessing(true);
              const result = await audioModel.analyze(tempAudioBlob);
              setDetectedEmotion(result);
              
              if (onEmotionDetected) {
                onEmotionDetected(result);
              }
              
              // Show a subtle toast for continuous updates
              toast({
                title: 'Voice Analysis Updated',
                description: `Detected emotion: ${result.emotion} (${Math.round(result.confidence * 100)}%)`,
                variant: 'default'
              });
            } catch (error) {
              console.error('Error in continuous processing:', error);
            } finally {
              setIsProcessing(false);
            }
          }
        }, 5000);
      }
      
      toast({
        title: continuousMode ? 'Continuous recording started' : 'Recording started',
        description: continuousMode 
          ? 'Your voice will be analyzed every few seconds' 
          : 'Speak clearly about how you feel today'
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Permission denied',
        description: 'Microphone access is required for voice mood analysis',
        variant: 'destructive'
      });
    }
  };

  const handleStopRecording = async () => {
    if (!recordingRef.current) return;
    
    // Clean up intervals
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }
    
    if (continuousModeRef.current) {
      clearInterval(continuousModeRef.current);
      continuousModeRef.current = null;
    }
    
    try {
      setIsProcessing(true);
      
      const { mediaRecorder, audioChunks, stream } = recordingRef.current;
      const audioBlob = await stopAudioRecording(mediaRecorder, audioChunks, stream);
      
      // Close audio context
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      
      // Process the audio with the model
      const result = await audioModel.analyze(audioBlob);
      
      setDetectedEmotion(result);
      
      if (onEmotionDetected) {
        onEmotionDetected(result);
      }
      
      const confidencePercentage = Math.round(result.confidence * 100);
      toast({
        title: 'Voice Analysis Complete',
        description: `Detected emotion: ${result.emotion} (${confidencePercentage}% confidence)`
      });
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: 'Processing Error',
        description: 'Failed to analyze voice. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsRecording(false);
      setIsProcessing(false);
      recordingRef.current = null;
      setRecordingVolume(0);
    }
  };

  const toggleContinuousMode = () => {
    setContinuousMode(!continuousMode);
    
    // If currently recording and toggling off, stop recording
    if (isRecording && continuousMode && continuousModeRef.current) {
      clearInterval(continuousModeRef.current);
      continuousModeRef.current = null;
    }
  };

  return (
    <Card className="w-full overflow-hidden border-2 border-mindful-soft shadow-lg rounded-xl">
      <CardHeader className="bg-gradient-to-r from-mindful-primary/30 to-mindful-soft pb-2">
        <CardTitle className="text-lg flex items-center">
          <Volume2 className="mr-2 h-5 w-5 text-mindful-primary" />
          Voice Mood Check-in
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto h-7 px-2 text-xs"
            onClick={toggleContinuousMode}
          >
            {continuousMode ? '⚡ Continuous' : '🔄 One-time'}
          </Button>
        </CardTitle>
        <CardDescription>
          Speak naturally about how you're feeling today
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Volume Visualizer */}
        {isRecording && (
          <div className="mb-4">
            <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r from-mindful-primary to-mindful-secondary transition-all duration-100`}
                style={{ width: `${recordingVolume}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Recording: {recordingTime}s</span>
              <span>{!continuousMode && `Max: ${MAX_RECORDING_TIME}s`}</span>
            </div>
            {/* Recording progress */}
            {!continuousMode && (
              <Progress 
                value={(recordingTime / MAX_RECORDING_TIME) * 100} 
                className="h-1 mt-1" 
              />
            )}
          </div>
        )}
        
        <div className="flex flex-col items-center">
          <div className="mb-4">
            {isRecording ? (
              <Button 
                onClick={handleStopRecording} 
                disabled={isProcessing}
                variant="destructive"
                size="lg"
                className={cn(
                  "rounded-full h-16 w-16 p-0 flex items-center justify-center",
                  isProcessing && "opacity-50"
                )}
              >
                <MicOff size={24} />
              </Button>
            ) : (
              <Button 
                onClick={handleStartRecording}
                disabled={isModelLoading || isProcessing}
                size="lg"
                className={cn(
                  "bg-gradient-to-r from-mindful-primary to-mindful-secondary hover:from-mindful-secondary hover:to-mindful-primary rounded-full h-16 w-16 p-0 flex items-center justify-center shadow-lg",
                  (isModelLoading || isProcessing) && "opacity-50"
                )}
              >
                <Mic size={24} />
              </Button>
            )}
          </div>
          
          <div className="text-center">
            {isModelLoading && <p>Loading voice analysis model...</p>}
            {isRecording && <p>Recording... {continuousMode ? 'Analyzing continuously' : 'Click the button to stop and analyze'}</p>}
            {isProcessing && <p>Processing your voice...</p>}
            
            {detectedEmotion && !isRecording && !isProcessing && (
              <div className={cn(
                "p-4 rounded-lg shadow-inner transition-all duration-300",
                `bg-gradient-to-br ${emotionGradients[detectedEmotion.emotion] || 'from-blue-100 to-blue-200'} bg-opacity-20`
              )}>
                <p className="font-medium text-lg">Detected emotion:</p>
                <p className="text-xl font-bold text-mindful-primary mb-1">{detectedEmotion.emotion}</p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-sm text-gray-600 flex items-center">
                    <Info size={14} className="inline mr-1" />
                    Confidence: 
                  </p>
                  <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-mindful-primary to-mindful-secondary"
                      style={{ width: `${Math.round(detectedEmotion.confidence * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(detectedEmotion.confidence * 100)}%
                  </span>
                </div>
                <p className="text-xs mt-3 text-gray-500">
                  Voice analysis uses AI to detect emotions from your speech patterns.
                  Results may vary based on voice clarity and background noise.
                </p>
              </div>
            )}
            
            {!isRecording && !detectedEmotion && !isModelLoading && !isProcessing && (
              <div className="text-sm text-gray-500 max-w-xs mx-auto">
                <p>Click the microphone to start a voice mood check-in</p>
                <p className="mt-1 text-xs">Speak naturally about how you're feeling for best results</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioMoodAnalyzer;
