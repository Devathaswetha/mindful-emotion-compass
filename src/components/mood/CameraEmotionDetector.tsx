import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Camera, CameraOff, RefreshCw, Zap } from 'lucide-react';
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
  const [emotionHistory, setEmotionHistory] = useState<{emotion: string, confidence: number}[]>([]);
  
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

  // Effect to calculate the most consistent emotion over time (when in continuous mode)
  useEffect(() => {
    if (emotionHistory.length >= 3) {
      // Count occurrences of each emotion
      const emotionCounts: Record<string, { count: number, totalConfidence: number }> = {};
      
      emotionHistory.forEach(entry => {
        if (!emotionCounts[entry.emotion]) {
          emotionCounts[entry.emotion] = { count: 0, totalConfidence: 0 };
        }
        emotionCounts[entry.emotion].count += 1;
        emotionCounts[entry.emotion].totalConfidence += entry.confidence;
      });
      
      // Find the most frequent emotion
      let mostFrequentEmotion = '';
      let highestCount = 0;
      let highestAvgConfidence = 0;
      
      Object.entries(emotionCounts).forEach(([emotion, data]) => {
        const avgConfidence = data.totalConfidence / data.count;
        
        // Prioritize by count, then by average confidence
        if (data.count > highestCount || 
            (data.count === highestCount && avgConfidence > highestAvgConfidence)) {
          mostFrequentEmotion = emotion;
          highestCount = data.count;
          highestAvgConfidence = avgConfidence;
        }
      });
      
      // If we have a stable emotion detected over time, inform parent component
      if (mostFrequentEmotion && highestCount >= 2) { // At least 2 occurrences
        onEmotionDetected(mostFrequentEmotion, highestAvgConfidence);
      }
    }
  }, [emotionHistory, onEmotionDetected]);
  
  // Effect to draw bounding box when available
  useEffect(() => {
    if (boundingBox && canvasRef.current && webcamRef.current && webcamRef.current.video) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Clear previous drawings
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw bounding box with gradient
        const gradient = context.createLinearGradient(
          boundingBox.x, 
          boundingBox.y, 
          boundingBox.x + boundingBox.width, 
          boundingBox.y + boundingBox.height
        );
        gradient.addColorStop(0, '#9b87f5'); // mindful-primary
        gradient.addColorStop(1, '#7E69AB'); // mindful-secondary
        
        context.strokeStyle = gradient;
        context.lineWidth = 3;
        context.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
        
        // Add emotion label if detected
        if (detectedEmotion) {
          // Create gradient background for the label
          const labelGradient = context.createLinearGradient(
            boundingBox.x, 
            boundingBox.y - 30, 
            boundingBox.x + 120, 
            boundingBox.y
          );
          labelGradient.addColorStop(0, '#9b87f5');
          labelGradient.addColorStop(1, '#7E69AB');
          
          context.fillStyle = labelGradient;
          context.fillRect(boundingBox.x, boundingBox.y - 30, 120, 30);
          context.fillStyle = 'white';
          context.font = '16px sans-serif';
          context.fillText(`${detectedEmotion} (${Math.round(confidenceScore * 100)}%)`, boundingBox.x + 5, boundingBox.y - 10);
          
          // Add emotion indicator dots
          const emotionColors: Record<string, string> = {
            'Happy': '#FFD700',
            'Sad': '#6495ED',
            'Angry': '#FF4500',
            'Surprised': '#9370DB',
            'Neutral': '#A9A9A9',
            'Anxious': '#FFA500',
            'Excited': '#32CD32'
          };
          
          context.beginPath();
          context.arc(
            boundingBox.x + boundingBox.width - 15, 
            boundingBox.y - 15, 
            8, 
            0, 
            2 * Math.PI
          );
          context.fillStyle = emotionColors[detectedEmotion] || '#FFFFFF';
          context.fill();
          context.strokeStyle = 'white';
          context.lineWidth = 1;
          context.stroke();
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
          
          // Add to emotion history for continuous mode
          if (continuousMode) {
            setEmotionHistory(prev => {
              // Keep only the last 5 detections
              const updated = [...prev, { emotion: result.emotion, confidence: result.confidence }]
                .slice(-5);
              return updated;
            });
          } else {
            // Inform parent component immediately for single captures
            onEmotionDetected(result.emotion, result.confidence);
          }
          
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
    
    // Reset emotion history when toggling modes
    setEmotionHistory([]);
    
    toast({
      title: !continuousMode ? "Continuous Mode Activated" : "Continuous Mode Deactivated",
      description: !continuousMode 
        ? "Your expressions will be continuously analyzed" 
        : "Switched to manual detection mode"
    });
  };

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-3">Facial Emotion Detection</h3>
      
      <div className="flex flex-col items-center">
        {!showCamera ? (
          <Button 
            onClick={handleCameraToggle} 
            className="bg-gradient-to-r from-mindful-primary to-mindful-secondary hover:from-mindful-secondary hover:to-mindful-primary flex gap-2 items-center"
          >
            <Camera size={18} />
            Enable Camera Check-in
          </Button>
        ) : (
          <div className="space-y-4 w-full">
            <div className="relative max-w-md mx-auto">
              {/* Aspect ratio container to prevent layout shift */}
              <AspectRatio ratio={4/3} className="bg-gray-100 rounded-lg overflow-hidden border-2 border-mindful-soft">
                {/* Webcam component */}
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full h-full object-cover"
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
              </AspectRatio>
              
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              )}
              
              {/* Face detection indicator */}
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                faceDetected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {faceDetected ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    Face Detected
                  </>
                ) : (
                  <>
                    <CameraOff className="w-3 h-3" />
                    No Face
                  </>
                )}
              </div>
              
              {/* Continuous mode indicator */}
              {continuousMode && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-mindful-primary text-white rounded-full text-xs font-medium flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
                  Live Analysis
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              <Button 
                onClick={() => handleCapture()} 
                disabled={isLoading || continuousMode}
                className="bg-mindful-primary hover:bg-mindful-secondary flex items-center gap-1"
              >
                <Camera size={16} />
                {isLoading ? "Detecting..." : "Detect Emotion"}
              </Button>
              
              <Button 
                onClick={toggleContinuousMode}
                variant={continuousMode ? "default" : "outline"}
                className={continuousMode ? "bg-green-600 hover:bg-green-700 flex items-center gap-1" : "flex items-center gap-1"}
              >
                {continuousMode ? <RefreshCw size={16} /> : <Zap size={16} />}
                {continuousMode ? "Continuous: ON" : "Continuous: OFF"}
              </Button>
              
              <Button 
                onClick={handleCameraToggle} 
                variant="outline"
                className="flex items-center gap-1"
              >
                <CameraOff size={16} />
                Close Camera
              </Button>
            </div>
            
            {detectedEmotion && (
              <div className="mt-4 p-4 bg-gradient-to-br from-mindful-soft/30 to-white rounded-lg text-center border border-mindful-soft/20 shadow-md">
                <p className="text-lg font-medium text-gray-700">Suggested emotion:</p>
                <p className="text-2xl text-mindful-primary font-bold">{detectedEmotion}</p>
                <div className="mt-2 mx-auto w-64 bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-gradient-to-r from-mindful-primary to-mindful-secondary h-2.5 rounded-full"
                    style={{ width: `${Math.round(confidenceScore * 100)}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Confidence: {Math.round(confidenceScore * 100)}%
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Is this correct? You can adjust your selection below.
                </p>
                <Button
                  className="mt-3 bg-mindful-primary hover:bg-mindful-secondary"
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
