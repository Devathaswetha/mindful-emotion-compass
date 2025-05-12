
// AI-based recommendation engine for MindfulMe

export interface Recommendation {
  type: 'meditation' | 'resource' | 'journal' | 'activity';
  title: string;
  description: string;
  link?: string;
  duration?: string;
  priority: number; // Higher number = higher priority
}

// This is a mock recommendation engine - in a real app, this would use more sophisticated AI
export const getRecommendationsForMood = (
  mood: string | null, 
  intensity?: number,
  tags?: string[]
): Recommendation[] => {
  if (!mood) return [];
  
  const moodLower = mood.toLowerCase();
  const recommendations: Recommendation[] = [];
  
  // Base recommendations by mood
  if (moodLower.includes('happy') || moodLower.includes('joy')) {
    recommendations.push({
      type: 'meditation',
      title: 'Gratitude Meditation',
      description: 'Enhance your positive mood with a gratitude practice',
      duration: '10 min',
      link: '/meditations?category=focus',
      priority: 5
    });
    recommendations.push({
      type: 'activity',
      title: 'Share your joy',
      description: 'Consider journaling about what made you happy today',
      link: '/journal',
      priority: 4
    });
  }
  
  if (moodLower.includes('sad') || moodLower.includes('down')) {
    recommendations.push({
      type: 'meditation',
      title: 'Comfort Meditation',
      description: 'A gentle practice for difficult emotions',
      duration: '15 min',
      link: '/meditations?category=stress',
      priority: 7
    });
    recommendations.push({
      type: 'resource',
      title: 'Understanding Sadness',
      description: 'Learn about healthy ways to process sadness',
      link: '/resources?tab=articles',
      priority: 6
    });
    recommendations.push({
      type: 'activity',
      title: 'Mood Lifting Activity',
      description: 'Take a short walk or call someone you trust',
      priority: 8
    });
  }
  
  if (moodLower.includes('angry') || moodLower.includes('frustrated')) {
    recommendations.push({
      type: 'meditation',
      title: 'Calming Breath Work',
      description: 'Release tension with breathwork techniques',
      duration: '7 min',
      link: '/meditations?category=stress',
      priority: 8
    });
    recommendations.push({
      type: 'resource',
      title: 'Anger Management Strategies',
      description: 'Practical techniques to manage anger effectively',
      link: '/resources?tab=articles',
      priority: 7
    });
  }
  
  if (moodLower.includes('anxious') || moodLower.includes('stress') || moodLower.includes('worried')) {
    recommendations.push({
      type: 'meditation',
      title: 'Anxiety Relief',
      description: 'Guided visualization to reduce anxiety',
      duration: '12 min',
      link: '/meditations?category=stress',
      priority: 9
    });
    recommendations.push({
      type: 'resource',
      title: 'Understanding Anxiety',
      description: 'Learn about the mechanics of anxiety and how to manage it',
      link: '/resources?tab=articles',
      priority: 7
    });
  }
  
  if (moodLower.includes('neutral') || moodLower.includes('okay')) {
    recommendations.push({
      type: 'meditation',
      title: 'Mindful Awareness',
      description: 'Enhance your present moment awareness',
      duration: '10 min',
      link: '/meditations',
      priority: 5
    });
    recommendations.push({
      type: 'activity',
      title: 'Emotion Check-in',
      description: 'Take a moment to explore your emotions more deeply',
      link: '/mood',
      priority: 4
    });
  }
  
  if (moodLower.includes('tired') || moodLower.includes('exhausted')) {
    recommendations.push({
      type: 'meditation',
      title: 'Restorative Relaxation',
      description: 'A gentle practice to restore your energy',
      duration: '15 min',
      link: '/meditations?category=sleep',
      priority: 7
    });
    recommendations.push({
      type: 'resource',
      title: 'Sleep Improvement Guide',
      description: 'Evidence-based techniques to improve your sleep quality',
      link: '/resources?tab=articles',
      priority: 6
    });
  }
  
  // Process intensity if available
  if (intensity && intensity > 3) {
    // For stronger emotions, add more targeted recommendations
    if (['sad', 'anxious', 'angry'].some(e => moodLower.includes(e))) {
      recommendations.push({
        type: 'resource',
        title: 'Coping with Intense Emotions',
        description: 'Strategies for when emotions feel overwhelming',
        link: '/resources?tab=emergency',
        priority: 10
      });
    }
  }
  
  // Process tags if available
  if (tags && tags.length > 0) {
    if (tags.includes('Work')) {
      recommendations.push({
        type: 'meditation',
        title: 'Work-Life Balance',
        description: 'A short meditation for workplace stress',
        duration: '5 min',
        link: '/meditations?category=focus',
        priority: tags.length > 1 ? 6 : 8
      });
    }
    
    if (tags.includes('Sleep')) {
      recommendations.push({
        type: 'meditation',
        title: 'Deep Sleep Journey',
        description: 'Guided meditation for restful sleep',
        duration: '20 min',
        link: '/meditations?category=sleep',
        priority: tags.length > 1 ? 6 : 8
      });
    }
  }
  
  // Sort by priority (highest first) and return top 3
  return recommendations
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3);
};
