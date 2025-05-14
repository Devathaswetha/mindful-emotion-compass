
import { Card, CardContent } from "@/components/ui/card";
import { MediaRecommendation } from "@/lib/utils";
import { BadgeCheck, Book, Film, Gamepad } from "lucide-react";
import { Button } from "./ui/button";

interface EmotionMediaCardProps {
  media: MediaRecommendation;
}

const EmotionMediaCard = ({ media }: EmotionMediaCardProps) => {
  const handleOpenLink = () => {
    if (media.link) {
      window.open(media.link, '_blank', 'noopener,noreferrer');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'book':
        return <Book className="h-5 w-5 text-mindful-primary" />;
      case 'video':
        return <Film className="h-5 w-5 text-mindful-secondary" />;
      case 'game':
        return <Gamepad className="h-5 w-5 text-mindful-tertiary" />;
      default:
        return <BadgeCheck className="h-5 w-5" />;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-mindful-soft">
      <div className="bg-gradient-to-r from-mindful-soft to-white py-2 px-3 flex items-center gap-2">
        {getIcon(media.type)}
        <span className="font-medium text-sm capitalize">{media.type} Recommendation</span>
      </div>
      
      <CardContent className="p-3 space-y-2">
        <div className="flex gap-3">
          {media.imageUrl && (
            <div className="h-16 w-16 overflow-hidden rounded flex-shrink-0">
              <img 
                src={media.imageUrl} 
                alt={media.title} 
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h4 className="font-medium text-sm">{media.title}</h4>
            {media.author && (
              <p className="text-xs text-gray-500">by {media.author}</p>
            )}
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{media.description}</p>
          </div>
        </div>
        {media.link && (
          <Button 
            onClick={handleOpenLink} 
            className="w-full h-8 mt-2 text-xs bg-gradient-to-r from-mindful-primary to-mindful-secondary text-white"
          >
            Open {media.type === 'book' ? 'Book Info' : media.type === 'video' ? 'Video' : 'Game'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionMediaCard;
