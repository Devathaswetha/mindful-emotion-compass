
// This is an enhanced sentiment analysis service
// In a real app, this would connect to a backend API that uses NLP models

export interface SentimentAnalysisResult {
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  confidence: number;
  keywords: string[];
}

export const analyzeSentiment = async (text: string): Promise<SentimentAnalysisResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Enhanced implementation that checks for positive/negative words
  const positiveWords = [
    'happy', 'good', 'great', 'excellent', 'wonderful', 'joy', 'love', 'like',
    'amazing', 'fantastic', 'awesome', 'pleased', 'grateful', 'thankful', 'blessed',
    'excited', 'thrilled', 'delighted', 'cheerful', 'content', 'satisfied', 'proud',
    'enthusiastic', 'optimistic', 'hopeful', 'peaceful', 'calm', 'relaxed'
  ];
  
  const negativeWords = [
    'sad', 'bad', 'awful', 'terrible', 'angry', 'upset', 'hate', 'dislike',
    'depressed', 'miserable', 'unhappy', 'disappointed', 'frustrated', 'annoyed',
    'irritated', 'anxious', 'worried', 'stressed', 'scared', 'afraid', 'fearful',
    'lonely', 'hurt', 'pain', 'suffering', 'grief', 'regret', 'guilty', 'ashamed'
  ];

  // Neutral modifiers reduce the sentiment strength
  const neutralModifiers = [
    'somewhat', 'kind of', 'a bit', 'slightly', 'a little', 
    'not very', 'not really', 'sort of', 'maybe'
  ];
  
  // Intensity modifiers increase the sentiment strength
  const intensityModifiers = [
    'very', 'really', 'extremely', 'absolutely', 'completely',
    'totally', 'utterly', 'incredibly', 'immensely', 'deeply'
  ];
  
  // Negations flip the sentiment
  const negations = [
    'not', 'never', 'no', 'don\'t', 'doesn\'t', 'didn\'t', 'can\'t', 
    'couldn\'t', 'shouldn\'t', 'wouldn\'t', 'won\'t', 'isn\'t', 'aren\'t', 'wasn\'t'
  ];
  
  const textLower = text.toLowerCase();
  const words = textLower.split(/\s+/);
  
  let positiveScore = 0;
  let negativeScore = 0;
  let foundPositiveWords: string[] = [];
  let foundNegativeWords: string[] = [];
  let foundNeutralModifiers: string[] = [];
  let foundIntensityModifiers: string[] = [];
  let foundNegations: string[] = [];
  
  // First pass: identify all sentiment words and modifiers
  for (let i = 0; i < words.length; i++) {
    const word = words[i].replace(/[.,!?;:]/g, ''); // Remove punctuation
    
    if (positiveWords.includes(word)) {
      foundPositiveWords.push(word);
    }
    
    if (negativeWords.includes(word)) {
      foundNegativeWords.push(word);
    }
    
    if (neutralModifiers.includes(word)) {
      foundNeutralModifiers.push(word);
    }
    
    if (intensityModifiers.includes(word)) {
      foundIntensityModifiers.push(word);
    }
    
    if (negations.includes(word)) {
      foundNegations.push(word);
    }
  }
  
  // Second pass: calculate context-aware sentiment scores
  let negationActive = false;
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i].replace(/[.,!?;:]/g, '');
    
    // Check if this word is a negation
    if (negations.includes(word)) {
      negationActive = true;
      continue;
    }
    
    // Check for intensity modifiers
    let intensityMultiplier = 1.0;
    if (i > 0 && intensityModifiers.includes(words[i-1].replace(/[.,!?;:]/g, ''))) {
      intensityMultiplier = 1.5;
    }
    
    // Check for neutral modifiers
    if (i > 0 && neutralModifiers.includes(words[i-1].replace(/[.,!?;:]/g, ''))) {
      intensityMultiplier = 0.5;
    }
    
    // Apply sentiment with context
    if (positiveWords.includes(word)) {
      if (negationActive) {
        negativeScore += 1 * intensityMultiplier;
      } else {
        positiveScore += 1 * intensityMultiplier;
      }
      negationActive = false;
    }
    
    if (negativeWords.includes(word)) {
      if (negationActive) {
        positiveScore += 0.5 * intensityMultiplier; // Negated negative is less positive than explicit positive
      } else {
        negativeScore += 1 * intensityMultiplier;
      }
      negationActive = false;
    }
    
    // Reset negation after 3 words if not used
    if (negationActive && i > 0 && i % 3 === 0) {
      negationActive = false;
    }
  }
  
  // Determine sentiment based on scores
  let sentiment: 'Positive' | 'Neutral' | 'Negative';
  let confidence: number;
  
  // Calculate net sentiment and magnitude
  const netSentiment = positiveScore - negativeScore;
  const sentimentMagnitude = positiveScore + negativeScore;
  
  if (sentimentMagnitude < 0.5) {
    // Very little sentiment expressed
    sentiment = 'Neutral';
    confidence = 0.7 + (0.3 * (1 - sentimentMagnitude)); // Higher confidence for clear neutrality
  } else if (netSentiment > 0.5) {
    sentiment = 'Positive';
    confidence = 0.5 + (0.5 * (netSentiment / sentimentMagnitude)); // Scale by proportion of positivity
  } else if (netSentiment < -0.5) {
    sentiment = 'Negative';
    confidence = 0.5 + (0.5 * (-netSentiment / sentimentMagnitude)); // Scale by proportion of negativity
  } else {
    // Mixed or weak sentiment
    sentiment = 'Neutral';
    confidence = 0.6;
  }
  
  // Extract some keywords (sentiment words found in text)
  const keywords = [...foundPositiveWords, ...foundNegativeWords];
  
  // Boost confidence if we found many sentiment words or intensity modifiers
  if (keywords.length > 3) {
    confidence = Math.min(confidence * 1.2, 0.95);
  }
  
  // Cap confidence at 0.95
  confidence = Math.min(confidence, 0.95);
  
  return {
    sentiment,
    confidence,
    keywords: Array.from(new Set(keywords)).slice(0, 5) // Remove duplicates and limit to 5 keywords
  };
};
