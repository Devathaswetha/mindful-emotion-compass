
import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  getImageDataFromVideo, 
  processImageForEmotionDetection
} from '@/lib/emotionDetection';

interface CameraEmotionDetectorProps {
  emotionModel: any;
  onEmotionDetected: (emotion: string) => void;
  onUseEmotion: (emotion: string) => void;
}

const CameraEmotionDetector = ({ 
  emotionModel, 
  onEmotionDetected, 
  onUseEmotion 
}: CameraEmotionDetectorProps) => {
  const [showCamera, setShowCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  
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
          onEmotionDetected(result.emotion);
          
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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Emotion Detection</h3>
      
      <div className="flex flex-col items-center">
        {!showCamera ? (
          <Button 
            onClick={handleCameraToggle} 
            className="bg-mindful-primary hover:bg-mindful-secondary"
          >
            Enable Camera Check-in
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
                disabled={isLoading}
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
                <Button
                  className="mt-2 bg-mindful-primary hover:bg-mindful-secondary"
                  onClick={() => onUseEmotion(detectedEmotion)}
                >
                  Use This Emotion
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraEmotionDetector;
