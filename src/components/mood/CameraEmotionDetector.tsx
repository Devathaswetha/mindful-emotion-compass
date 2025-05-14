
import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  getImageDataFromVideo, 
  processImageForEmotionDetection
} from '@/lib/emotionDetection';

interface CameraEmotionDetectorProps {
  emotionModel: any;
  onEmotionDetected: (emotion: string, confidence: number) => void;
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
  const [confidenceScore, setConfidenceScore] = useState<number>(0);
  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const [boundingBox, setBoundingBox] = useState<{x: number, y: number, width: number, height: number} | null>(null);
  const [continuousMode, setContinuousMode] = useState<boolean>(false);
  const [detectionInterval, setDetectionInterval] = useState<NodeJS.Timeout | null>(null);
  
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Effect to handle continuous detection mode
  useEffect(() => {
    if (continuousMode && showCamera && emotionModel) {
      // Start continuous detection
      const interval = setInterval(async () => {
        await handleCapture(true);
      }, 2000); // Detect every 2 seconds
      
      setDetectionInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    } else {
      // Clean up interval if continuous mode is turned off
      if (detectionInterval) {
        clearInterval(detectionInterval);
        setDetectionInterval(null);
      }
    }
  }, [continuousMode, showCamera, emotionModel]);
  
  // Effect to draw bounding box when available
  useEffect(() => {
    if (boundingBox && canvasRef.current && webcamRef.current && webcamRef.current.video) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Clear previous drawings
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw bounding box
        context.strokeStyle = '#9b87f5'; // mindful-primary color
        context.lineWidth = 3;
        context.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
        
        // Add emotion label if detected
        if (detectedEmotion) {
          context.fillStyle = '#9b87f5';
          context.fillRect(boundingBox.x, boundingBox.y - 30, 120, 30);
          context.fillStyle = 'white';
          context.font = '16px sans-serif';
          context.fillText(`${detectedEmotion} (${Math.round(confidenceScore * 100)}%)`, boundingBox.x + 5, boundingBox.y - 10);
        }
      }
    } else if (canvasRef.current) {
      // Clear canvas if no bounding box
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [boundingBox, detectedEmotion, confidenceScore]);
  
  const handleCameraToggle = () => {
    if (!showCamera) {
      setShowCamera(true);
      // Reset detection state
      setDetectedEmotion(null);
      setBoundingBox(null);
      setFaceDetected(false);
    } else {
      setShowCamera(false);
      setContinuousMode(false);
      if (detectionInterval) {
        clearInterval(detectionInterval);
        setDetectionInterval(null);
      }
    }
  };

  const handleCapture = async (silent = false) => {
    if (!webcamRef.current || !webcamRef.current.video || !emotionModel) return;
    
    if (!silent) setIsLoading(true);
    
    try {
      // Get image data from webcam
      const imageData = getImageDataFromVideo(webcamRef.current.video);
      
      if (imageData) {
        // Process image with model
        const result = await processImageForEmotionDetection(imageData, emotionModel);
        
        if (result) {
          setDetectedEmotion(result.emotion);
          setConfidenceScore(result.confidence);
          
          // Set bounding box if available for visualization
          if (result.boundingBox) {
            setBoundingBox(result.boundingBox);
            setFaceDetected(true);
          } else {
            setBoundingBox(null);
            setFaceDetected(false);
          }
          
          // Inform parent component
          onEmotionDetected(result.emotion, result.confidence);
          
          // Show toast with detected emotion (only if not in silent/continuous mode)
          if (!silent) {
            const confidencePercentage = Math.round(result.confidence * 100);
            toast({
              title: "Emotion Detected",
              description: `${result.emotion} (${confidencePercentage}% confidence)`
            });
          }
          
          return true;
        } else {
          setBoundingBox(null);
          setFaceDetected(false);
          
          if (!silent) {
            toast({
              title: "Detection Issue",
              description: "Could not detect emotions clearly. Please try again with better lighting.",
              variant: "destructive"
            });
          }
          
          return false;
        }
      }
    } catch (error) {
      console.error('Error capturing emotion:', error);
      
      if (!silent) {
        toast({
          title: "Detection Failed",
          description: "Unable to detect emotions. Please try again.",
          variant: "destructive"
        });
      }
      
      return false;
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const toggleContinuousMode = () => {
    setContinuousMode(prev => !prev);
  };

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
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
              {/* Webcam component */}
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full rounded-lg border border-gray-300"
                onUserMedia={() => {
                  // Initialize canvas size once webcam loads
                  if (canvasRef.current && webcamRef.current && webcamRef.current.video) {
                    canvasRef.current.width = webcamRef.current.video.videoWidth;
                    canvasRef.current.height = webcamRef.current.video.videoHeight;
                  }
                }}
              />
              
              {/* Overlay canvas for face detection visualization */}
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />
              
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              )}
              
              {/* Face detection indicator */}
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${faceDetected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {faceDetected ? 'Face Detected' : 'No Face Detected'}
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              <Button 
                onClick={() => handleCapture()} 
                disabled={isLoading}
                className="bg-mindful-primary hover:bg-mindful-secondary"
              >
                {isLoading ? "Detecting..." : "Detect Emotion"}
              </Button>
              
              <Button 
                onClick={toggleContinuousMode}
                variant={continuousMode ? "default" : "outline"}
                className={continuousMode ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {continuousMode ? "Continuous: ON" : "Continuous: OFF"}
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
                <p className="mt-1 text-sm text-gray-500">
                  Confidence: {Math.round(confidenceScore * 100)}%
                </p>
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
