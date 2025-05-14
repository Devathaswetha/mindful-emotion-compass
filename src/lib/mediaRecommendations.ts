import { MediaRecommendation } from './utils';

export const emotionBasedMedia: MediaRecommendation[] = [
  // Books
  {
    title: "The Book of Joy",
    author: "Dalai Lama and Desmond Tutu",
    description: "Lasting happiness in a changing world",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2487&auto=format&fit=crop",
    link: "https://www.goodreads.com/book/show/29496453-the-book-of-joy",
    type: "book",
    tags: ["mindfulness", "positive psychology"],
    emotion: ["Sad", "Anxious", "Neutral"]
  },
  {
    title: "Emotional Intelligence",
    author: "Daniel Goleman",
    description: "Why it can matter more than IQ",
    imageUrl: "https://images.unsplash.com/photo-1515040242872-701d3c723447?q=80&w=2088&auto=format&fit=crop",
    link: "https://www.goodreads.com/book/show/26329.Emotional_Intelligence",
    type: "book",
    tags: ["psychology", "self-improvement"],
    emotion: ["Neutral", "Anxious", "Angry"]
  },
  {
    title: "When Things Fall Apart",
    author: "Pema Chödrön",
    description: "Heart advice for difficult times",
    imageUrl: "https://images.unsplash.com/photo-1472905981516-5ac09f35b7f4?q=80&w=2274&auto=format&fit=crop",
    link: "https://www.goodreads.com/book/show/687278.When_Things_Fall_Apart",
    type: "book",
    tags: ["buddhism", "mindfulness"],
    emotion: ["Sad", "Anxious"]
  },
  {
    title: "Flow",
    author: "Mihaly Csikszentmihalyi",
    description: "The psychology of optimal experience",
    imageUrl: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=2487&auto=format&fit=crop",
    link: "https://www.goodreads.com/book/show/66354.Flow",
    type: "book",
    tags: ["psychology", "happiness"],
    emotion: ["Happy", "Excited", "Neutral"]
  },
  
  // Videos
  {
    title: "How to Make Stress Your Friend",
    author: "Kelly McGonigal",
    description: "Psychologist Kelly McGonigal urges us to see stress as a positive.",
    imageUrl: "https://img.youtube.com/vi/RcGyVTAoXEU/maxresdefault.jpg",
    link: "https://www.youtube.com/watch?v=RcGyVTAoXEU",
    type: "video",
    tags: ["stress management", "ted talk"],
    emotion: ["Anxious", "Stressed"]
  },
  {
    title: "The Power of Vulnerability",
    author: "Brené Brown",
    description: "Brené Brown studies human connection -- our ability to empathize, belong, love.",
    imageUrl: "https://img.youtube.com/vi/iCvmsMzlF7o/maxresdefault.jpg",
    link: "https://www.youtube.com/watch?v=iCvmsMzlF7o",
    type: "video",
    tags: ["vulnerability", "ted talk"],
    emotion: ["Sad", "Anxious", "Neutral"]
  },
  {
    title: "Inside Out: Emotional Theory Comes Alive",
    author: "Pixar",
    description: "How Pixar's Inside Out helps understand emotions and emotional intelligence",
    imageUrl: "https://img.youtube.com/vi/yRUAzGQ3nSY/maxresdefault.jpg",
    link: "https://www.youtube.com/watch?v=yRUAzGQ3nSY",
    type: "video",
    tags: ["emotions", "animation"],
    emotion: ["Happy", "Sad", "Angry", "Neutral"]
  },
  
  // Games
  {
    title: "Emotion Quest",
    description: "An interactive game that helps identify and manage different emotions",
    imageUrl: "https://images.unsplash.com/photo-1585504198199-20277593b94f?q=80&w=2487&auto=format&fit=crop",
    link: "https://www.emotionquest.com",
    type: "game",
    tags: ["interactive", "educational"],
    emotion: ["Happy", "Sad", "Angry", "Surprised", "Anxious"]
  },
  {
    title: "Calm Cards",
    description: "A deck of digital cards with mindfulness exercises for different emotions",
    imageUrl: "https://images.unsplash.com/photo-1611532736637-13a8bdf96725?q=80&w=2487&auto=format&fit=crop",
    link: "https://www.calmcards.app",
    type: "game",
    tags: ["mindfulness", "exercises"],
    emotion: ["Anxious", "Angry"]
  },
  {
    title: "Mood Journal Adventure",
    description: "A gamified journaling experience that helps process emotions",
    imageUrl: "https://images.unsplash.com/photo-1606041011872-596597976b25?q=80&w=2574&auto=format&fit=crop",
    link: "https://www.moodjournaladventure.com",
    type: "game",
    tags: ["journaling", "gamified"],
    emotion: ["Sad", "Happy", "Neutral", "Anxious"]
  }
];

export const getRecommendationsForEmotion = (emotion: string | null, limit = 3): MediaRecommendation[] => {
  if (!emotion) return emotionBasedMedia.slice(0, limit);
  
  const matchingRecommendations = emotionBasedMedia.filter(item => 
    item.emotion.some(e => e.toLowerCase() === emotion.toLowerCase())
  );
  
  // If we have enough matching recommendations, return those
  if (matchingRecommendations.length >= limit) {
    // Shuffle array to get random recommendations
    return [...matchingRecommendations]
      .sort(() => 0.5 - Math.random())
      .slice(0, limit);
  }
  
  // Otherwise, add some generic recommendations
  const remainingCount = limit - matchingRecommendations.length;
  const genericRecommendations = emotionBasedMedia
    .filter(item => !matchingRecommendations.includes(item))
    .sort(() => 0.5 - Math.random())
    .slice(0, remainingCount);
  
  return [...matchingRecommendations, ...genericRecommendations];
};
