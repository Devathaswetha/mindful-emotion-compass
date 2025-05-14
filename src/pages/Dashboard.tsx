
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { getRecommendationsForMood, Recommendation } from "@/lib/recommendations";
import { MoodEntry } from "@/lib/mockData";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts';

const Dashboard = () => {
  const { toast } = useToast();
  const [greeting, setGreeting] = useState("");
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [moodData, setMoodData] = useState({
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Mood Score',
        data: [3, 4, 3, 5, 4, 5, 4],
        borderColor: '#9b87f5',
        backgroundColor: 'rgba(155, 135, 245, 0.1)',
        tension: 0.4,
      },
    ],
  });

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Show welcome toast
    toast({
      title: "Welcome to MindfulMe",
      description: "Your pocket companion for mental wellness",
    });
    
    // Load mood history from localStorage
    const savedMoodHistory = localStorage.getItem('moodHistory');
    if (savedMoodHistory) {
      try {
        const parsedHistory = JSON.parse(savedMoodHistory);
        setMoodHistory(parsedHistory);
        
        // Update chart data with actual mood history if available
        if (parsedHistory.length > 0) {
          updateChartFromHistory(parsedHistory);
        }
      } catch (e) {
        console.error('Error loading mood history:', e);
      }
    }
  }, [toast]);
  
  // Update recommendations when mood changes
  useEffect(() => {
    if (currentMood) {
      const newRecommendations = getRecommendationsForMood(currentMood);
      setRecommendations(newRecommendations);
    }
  }, [currentMood]);
  
  // Function to update chart data from mood history
  const updateChartFromHistory = (history: MoodEntry[]) => {
    if (!history.length) return;
    
    // Sort by date (oldest to newest)
    const sortedEntries = [...history].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Take only the last 7 days
    const recentEntries = sortedEntries.slice(-7);
    
    if (recentEntries.length > 0) {
      const newChartData = recentEntries.map(entry => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
        intensity: entry.intensity,
        mood: entry.mood
      }));
      
      setChartData(newChartData);
    }
  };

  const handleMoodSelect = (mood: string) => {
    setCurrentMood(mood);
    toast({ 
      title: "Mood Check-in", 
      description: `Great! You're feeling ${mood} today.` 
    });
  };

  // Get latest mood entry if available
  const latestMood = moodHistory.length > 0 
    ? moodHistory.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0]
    : null;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-mindful-primary to-mindful-secondary bg-clip-text text-transparent">{greeting}</h1>
        <p className="text-gray-500 mt-2 text-lg">Welcome to your mental wellness companion</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Mood Card */}
        <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-mindful-soft to-white">
            <CardTitle>Today's Mood</CardTitle>
            <CardDescription>How are you feeling?</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-5 gap-2 py-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-2 py-4">
                <button 
                  className={`p-3 rounded-lg text-3xl hover:scale-110 transition-transform ${
                    currentMood === 'Happy' ? "bg-mindful-soft ring-2 ring-mindful-primary shadow-lg" : "hover:bg-mindful-soft/50"
                  }`}
                  onClick={() => handleMoodSelect("Happy")}
                >
                  😊
                  <div className="text-xs mt-1">Happy</div>
                </button>
                <button 
                  className={`p-3 rounded-lg text-3xl hover:scale-110 transition-transform ${
                    currentMood === 'Sad' ? "bg-mindful-soft ring-2 ring-mindful-primary shadow-lg" : "hover:bg-mindful-soft/50"
                  }`}
                  onClick={() => handleMoodSelect("Sad")}
                >
                  😢
                  <div className="text-xs mt-1">Sad</div>
                </button>
                <button 
                  className={`p-3 rounded-lg text-3xl hover:scale-110 transition-transform ${
                    currentMood === 'Angry' ? "bg-mindful-soft ring-2 ring-mindful-primary shadow-lg" : "hover:bg-mindful-soft/50"
                  }`}
                  onClick={() => handleMoodSelect("Angry")}
                >
                  😠
                  <div className="text-xs mt-1">Angry</div>
                </button>
                <button 
                  className={`p-3 rounded-lg text-3xl hover:scale-110 transition-transform ${
                    currentMood === 'Surprised' ? "bg-mindful-soft ring-2 ring-mindful-primary shadow-lg" : "hover:bg-mindful-soft/50"
                  }`}
                  onClick={() => handleMoodSelect("Surprised")}
                >
                  😮
                  <div className="text-xs mt-1">Surprised</div>
                </button>
                <button 
                  className={`p-3 rounded-lg text-3xl hover:scale-110 transition-transform ${
                    currentMood === 'Neutral' ? "bg-mindful-soft ring-2 ring-mindful-primary shadow-lg" : "hover:bg-mindful-soft/50"
                  }`}
                  onClick={() => handleMoodSelect("Neutral")}
                >
                  😐
                  <div className="text-xs mt-1">Neutral</div>
                </button>
              </div>
            )}
            {latestMood && !currentMood && !isLoading && (
              <div className="text-sm text-center mt-2 p-2 bg-mindful-soft/30 rounded-lg">
                <p>Last recorded mood: <span className="font-medium">{latestMood.mood}</span></p>
                <Link to="/mood">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-mindful-primary"
                  >
                    View mood history
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommended Card */}
        <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-mindful-soft to-white">
            <CardTitle>Recommended</CardTitle>
            <CardDescription>Based on your mood and activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </>
            ) : recommendations.length > 0 ? (
              recommendations.map((rec, idx) => (
                <div 
                  key={idx}
                  className="rounded-lg bg-gradient-to-r from-white to-mindful-soft/30 p-4 cursor-pointer hover:shadow-md transition-all duration-200"
                >
                  {rec.link ? (
                    <Link to={rec.link}>
                      <h3 className="font-medium text-mindful-primary">{rec.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                      {rec.duration && (
                        <p className="text-xs text-gray-400 mt-1 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {rec.duration}
                        </p>
                      )}
                    </Link>
                  ) : (
                    <>
                      <h3 className="font-medium text-mindful-primary">{rec.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                      {rec.duration && (
                        <p className="text-xs text-gray-400 mt-1 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {rec.duration}
                        </p>
                      )}
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-lg bg-gradient-to-r from-white to-mindful-soft/30 p-4">
                <h3 className="font-medium text-mindful-primary">Select your mood</h3>
                <p className="text-sm text-gray-600 mt-1">We'll provide personalized recommendations</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Journal Card */}
        <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-mindful-soft to-white">
            <CardTitle>Journal</CardTitle>
            <CardDescription>Recent entries</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-500 italic">No recent entries</p>
                </div>
                <Link to="/journal">
                  <Button className="w-full bg-white hover:bg-mindful-soft text-mindful-primary border border-mindful-primary/30">
                    Write a new entry
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mood Tracker Card */}
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-mindful-soft to-white">
          <CardTitle>Weekly Mood Tracker</CardTitle>
          <CardDescription>
            Your mood patterns for the past week
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <>
              <div className="h-80 p-4 bg-white rounded-xl shadow-inner">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
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
                        strokeWidth={3}
                        fill="url(#colorIntensity)" 
                        activeDot={{ r: 8, stroke: '#9b87f5', strokeWidth: 2, fill: '#fff' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-6xl mb-4 animate-pulse">📊</div>
                    <p className="text-gray-500 text-center">Not enough mood data to display a chart</p>
                    <p className="text-gray-500 text-center text-sm mt-2">Track your mood to see patterns over time</p>
                  </div>
                )}
              </div>
              <div className="text-center mt-6">
                <Link to="/mood">
                  <Button 
                    className="bg-white hover:bg-mindful-soft text-mindful-primary border border-mindful-primary/30 px-8"
                  >
                    View Full Mood History
                  </Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
