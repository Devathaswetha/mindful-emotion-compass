
// This is a mock sentiment analysis service
// In a real app, this would connect to a backend API that uses NLP models

export interface SentimentAnalysisResult {
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  confidence: number;
  keywords: string[];
}

export const analyzeSentiment = async (text: string): Promise<SentimentAnalysisResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simple mock implementation that checks for positive/negative words
  const positiveWords = ['happy', 'good', 'great', 'excellent', 'wonderful', 'joy', 'love', 'like'];
  const negativeWords = ['sad', 'bad', 'awful', 'terrible', 'angry', 'upset', 'hate', 'dislike'];
  
  const textLower = text.toLowerCase();
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  const foundPositive = positiveWords.filter(word => textLower.includes(word));
  const foundNegative = negativeWords.filter(word => textLower.includes(word));
  
  positiveScore = foundPositive.length;
  negativeScore = foundNegative.length;
  
  let sentiment: 'Positive' | 'Neutral' | 'Negative';
  let confidence: number;
  
  if (positiveScore > negativeScore) {
    sentiment = 'Positive';
    confidence = 0.5 + (positiveScore / (positiveScore + negativeScore)) * 0.5;
  } else if (negativeScore > positiveScore) {
    sentiment = 'Negative';
    confidence = 0.5 + (negativeScore / (positiveScore + negativeScore)) * 0.5;
  } else {
    sentiment = 'Neutral';
    confidence = 0.7;
  }
  
  // Extract some keywords (simply return found words in this mock)
  const keywords = [...foundPositive, ...foundNegative];
  
  return {
    sentiment,
    confidence,
    keywords: keywords.slice(0, 5) // Limit to 5 keywords
  };
};
