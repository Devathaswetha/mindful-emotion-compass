
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Bot } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { analyzeSentiment } from '@/lib/sentimentAnalysis';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sentiment?: 'Positive' | 'Neutral' | 'Negative';
}

// Preset responses based on detected emotions
const emotionResponses: Record<string, string[]> = {
  Happy: [
    "It's great to hear you're feeling happy! What's bringing you joy today?",
    "Your positive energy is wonderful! How can we keep this good mood going?",
    "I'm glad you're feeling happy! Would you like to share what's made your day better?"
  ],
  Sad: [
    "I'm sorry to hear you're feeling sad. Would you like to talk about what's bothering you?",
    "It's okay to feel down sometimes. Is there something specific that's making you feel this way?",
    "I'm here for you during this difficult time. What might help you feel a little better right now?"
  ],
  Angry: [
    "I can see you're feeling frustrated. Would it help to talk about what's making you angry?",
    "It's important to acknowledge anger. What healthy ways do you usually cope with these feelings?",
    "When you're ready, I'm here to listen about what's upsetting you. Is there something specific that triggered this feeling?"
  ],
  Surprised: [
    "Something unexpected happened? I'd love to hear about what surprised you.",
    "Surprises can really impact our mood. Would you like to share what happened?",
    "I'm interested in hearing more about this surprising situation and how it's affected you."
  ],
  Neutral: [
    "How are you feeling today? Is there anything specific you'd like to talk about?",
    "Sometimes a neutral mood is a good place to start a conversation. What's on your mind?",
    "I'm here to chat about whatever you'd like. What's been going on in your life recently?"
  ],
  Anxious: [
    "I notice you might be feeling anxious. Deep breathing can help - would you like to try a quick breathing exercise?",
    "Anxiety can be challenging. What typically helps you when you're feeling this way?",
    "It's okay to feel anxious sometimes. Would it help to talk about what's causing these feelings?"
  ],
  Excited: [
    "Your excitement is contagious! What wonderful thing has happened?",
    "I'd love to hear more about what you're excited about!",
    "That positive energy is wonderful! What's got you feeling so excited today?"
  ]
};

// General supportive responses when emotion is unclear
const generalResponses = [
  "How are you feeling today?",
  "I'm here to listen if you want to talk about anything.",
  "Sometimes talking about our feelings can help us process them better.",
  "Would you like to share more about your day?",
  "Remember that it's okay to feel whatever you're feeling right now."
];

// Resources for different emotional states
const emotionResources: Record<string, { title: string, description: string, link?: string }[]> = {
  Sad: [
    { 
      title: "Practice Self-Compassion", 
      description: "Treat yourself with the same kindness you would offer to a good friend."
    },
    { 
      title: "Mindful Breathing", 
      description: "Take 5 slow, deep breaths, focusing only on your breathing."
    },
    {
      title: "Talk to Someone",
      description: "Consider reaching out to a friend, family member, or professional."
    }
  ],
  Anxious: [
    {
      title: "5-4-3-2-1 Grounding",
      description: "Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste."
    },
    {
      title: "Progressive Muscle Relaxation",
      description: "Tense and then release each muscle group in your body."
    },
    {
      title: "Limit Media Consumption",
      description: "Take breaks from news and social media that might increase anxiety."
    }
  ],
  Angry: [
    {
      title: "Take a Time-Out",
      description: "Step away from the situation until you can think more clearly."
    },
    {
      title: "Physical Release",
      description: "Try exercise, deep breathing, or safely punching a pillow."
    },
    {
      title: "Express Yourself",
      description: "Write down your thoughts or talk to someone you trust."
    }
  ]
};

// Coping strategies for different emotions
const copingStrategies: Record<string, string[]> = {
  Sad: [
    "Try going for a walk in nature",
    "Listen to uplifting music",
    "Call a friend who makes you smile",
    "Watch a comedy show or movie",
    "Practice gratitude by listing 3 things you appreciate"
  ],
  Anxious: [
    "Practice box breathing: inhale for 4, hold for 4, exhale for 4, hold for 4",
    "Ground yourself by focusing on your five senses",
    "Write down your worries to get them out of your head",
    "Move your body with gentle stretching or walking",
    "Limit caffeine and sugar which can increase anxiety"
  ],
  Angry: [
    "Count to 10 before responding",
    "Take deep breaths to calm your nervous system",
    "Use 'I feel' statements instead of blaming others",
    "Step away from the situation temporarily",
    "Channel the energy into physical activity"
  ],
  Neutral: [
    "Try a new hobby or activity",
    "Set a small goal for the day",
    "Connect with a friend or family member",
    "Practice mindfulness meditation",
    "Engage in something creative"
  ]
};

