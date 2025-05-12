
import { Button } from '@/components/ui/button';

interface MoodSelectorProps {
  emotions: string[];
  selectedMood: string | null;
  onMoodSelect: (mood: string) => void;
}

const MoodSelector = ({ emotions, selectedMood, onMoodSelect }: MoodSelectorProps) => {
  const emojis = ["😊", "😢", "😠", "😮", "😐"];
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Your Mood</h3>
      
      <div className="grid grid-cols-5 gap-2">
        {emojis.map((emoji, index) => (
          <button
            key={emoji}
            className={`p-3 rounded-lg text-3xl transition-all ${
              selectedMood === emotions[index]
                ? "bg-mindful-soft ring-2 ring-mindful-primary"
                : "bg-white hover:bg-gray-100"
            }`}
            onClick={() => onMoodSelect(emotions[index])}
          >
            {emoji}
            <div className="text-xs mt-1">{emotions[index]}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
