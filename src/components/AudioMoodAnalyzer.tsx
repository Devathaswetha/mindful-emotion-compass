
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
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
  
  const recordingRef = useRef<{
    mediaRecorder: MediaRecorder;
    audioChunks: Blob[];
    stream: MediaStream;
  } | null>(null);
  
  const { toast } = useToast();

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
  }, [toast]);

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
      
      toast({
        title: 'Recording started',
        description: 'Speak clearly about how you feel today'
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
    
    try {
      setIsProcessing(true);
      
      const { mediaRecorder, audioChunks, stream } = recordingRef.current;
      const audioBlob = await stopAudioRecording(mediaRecorder, audioChunks, stream);
      
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
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Voice Mood Check-in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center mb-4">
          {isRecording ? (
            <Button 
              onClick={handleStopRecording} 
              disabled={isProcessing}
              variant="destructive"
              size="lg"
              className="rounded-full h-16 w-16 p-0 flex items-center justify-center"
            >
              <MicOff size={24} />
            </Button>
          ) : (
            <Button 
              onClick={handleStartRecording}
              disabled={isModelLoading || isProcessing}
              size="lg"
              className="bg-mindful-primary hover:bg-mindful-secondary rounded-full h-16 w-16 p-0 flex items-center justify-center"
            >
              <Mic size={24} />
            </Button>
          )}
        </div>
        
        <div className="text-center">
          {isModelLoading && <p>Loading voice analysis model...</p>}
          {isRecording && <p>Recording... Click the button to stop and analyze</p>}
          {isProcessing && <p>Processing your voice...</p>}
          
          {detectedEmotion && !isRecording && !isProcessing && (
            <div className="p-3 bg-mindful-soft rounded-md">
              <p className="font-medium">Detected emotion: <span className="text-mindful-primary">{detectedEmotion.emotion}</span></p>
              <p className="text-sm text-gray-500">
                Confidence: {Math.round(detectedEmotion.confidence * 100)}%
              </p>
              <p className="text-xs mt-2">
                Voice analysis is experimental and may not always be accurate. 
                Does this match how you're feeling?
              </p>
            </div>
          )}
          
          {!isRecording && !detectedEmotion && !isModelLoading && !isProcessing && (
            <p className="text-sm text-gray-500">
              Click the microphone to start a voice mood check-in
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioMoodAnalyzer;
