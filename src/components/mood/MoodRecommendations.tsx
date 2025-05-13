
import { Card, CardContent } from "@/components/ui/card";
import { getRecommendationsForMood, Recommendation } from "@/lib/recommendations";
import { Link } from "react-router-dom";

interface MoodRecommendationsProps {
  mood: string;
  intensity?: number;
  tags?: string[];
}

const MoodRecommendations = ({ mood, intensity, tags }: MoodRecommendationsProps) => {
  const recommendations = getRecommendationsForMood(mood, intensity, tags);

  if (!recommendations.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recommended for You</h3>
      <div className="grid gap-2">
        {recommendations.map((rec, idx) => (
          <div 
            key={idx}
            className="rounded-md bg-mindful-soft dark:bg-opacity-10 p-4 hover:bg-opacity-70 transition-colors"
          >
            {rec.link ? (
              <Link to={rec.link}>
                <h4 className="font-medium text-mindful-primary dark:text-mindful-light">{rec.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{rec.description}</p>
                {rec.duration && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{rec.duration}</p>
                )}
              </Link>
            ) : (
              <>
                <h4 className="font-medium text-mindful-primary dark:text-mindful-light">{rec.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{rec.description}</p>
                {rec.duration && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{rec.duration}</p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodRecommendations;
