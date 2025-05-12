
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const Resources = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'articles');

  useEffect(() => {
    if (tabParam && ['articles', 'videos', 'emergency'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const articles = [
    {
      id: 1,
      title: "Understanding Your Emotions",
      description: "Learn how to identify and process different emotional states",
      image: "https://images.unsplash.com/photo-1486825586573-7131f7991bdd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZW1vdGlvbnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      readTime: "5 min read",
      url: "https://www.psychologytoday.com/us/blog/hide-and-seek/201601/what-are-basic-emotions"
    },
    {
      id: 2,
      title: "The Science of Mindfulness",
      description: "How mindfulness practices change your brain and improve well-being",
      image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWluZGZ1bG5lc3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      readTime: "8 min read",
      url: "https://www.mindful.org/the-science-of-mindfulness/"
    },
    {
      id: 3,
      title: "Building Healthy Habits",
      description: "Practical strategies for developing habits that support mental health",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aGFiaXRzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      readTime: "6 min read",
      url: "https://www.health.harvard.edu/blog/how-to-create-healthy-habits-2020012418863"
    }
  ];

  const videos = [
    {
      id: 1,
      title: "Guided Progressive Muscle Relaxation",
      description: "Follow along with this relaxation technique to release tension",
      image: "https://images.unsplash.com/photo-1494719019271-7bfff81660d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVsYXh8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      duration: "12 min",
      url: "https://www.youtube.com/watch?v=1nZEdqcGVzo"
    },
    {
      id: 2,
      title: "Understanding Cognitive Distortions",
      description: "Learn to identify and challenge unhelpful thought patterns",
      image: "https://images.unsplash.com/photo-1551817958-c5b51e7b4a33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dGhvdWdodHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      duration: "15 min",
      url: "https://www.youtube.com/watch?v=OUQnDWirVR4"
    }
  ];

  const emergency = [
    {
      id: 1,
      name: "National Suicide Prevention Lifeline",
      phone: "1-800-273-8255",
      description: "Available 24/7 for anyone in emotional distress",
      url: "https://suicidepreventionlifeline.org/"
    },
    {
      id: 2,
      name: "Crisis Text Line",
      phone: "Text HOME to 741741",
      description: "Text-based crisis support available 24/7",
      url: "https://www.crisistextline.org/"
    },
    {
      id: 3,
      name: "SAMHSA's National Helpline",
      phone: "1-800-662-HELP (4357)",
      description: "Treatment referral and information service for mental health and substance use disorders",
      url: "https://www.samhsa.gov/find-help/national-helpline"
    }
  ];

  const handleOpenLink = (url: string, title: string) => {
    // In a production app, you might want to implement analytics here
    window.open(url, '_blank', 'noopener,noreferrer');
    toast({
      title: "Opening resource",
      description: `Opening: ${title}`,
    });
  };

  const content = {
    articles: (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map(article => (
          <Card key={article.id} className="overflow-hidden">
            <div className="h-40 w-full overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title} 
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
              <CardDescription>{article.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{article.readTime}</span>
              <Button 
                variant="outline"
                onClick={() => handleOpenLink(article.url, article.title)}
              >
                Read Article
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    ),
    videos: (
      <div className="grid gap-6 md:grid-cols-2">
        {videos.map(video => (
          <Card key={video.id} className="overflow-hidden">
            <div className="h-48 w-full overflow-hidden relative">
              <img 
                src={video.image} 
                alt={video.title} 
                className="h-full w-full object-cover"
              />
              <div 
                className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center cursor-pointer"
                onClick={() => handleOpenLink(video.url, video.title)}
              >
                <div className="h-16 w-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>
            </div>
            <CardHeader>
              <CardTitle>{video.title}</CardTitle>
              <CardDescription>{video.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{video.duration}</span>
              <Button 
                variant="outline"
                onClick={() => handleOpenLink(video.url, video.title)}
              >
                Watch Video
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    ),
    emergency: (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Emergency Resources</CardTitle>
          <CardDescription>If you or someone you know is in crisis, contact these resources immediately</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emergency.map(resource => (
              <div key={resource.id} className="border-b border-gray-200 pb-4 last:border-0">
                <h3 className="font-semibold text-lg">{resource.name}</h3>
                <p className="text-lg font-medium text-mindful-primary">{resource.phone}</p>
                <p className="text-gray-500 text-sm mt-1">{resource.description}</p>
                <Button
                  variant="link"
                  className="p-0 h-auto text-mindful-primary mt-1"
                  onClick={() => handleOpenLink(resource.url, resource.name)}
                >
                  Visit Website
                </Button>
              </div>
            ))}
            <div className="mt-4 bg-red-50 p-4 rounded-md">
              <p className="text-red-600 font-medium">
                Remember: If you are experiencing a life-threatening emergency, please call your local emergency number (911 in the US) immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-mindful-dark">Resources</h1>
        <p className="text-gray-500">Educational materials and support resources</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {['articles', 'videos', 'emergency'].map(tab => (
          <button
            key={tab}
            className={`pb-2 px-4 font-medium ${
              activeTab === tab 
                ? 'border-b-2 border-mindful-primary text-mindful-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div>
        {content[activeTab as keyof typeof content]}
      </div>
    </div>
  );
};

export default Resources;
