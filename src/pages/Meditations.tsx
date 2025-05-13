
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Meditation {
  id: number;
  title: string;
  description: string;
  duration: string;
  category: string;
  image: string;
  audioUrl: string;
  technique?: string;
  videoUrl?: string;
  gifUrl?: string;
}

const Meditations = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'all');
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  // Update active category when URL parameter changes
  useEffect(() => {
    if (categoryParam && categories.some(cat => cat.id === categoryParam)) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'stress', name: 'Stress Relief' },
    { id: 'sleep', name: 'Sleep' },
    { id: 'focus', name: 'Focus' }
  ];

  const meditations: Meditation[] = [
    {
      id: 1,
      title: 'Morning Mindfulness',
      description: 'Start your day with calm and intention',
      duration: '5 min',
      category: 'beginner',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      audioUrl: 'https://example.com/meditations/morning-mindfulness.mp3',
      technique: 'Sit comfortably with your back straight and eyes closed. Focus on your breath, noticing the sensation of air flowing in and out of your body. When your mind wanders, gently bring your attention back to your breath.',
      gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDU1cnpmdm1wYzU5emt4YjF0ZWx4dWZjbDM1N2NxZzAzbXB1MnI2dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKz2eMXx7dn95FS/giphy.gif'
    },
    {
      id: 2,
      title: 'Stress Relief Breathing',
      description: 'Combat stress with deep breathing techniques',
      duration: '10 min',
      category: 'stress',
      image: 'https://images.unsplash.com/photo-1474418397713-2f1091382ad6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YnJlYXRoaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      audioUrl: 'https://example.com/meditations/stress-relief.mp3',
      technique: 'Inhale deeply through your nose for a count of 4, hold your breath for a count of 7, then exhale completely through your mouth for a count of 8. Repeat this 4-7-8 breathing pattern several times.',
      gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnQ0aXJyZ3R2Y2FxZ2FrZ3VoNzM3NnRrbHkwbm5nNWc5c2N0NnprdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/krP2NRkLqnKEg/giphy.gif',
      videoUrl: 'https://www.youtube.com/embed/tEmt1Znux58'
    },
    {
      id: 3,
      title: 'Deep Sleep Journey',
      description: 'Guided visualization for restful sleep',
      duration: '15 min',
      category: 'sleep',
      image: 'https://images.unsplash.com/photo-1455642305367-68834a9d4373?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2xlZXB8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      audioUrl: 'https://example.com/meditations/deep-sleep.mp3',
      technique: 'Lie down comfortably and progressively relax each part of your body from toes to head. Visualize yourself in a peaceful place, like a beach or forest, focusing on the sensory details.',
      gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzRjdHN3NXd2eXVseWl6dmEydTRmZ2gwbDlzaGI2dXQ5YW5rMHdyZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l378rn9RUFIJxRPuo/giphy.gif'
    },
    {
      id: 4,
      title: 'Focus Meditation',
      description: 'Improve concentration and mental clarity',
      duration: '10 min',
      category: 'focus',
      image: 'https://images.unsplash.com/photo-1522163723043-478ef79a5bb4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZvY3VzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      audioUrl: 'https://example.com/meditations/focus.mp3',
      technique: 'Choose a single object of focus like a candle flame or a simple visual pattern. Gaze softly at it, allowing your attention to remain centered on the object. When distractions arise, gently redirect your focus.',
      videoUrl: 'https://www.youtube.com/embed/ez3GgRqhNvA'
    },
    {
      id: 5,
      title: 'Body Scan Relaxation',
      description: 'Release tension throughout your body',
      duration: '12 min',
      category: 'stress',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      audioUrl: 'https://example.com/meditations/body-scan.mp3',
      technique: 'Lie down comfortably and bring attention to each part of your body, starting from your toes and moving upward. Notice any tension and consciously release it as you exhale.',
      gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2IyNWlsMTNqYjFmaXhrMWx0amhheXptZ2pmMmFpeDUwcnRzMTl6MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ybG5Au7UzdpAY/giphy.gif'
    }
  ];

  const filteredMeditations = activeCategory === 'all'
    ? meditations
    : meditations.filter(item => item.category === activeCategory);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setSearchParams(categoryId === 'all' ? {} : { category: categoryId });
  };

  const handleStartMeditation = (meditation: Meditation) => {
    toast({
      title: "Starting meditation",
      description: `${meditation.title} - ${meditation.duration}`,
    });
    
    setSelectedMeditation(meditation);
    setShowTutorial(true);
    
    // In a real app, this would launch the audio player with the meditation content
    console.log(`Playing meditation: ${meditation.audioUrl}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-mindful-dark">Meditations</h1>
        <p className="text-gray-500">Guided practices for your well-being</p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeCategory === category.id 
                ? 'bg-mindful-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Meditation Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMeditations.map(meditation => (
          <Card key={meditation.id} className="overflow-hidden">
            <div className="h-48 w-full overflow-hidden">
              <img 
                src={meditation.image} 
                alt={meditation.title} 
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{meditation.title}</CardTitle>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {meditation.duration}
                </span>
              </div>
              <CardDescription>{meditation.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-mindful-primary hover:bg-mindful-secondary"
                onClick={() => handleStartMeditation(meditation)}
              >
                Start Meditation
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMeditations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No meditations found in this category.</p>
        </div>
      )}

      {/* Meditation Tutorial Dialog */}
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="max-w-3xl">
          {selectedMeditation && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedMeditation.title} - Technique</DialogTitle>
                <DialogDescription className="text-gray-500">
                  {selectedMeditation.duration} guided practice
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="text-sm text-gray-600">
                  <p className="mb-4">{selectedMeditation.technique}</p>
                </div>
                
                {/* Show GIF or video demonstration */}
                {selectedMeditation.gifUrl && (
                  <div className="flex justify-center">
                    <img 
                      src={selectedMeditation.gifUrl} 
                      alt={`${selectedMeditation.title} technique`}
                      className="rounded-lg max-h-64"
                    />
                  </div>
                )}
                
                {selectedMeditation.videoUrl && (
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={selectedMeditation.videoUrl}
                      title={`${selectedMeditation.title} tutorial`}
                      className="w-full h-64 rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={() => setShowTutorial(false)} variant="outline">
                    Close
                  </Button>
                  <Button className="bg-mindful-primary hover:bg-mindful-secondary">
                    Start Audio Guide
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Meditations;
