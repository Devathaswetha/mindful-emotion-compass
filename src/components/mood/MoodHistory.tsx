
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoodEntry } from '@/lib/mockData';
import { format, parseISO } from 'date-fns';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

interface MoodHistoryProps {
  moodHistory: MoodEntry[];
  onDeleteEntry: (id: string) => void;
}

const MoodHistory = ({ moodHistory, onDeleteEntry }: MoodHistoryProps) => {
  const [showAll, setShowAll] = useState(false);
  
  // Show only the last 7 days for the chart
  const chartData = [...moodHistory]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7)
    .map(entry => ({
      date: format(parseISO(entry.date), 'MMM dd'),
      intensity: entry.intensity,
      mood: entry.mood
    }));

  // Show limited number of entries in the list unless "View All" is clicked
  const displayEntries = showAll ? moodHistory : moodHistory.slice(0, 5);
  
  // Function to get emoji based on mood
  const getMoodEmoji = (mood: string): string => {
    const moodLower = mood.toLowerCase();
    if (moodLower.includes('happy') || moodLower.includes('joy')) return '😊';
    if (moodLower.includes('sad')) return '😢';
    if (moodLower.includes('angry') || moodLower.includes('frustrat')) return '😠';
    if (moodLower.includes('surprise')) return '😮';
    if (moodLower.includes('neutral') || moodLower.includes('okay')) return '😐';
    if (moodLower.includes('anxious') || moodLower.includes('stress')) return '😰';
    if (moodLower.includes('tired') || moodLower.includes('exhaust')) return '😴';
    return '🙂';
  };

  if (moodHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mood History</CardTitle>
          <CardDescription>Track your emotional patterns over time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-6">No mood entries yet. Start by recording your mood above!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood History</CardTitle>
        <CardDescription>Track your emotional patterns over time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chart for mood history */}
        {chartData.length >= 2 && (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-2 border rounded shadow">
                          <p className="text-sm">{payload[0].payload.date}</p>
                          <p className="text-sm font-medium">{`Mood: ${payload[0].payload.mood}`}</p>
                          <p className="text-sm">{`Intensity: ${payload[0].payload.intensity}`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="intensity" 
                  stroke="#9b87f5" 
                  strokeWidth={2} 
                  dot={{ fill: '#9b87f5' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* List of mood entries */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Recent Entries</h3>
          <div className="space-y-2">
            {displayEntries.map((entry) => (
              <div 
                key={entry.id} 
                className="flex items-start justify-between bg-gray-50 p-3 rounded-md"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getMoodEmoji(entry.mood)}</div>
                  <div>
                    <div className="font-medium">{entry.mood}</div>
                    <div className="text-sm text-gray-500">
                      {format(parseISO(entry.date), 'MMM d, yyyy h:mm a')}
                    </div>
                    <div className="text-sm">Intensity: {entry.intensity}/5</div>
                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.tags.map(tag => (
                          <span key={tag} className="text-xs bg-gray-200 px-1.5 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {entry.notes && (
                      <div className="text-sm italic mt-1">{entry.notes}</div>
                    )}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-500 hover:text-red-500"
                  onClick={() => onDeleteEntry(entry.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
          
          {moodHistory.length > 5 && (
            <Button 
              variant="outline" 
              onClick={() => setShowAll(!showAll)} 
              className="w-full mt-2"
            >
              {showAll ? 'Show Less' : `View All (${moodHistory.length})`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodHistory;
