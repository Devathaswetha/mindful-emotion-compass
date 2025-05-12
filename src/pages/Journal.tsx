
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Journal = () => {
  const [journalEntry, setJournalEntry] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sentiment, setSentiment] = useState<string | null>(null);
  const { toast } = useToast();

  const entries = [
    {
      id: 1,
      date: '2023-05-10',
      title: 'A day of reflection',
      preview: 'Today I took some time to reflect on my recent progress...',
      sentiment: 'Positive'
    },
    {
      id: 2, 
      date: '2023-05-08',
      title: 'Feeling overwhelmed',
      preview: 'There has been a lot on my plate recently...',
      sentiment: 'Negative'
    }
  ];

  const handleSubmit = () => {
    if (!journalEntry.trim()) {
      toast({
        title: "Empty Entry",
        description: "Please write something before saving.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate sentiment analysis
    setTimeout(() => {
      // In a real app, we would send the text to a backend API for sentiment analysis
      const sentiments = ['Positive', 'Neutral', 'Negative'];
      const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      
      setSentiment(randomSentiment);
      setIsAnalyzing(false);
      
      toast({
        title: "Journal Entry Saved",
        description: `Your entry has been saved with ${randomSentiment.toLowerCase()} sentiment.`
      });
      
      // Reset form
      setJournalEntry('');
      setSentiment(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-mindful-dark">Journal</h1>
        <p className="text-gray-500">Express your thoughts and feelings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Write a New Entry</CardTitle>
          <CardDescription>
            Your thoughts are private and secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Entry title"
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />
              <textarea
                rows={10}
                placeholder="What's on your mind today?"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
              />
            </div>

            {sentiment && (
              <div className={`p-4 rounded-md ${
                sentiment === 'Positive' ? 'bg-green-50 text-green-700' : 
                sentiment === 'Negative' ? 'bg-red-50 text-red-700' : 
                'bg-gray-50 text-gray-700'
              }`}>
                <p className="font-medium">Sentiment Analysis: {sentiment}</p>
                <p className="text-sm mt-1">
                  {sentiment === 'Positive' ? 'Your entry expresses positive emotions.' : 
                   sentiment === 'Negative' ? 'Your entry expresses concern or negative emotions.' : 
                   'Your entry is mostly neutral in tone.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-mindful-primary hover:bg-mindful-secondary"
            disabled={isAnalyzing || !journalEntry.trim()}
          >
            {isAnalyzing ? "Analyzing..." : "Save Entry"}
          </Button>
        </CardFooter>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Previous Entries</h2>
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{entry.title}</CardTitle>
                    <CardDescription>{entry.date}</CardDescription>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    entry.sentiment === 'Positive' ? 'bg-green-100 text-green-700' : 
                    entry.sentiment === 'Negative' ? 'bg-red-100 text-red-700' : 
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {entry.sentiment}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{entry.preview}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="link" className="text-mindful-primary p-0">
                  Read full entry
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Journal;
