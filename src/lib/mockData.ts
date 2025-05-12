
export interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  intensity: number;
  aiDetectedEmotion?: string;
  tags: string[];
  notes?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
}

export interface Meditation {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  imageUrl: string;
}

// Generate mock mood data for the past 30 days
export const generateMockMoodData = (): MoodEntry[] => {
  const moods = ['Happy', 'Sad', 'Angry', 'Anxious', 'Calm', 'Energetic', 'Tired'];
  const tags = ['Work', 'Family', 'Friends', 'Exercise', 'Sleep', 'Food', 'Weather', 'Health'];
  
  const entries: MoodEntry[] = [];
  
  // Generate an entry for each of the past 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Skip some days randomly
    if (Math.random() > 0.8 && i > 0) continue;
    
    // Random mood
    const mood = moods[Math.floor(Math.random() * moods.length)];
    
    // Random intensity (1-5)
    const intensity = Math.floor(Math.random() * 5) + 1;
    
    // Random tags (0-3)
    const numTags = Math.floor(Math.random() * 4);
    const entryTags: string[] = [];
    for (let j = 0; j < numTags; j++) {
      const tag = tags[Math.floor(Math.random() * tags.length)];
      if (!entryTags.includes(tag)) {
        entryTags.push(tag);
      }
    }
    
    // Random AI detected emotion (sometimes different from reported mood)
    const aiDetectedEmotion = Math.random() > 0.7 
      ? moods[Math.floor(Math.random() * moods.length)]
      : mood;
    
    entries.push({
      id: `mood-${date.toISOString()}`,
      date: date.toISOString().split('T')[0],
      mood,
      intensity,
      aiDetectedEmotion,
      tags: entryTags,
      notes: Math.random() > 0.7 ? `Note for ${date.toISOString().split('T')[0]}` : undefined
    });
  }
  
  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate mock journal entries
export const generateMockJournalEntries = (): JournalEntry[] => {
  const entries: JournalEntry[] = [
    {
      id: 'journal-1',
      date: '2023-05-10',
      title: 'A day of reflection',
      content: 'Today I took some time to reflect on my recent progress. I feel like I\'ve been making good strides in my personal development.',
      sentiment: 'Positive'
    },
    {
      id: 'journal-2',
      date: '2023-05-08',
      title: 'Feeling overwhelmed',
      content: 'There has been a lot on my plate recently. Work deadlines are piling up and I\'m not sleeping well.',
      sentiment: 'Negative'
    },
    {
      id: 'journal-3',
      date: '2023-05-05',
      title: 'Mixed day',
      content: 'Started the day feeling anxious about my presentation, but it went better than expected. Had dinner with friends afterward which was nice.',
      sentiment: 'Neutral'
    }
  ];
  
  return entries;
};
