
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
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
import { Line } from 'react-chartjs-2';

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
            <div className="flex justify-center py-4">
              <button 
                className="text-5xl hover:scale-110 transition-transform"
                onClick={() => {
                  toast({ title: "Mood Check-in", description: "Great! You're feeling happy today." });
                }}
              >
                😊
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recommended</CardTitle>
            <CardDescription>Based on your recent activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-mindful-soft p-4 cursor-pointer hover:bg-opacity-70 transition-colors">
              <h3 className="font-medium text-mindful-primary">5-minute Breathing Exercise</h3>
              <p className="text-sm text-gray-500 mt-1">Perfect for a quick mental reset</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Journal</CardTitle>
            <CardDescription>Recent entries</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 italic">No recent entries</p>
            <button className="mt-2 text-mindful-primary text-sm font-medium hover:underline">
              Write a new entry
            </button>
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