interface EmotionChatbotProps {
  detectedEmotion?: string | null;
}

const EmotionChatbot = ({ detectedEmotion }: EmotionChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Set currentEmotion when detectedEmotion changes
  useEffect(() => {
    if (detectedEmotion) {
      setCurrentEmotion(detectedEmotion);
    }
  }, [detectedEmotion]);

  // Initialize chat with a greeting based on detected emotion
  useEffect(() => {
    const initialMessages: Message[] = [];
    
    // Welcome message
    initialMessages.push({
      id: `bot-${Date.now()}-1`,
      content: "Hi there! I'm MindfulBot, your emotional support companion.",
      sender: 'bot',
      timestamp: new Date()
    });

    // If we have a detected emotion, add a more personalized greeting
    if (detectedEmotion && emotionResponses[detectedEmotion]) {
      const responseIndex = Math.floor(Math.random() * emotionResponses[detectedEmotion].length);
      initialMessages.push({
        id: `bot-${Date.now()}-2`,
        content: emotionResponses[detectedEmotion][responseIndex],
        sender: 'bot',
        timestamp: new Date()
      });
      
      // For negative emotions, suggest resources
      if (['Sad', 'Anxious', 'Angry'].includes(detectedEmotion)) {
        initialMessages.push({
          id: `bot-${Date.now()}-3`,
          content: "I have some resources that might help with these feelings. Would you like to see them?",
          sender: 'bot',
          timestamp: new Date()
        });
      }
    } else {
      // General greeting if no emotion detected
      initialMessages.push({
        id: `bot-${Date.now()}-2`,
        content: "How are you feeling today? I'm here to listen and support you.",
        sender: 'bot',
        timestamp: new Date()
      });
    }
    
    setMessages(initialMessages);
  }, [detectedEmotion]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus on input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsBotTyping(true);

    // Analyze sentiment of user message
    try {
      const sentimentResult = await analyzeSentiment(inputValue);
      userMessage.sentiment = sentimentResult.sentiment;
      
      // Update user message with sentiment
      setMessages(prevMessages => 
        prevMessages.map(msg => msg.id === userMessage.id ? {...msg, sentiment: sentimentResult.sentiment} : msg)
      );

      // If sentiment is negative, might want to adjust responses
      if (sentimentResult.sentiment === 'Negative' && !['Sad', 'Angry', 'Anxious'].includes(currentEmotion || '')) {
        setCurrentEmotion('Sad');
      }
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    }

    // Check for keywords in user message
    const message = inputValue.toLowerCase();
    
    // Check for resource requests
    if (message.includes('resource') || message.includes('help') || message.includes('suggest')) {
      setTimeout(() => {
        const resourceMessage: Message = {
          id: `bot-resource-${Date.now()}`,
          content: "I can share some resources that might help. Would you like to see them?",
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prevMessages => [...prevMessages, resourceMessage]);
        setIsBotTyping(false);
      }, 1000);
      return;
    }
    
    // Check for yes to resources
    if ((message.includes('yes') || message.includes('sure') || message.includes('okay')) && 
        messages.some(m => m.content.includes('resources'))) {
      setTimeout(() => {
        const resourceEmotionToUse = currentEmotion === 'Sad' || currentEmotion === 'Anxious' || currentEmotion === 'Angry' 
          ? currentEmotion 
          : 'Sad';
        
        const strategyIndex = Math.floor(Math.random() * (copingStrategies[resourceEmotionToUse]?.length || 0));
        const strategy = copingStrategies[resourceEmotionToUse]?.[strategyIndex] || 
                         "Taking some deep breaths can help in most situations.";
        
        const resourceMessage: Message = {
          id: `bot-resource-${Date.now()}`,
          content: `Here's a suggestion that might help: ${strategy}\n\nWould you like to try this?`,
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prevMessages => [...prevMessages, resourceMessage]);
        setShowResources(true);
        setIsBotTyping(false);
      }, 1000);
      return;
    }

    // Simulate bot typing
    setTimeout(() => {
      let botResponse: string;
      
      // If we have a detected emotion, use responses for that emotion
      if (currentEmotion && emotionResponses[currentEmotion]) {
        const responses = emotionResponses[currentEmotion];
        botResponse = responses[Math.floor(Math.random() * responses.length)];
      } else {
        // Otherwise use general supportive responses
        botResponse = generalResponses[Math.floor(Math.random() * generalResponses.length)];
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsBotTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleShowResources = () => {
    setShowResources(!showResources);
  };

  return (
    <Card className="flex flex-col h-[500px] overflow-hidden rounded-xl shadow-lg border-2 border-mindful-soft">
      <CardHeader className="py-3 bg-gradient-to-r from-mindful-primary to-mindful-secondary text-white">
        <CardTitle className="text-lg flex items-center">
          <MessageCircle className="mr-2 h-5 w-5" />
          MindfulBot
          <span className="ml-auto text-xs bg-white text-mindful-primary px-2 py-0.5 rounded-full">
            AI Support
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0 bg-gradient-to-b from-white to-mindful-soft/20">
        <ScrollArea className="h-full p-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3 shadow-sm",
                  message.sender === 'user' 
                    ? "bg-gradient-to-r from-mindful-primary to-mindful-secondary text-white rounded-br-none" 
                    : "bg-white border border-mindful-soft/50 text-gray-800 rounded-bl-none"
                )}
              >
                {message.sender === 'bot' && (
                  <div className="flex items-center mb-1">
                    <Avatar className="h-6 w-6 mr-2 bg-mindful-primary/20">
                      <Bot className="h-3 w-3 text-mindful-primary" />
                    </Avatar>
                    <span className="text-xs font-medium">MindfulBot</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <div className={`text-xs mt-1 flex items-center justify-between ${
                  message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                }`}>
                  <span>{formatTime(message.timestamp)}</span>
                  {message.sentiment && message.sender === 'user' && (
                    <span className={cn(
                      "ml-2 px-1.5 py-0.5 rounded-full text-[10px]",
                      message.sentiment === 'Positive' && "bg-green-100 text-green-700",
                      message.sentiment === 'Neutral' && "bg-blue-100 text-blue-700",
                      message.sentiment === 'Negative' && "bg-red-100 text-red-700"
                    )}>
                      {message.sentiment}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isBotTyping && (
            <div className="flex mb-4 justify-start">
              <div className="bg-white border border-mindful-soft/50 text-gray-800 rounded-lg rounded-bl-none max-w-[80%] p-3 shadow-sm">
                <div className="flex items-center mb-1">
                  <Avatar className="h-6 w-6 mr-2 bg-mindful-primary/20">
                    <Bot className="h-3 w-3 text-mindful-primary" />
                  </Avatar>
                  <span className="text-xs font-medium">MindfulBot</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-mindful-primary animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-mindful-primary animate-pulse delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-mindful-primary animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          )}
          {showResources && currentEmotion && emotionResources[currentEmotion] && (
            <div className="my-4 p-3 bg-mindful-soft/30 rounded-lg border border-mindful-soft/50">
              <h4 className="font-medium text-sm text-mindful-primary mb-2">Resources for {currentEmotion} Feelings</h4>
              <div className="space-y-2">
                {emotionResources[currentEmotion].map((resource, index) => (
                  <div key={index} className="p-2 bg-white rounded border border-mindful-soft/30 text-sm">
                    <p className="font-medium">{resource.title}</p>
                    <p className="text-gray-600 text-xs">{resource.description}</p>
                    {resource.link && (
                      <a 
                        href={resource.link} 
                        className="text-mindful-primary text-xs hover:underline"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Learn more
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-3 border-t bg-white">
        <div className="flex w-full items-center space-x-2">
          {currentEmotion && ['Sad', 'Anxious', 'Angry'].includes(currentEmotion) && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleShowResources}
              className="flex-shrink-0"
              title="Show helpful resources"
            >
              <Bot size={18} />
            </Button>
          )}
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isBotTyping}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isBotTyping}
            className="bg-mindful-primary hover:bg-mindful-secondary flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EmotionChatbot;
