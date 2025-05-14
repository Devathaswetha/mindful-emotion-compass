
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoodEntry } from '@/lib/mockData';
import { format, parseISO } from 'date-fns';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface MoodHistoryProps {
  moodHistory: MoodEntry[];
  onDeleteEntry: (id: string) => void;
}

const MoodHistory = ({ moodHistory, onDeleteEntry }: MoodHistoryProps) => {
  const [showAll, setShowAll] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  
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
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-mindful-soft to-white">
          <CardTitle className="text-mindful-primary text-2xl">Mood History</CardTitle>
          <CardDescription>Track your emotional patterns over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-6xl mb-4 animate-pulse">📊</div>
            <p className="text-center text-gray-500">No mood entries yet. Start by recording your mood above!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-mindful-soft to-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-mindful-primary text-2xl">Mood History</CardTitle>
            <CardDescription>Track your emotional patterns over time</CardDescription>
          </div>
          {chartData.length >= 2 && (
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant={chartType === 'line' ? 'default' : 'outline'}
                className="text-xs" 
                onClick={() => setChartType('line')}
              >
                Line
              </Button>
              <Button 
                size="sm" 
                variant={chartType === 'area' ? 'default' : 'outline'}
                className="text-xs" 
                onClick={() => setChartType('area')}
              >
                Area
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chart for mood history */}
        {chartData.length >= 2 ? (
          <div className="h-72 w-full p-4 bg-white rounded-xl shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 5]} 
                    ticks={[1, 2, 3, 4, 5]} 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12 }}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="text-sm font-bold">{payload[0].payload.date}</p>
                            <p className="text-sm font-medium text-mindful-primary">{`Mood: ${payload[0].payload.mood}`}</p>
                            <p className="text-sm">{`Intensity: ${payload[0].payload.intensity}/5`}</p>
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
                    strokeWidth={3} 
                    dot={{ fill: '#9b87f5', strokeWidth: 2, r: 6, stroke: '#fff' }} 
                    activeDot={{ r: 8, stroke: '#9b87f5', strokeWidth: 2, fill: '#fff' }}
                  />
                </LineChart>
              ) : (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 5]} 
                    ticks={[1, 2, 3, 4, 5]} 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12 }}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="text-sm font-bold">{payload[0].payload.date}</p>
                            <p className="text-sm font-medium text-mindful-primary">{`Mood: ${payload[0].payload.mood}`}</p>
                            <p className="text-sm">{`Intensity: ${payload[0].payload.intensity}/5`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="intensity" 
                    stroke="#9b87f5" 
                    strokeWidth={2}
                    fill="url(#colorIntensity)" 
                    activeDot={{ r: 8, stroke: '#9b87f5', strokeWidth: 2, fill: '#fff' }}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 italic">Not enough data to display a chart yet.</p>
          </div>
        )}

        {/* List of mood entries */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-mindful-primary">Recent Entries</h3>
          <div className="space-y-3">
            {displayEntries.map((entry) => (
              <div 
                key={entry.id} 
                className="flex items-start justify-between bg-gradient-to-r from-white to-mindful-soft/30 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-4xl bg-white p-2 rounded-full shadow-sm">{getMoodEmoji(entry.mood)}</div>
                  <div>
                    <div className="font-medium text-mindful-primary text-lg">{entry.mood}</div>
                    <div className="text-sm text-gray-500">
                      {format(parseISO(entry.date), 'MMM d, yyyy h:mm a')}
                    </div>
                    <div className="text-sm">
                      Intensity: 
                      <div className="inline-flex ml-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`text-sm ${star <= entry.intensity ? 'text-yellow-500' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.tags.map(tag => (
                          <span key={tag} className="text-xs bg-mindful-soft px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {entry.notes && (
                      <div className="text-sm italic mt-2 bg-white/50 p-2 rounded-md">"{entry.notes}"</div>
                    )}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-500 hover:text-red-500 hover:bg-red-50"
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
              className="w-full mt-4 bg-white hover:bg-mindful-soft border-mindful-primary/30 text-mindful-primary"
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
