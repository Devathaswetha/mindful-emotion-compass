
import { Button } from '@/components/ui/button';
import AudioMoodAnalyzer from '@/components/AudioMoodAnalyzer';
import { AudioEmotionDetectionResult } from '@/lib/audioEmotionDetection';

interface AudioEmotionTabProps {
  audioEmotion: string | null;
  onEmotionDetected: (result: AudioEmotionDetectionResult) => void;
  onUseEmotion: (emotion: string) => void;
}

const AudioEmotionTab = ({
  audioEmotion,
  onEmotionDetected,
  onUseEmotion,
}: AudioEmotionTabProps) => {
  return (
    <div className="space-y-4">
      <AudioMoodAnalyzer onEmotionDetected={onEmotionDetected} />
      
      {audioEmotion && (
        <div className="mt-2 text-center">
          <Button
            className="bg-mindful-primary hover:bg-mindful-secondary"
            onClick={() => onUseEmotion(audioEmotion)}
          >
            Use Voice Analysis Result
          </Button>
        </div>
      )}
    </div>
  );
};

export default AudioEmotionTab;
