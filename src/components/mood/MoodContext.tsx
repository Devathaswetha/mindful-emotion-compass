
import { Button } from '@/components/ui/button';

interface MoodContextProps {
  moodIntensity: number;
  setMoodIntensity: (intensity: number) => void;
  moodTags: string[];
  toggleTag: (tag: string) => void;
  availableTags: string[];
  moodContext: string;
  setMoodContext: (context: string) => void;
}

const MoodContext = ({
  moodIntensity,
  setMoodIntensity,
  moodTags,
  toggleTag,
  availableTags,
  moodContext,
  setMoodContext
}: MoodContextProps) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default MoodContext;
