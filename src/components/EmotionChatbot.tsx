import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
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

interface EmotionChatbotProps {
  detectedEmotion?: string | null;
}

const EmotionChatbot = ({ detectedEmotion }: EmotionChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleSendMessage = () => {
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

    // Simulate bot typing
    setTimeout(() => {
      let botResponse: string;
      
      // If we have a detected emotion, use responses for that emotion
      if (detectedEmotion && emotionResponses[detectedEmotion]) {
        const responses = emotionResponses[detectedEmotion];
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

  return (
    <Card className="flex flex-col h-[500px] overflow-hidden">
      <CardHeader className="py-3 bg-mindful-primary text-white">
        <CardTitle className="text-lg flex items-center">
          <MessageCircle className="mr-2 h-5 w-5" />
          MindfulBot
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-mindful-primary text-white rounded-br-none'
                    : 'bg-mindful-soft text-gray-800 rounded-bl-none'
                }`}
              >
                {message.sender === 'bot' && (
                  <div className="flex items-center mb-1">
                    <Avatar className="h-6 w-6 mr-2 bg-white">
                      <span className="text-xs font-bold text-mindful-primary">MB</span>
                    </Avatar>
                    <span className="text-xs font-medium">MindfulBot</span>
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
                <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          {isBotTyping && (
            <div className="flex mb-4 justify-start">
              <div className="bg-mindful-soft text-gray-800 rounded-lg rounded-bl-none max-w-[80%] p-3">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-mindful-primary animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-mindful-primary animate-pulse delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-mindful-primary animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-3 border-t">
        <div className="flex w-full items-center space-x-2">
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
            className="bg-mindful-primary hover:bg-mindful-secondary"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EmotionChatbot;
