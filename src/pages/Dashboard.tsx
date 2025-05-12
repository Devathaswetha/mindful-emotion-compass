
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { getRecommendationsForMood, Recommendation } from "@/lib/recommendations";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { toast } = useToast();
  const [greeting, setGreeting] = useState("");
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
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

    // Show welcome toast
    toast({
      title: "Welcome to MindfulMe",
      description: "Your pocket companion for mental wellness",
    });
  }, [toast]);
  
  // Update recommendations when mood changes
  useEffect(() => {
    if (currentMood) {
      const newRecommendations = getRecommendationsForMood(currentMood);
      setRecommendations(newRecommendations);
    }
  }, [currentMood]);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const handleMoodSelect = (mood: string) => {
    setCurrentMood(mood);
    toast({ 
      title: "Mood Check-in", 
      description: `Great! You're feeling ${mood} today.` 
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-mindful-dark">{greeting}</h1>
        <p className="text-gray-500">Welcome to your mental wellness companion</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Today's Mood</CardTitle>
            <CardDescription>How are you feeling?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2 py-4">
              <button 
                className={`p-3 rounded-lg text-3xl hover:scale-110 transition-transform ${
                  currentMood === 'Happy' ? "bg-mindful-soft ring-2 ring-mindful-primary" : ""
                }`}
                onClick={() => handleMoodSelect("Happy")}
              >
                😊
                <div className="text-xs mt-1">Happy</div>
              </button>
              <button 
                className={`p-3 rounded-lg text-3xl hover:scale-110 transition-transform ${
                  currentMood === 'Sad' ? "bg-mindful-soft ring-2 ring-mindful-primary" : ""
                }`}
                onClick={() => handleMoodSelect("Sad")}
              >
                😢
                <div className="text-xs mt-1">Sad</div>
              </button>
              <button 
                className={`p-3 rounded-lg text-3xl hover:scale-110 transition-transform ${
                  currentMood === 'Angry' ? "bg-mindful-soft ring-2 ring-mindful-primary" : ""
                }`}
                onClick={() => handleMoodSelect("Angry")}
              >
                😠
                <div className="text-xs mt-1">Angry</div>
              </button>
              <button 
                className={`p-3 rounded-lg text-3xl hover:scale-110 transition-transform ${
                  currentMood === 'Surprised' ? "bg-mindful-soft ring-2 ring-mindful-primary" : ""
                }`}
                onClick={() => handleMoodSelect("Surprised")}
              >
                😮
                <div className="text-xs mt-1">Surprised</div>
              </button>
              <button 
                className={`p-3 rounded-lg text-3xl hover:scale-110 transition-transform ${
                  currentMood === 'Neutral' ? "bg-mindful-soft ring-2 ring-mindful-primary" : ""
                }`}
                onClick={() => handleMoodSelect("Neutral")}
              >
                😐
                <div className="text-xs mt-1">Neutral</div>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recommended</CardTitle>
            <CardDescription>Based on your mood and activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.length > 0 ? (
              recommendations.map((rec, idx) => (
                <div 
                  key={idx}
                  className="rounded-md bg-mindful-soft p-4 cursor-pointer hover:bg-opacity-70 transition-colors"
                >
                  {rec.link ? (
                    <Link to={rec.link}>
                      <h3 className="font-medium text-mindful-primary">{rec.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{rec.description}</p>
                      {rec.duration && (
                        <p className="text-xs text-gray-400 mt-1">{rec.duration}</p>
                      )}
                    </Link>
                  ) : (
                    <>
                      <h3 className="font-medium text-mindful-primary">{rec.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{rec.description}</p>
                      {rec.duration && (
                        <p className="text-xs text-gray-400 mt-1">{rec.duration}</p>
                      )}
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-md bg-mindful-soft p-4">
                <h3 className="font-medium text-mindful-primary">Select your mood</h3>
                <p className="text-sm text-gray-500 mt-1">We'll provide personalized recommendations</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Journal</CardTitle>
            <CardDescription>Recent entries</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 italic">No recent entries</p>
            <Link to="/journal">
              <Button className="mt-2 text-mindful-primary bg-transparent hover:bg-mindful-soft p-0">
                Write a new entry
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Mood Tracker</CardTitle>
          <CardDescription>
            Your mood patterns for the past week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Line data={moodData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
