import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft, Volume2, Skull, Target, Crown, Zap, Briefcase, Brain, Laugh } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'character';
  timestamp: Date;
}

interface ChatInterfaceProps {
  characterId: string;
  onBack: () => void;
}

const characterInfo = {
  'walter-white': {
    name: 'Walter White',
    subtitle: 'Chemistry Teacher Turned Kingpin',
    icon: <Skull className="h-6 w-6" />,
    color: 'poison-green'
  },
  'dexter': {
    name: 'Dexter Morgan',
    subtitle: 'Blood Spatter Analyst',
    icon: <Target className="h-6 w-6" />,
    color: 'blood-red'
  },
  'thomas-shelby': {
    name: 'Thomas Shelby',
    subtitle: 'Birmingham Gang Leader',
    icon: <Crown className="h-6 w-6" />,
    color: 'industrial-orange'
  },
  'jesse-pinkman': {
    name: 'Jesse Pinkman',
    subtitle: 'Street-Smart Meth Cook and Rebel',
    icon: <Zap className="h-6 w-6" />, // Reusing Skull for now — or replace with a different one like "Zap"
    color: 'electric-blue'
  },
  'harvey-specter': {
    name: 'Harvey Specter',
    subtitle: 'The Closer, Top Corporate Lawyer',
    icon: <Briefcase className="h-6 w-6" />,
    color: 'power-gray'
  },
  'mike-ross': {
    name: 'Mike Ross',
    subtitle: 'Legal Prodigy with a Photographic Memory',
    icon: <Brain className="h-6 w-6" />,
    color: 'mind-blue'
  },
  'louis-litt': {
    name: 'Louis Litt',
    subtitle: 'Name Partner and Cat-Loving Litigator',
    icon: <Laugh className="h-6 w-6" />,
    color: 'litt-purple'
  },
};

export default function ChatInterface({ characterId, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const character = characterInfo[characterId as keyof typeof characterInfo];

  useEffect(() => {
    // Add initial greeting message
    const initialMessage: Message = {
      id: Date.now().toString(),
      content: getInitialGreeting(characterId),
      sender: 'character',
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, [characterId]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const getInitialGreeting = (characterId: string): string => {
    const greetings = {
      'walter-white': "I am not in danger, I AM the danger. What do you want to discuss?",
      'dexter': "Hello. I find most people are predictable, but you might surprise me. What's on your mind?",
      'thomas-shelby': "Right then. You've got my attention. What business brings you here today?"
    };
    return greetings[characterId as keyof typeof greetings] || "Hello there.";
  };

  const simulateCharacterResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Placeholder responses based on character
    const responses = {
      'walter-white': [
        "I am the one who knocks! But more importantly, I am the one who understands chemistry at a molecular level.",
        "Jesse, you asked about chemistry... wait, you're not Jesse. Never mind. The point is, everything is chemistry.",
        "I am not crazy! I know the periodic table like the back of my hand.",
        "Say my name... Actually, you already know it. Let's focus on the science."
      ],
      'dexter': [
        "Interesting. Your question reveals patterns in your thinking that I find... illuminating.",
        "My Dark Passenger is quiet right now, which means I can focus entirely on our conversation.",
        "I've analyzed thousands of blood spatter patterns. Human behavior follows patterns too.",
        "Tonight's the night... for a meaningful conversation, that is."
      ],
      'thomas-shelby': [
        "By order of the Peaky Blinders, I'll give you a straight answer.",
        "I've seen men rise and fall in Birmingham. What matters is how you handle both.",
        "Family is everything. Business is everything else. What category does your question fall into?",
        "The smoke from the factories clears eventually. Truth, however, remains."
      ]
    };

    const characterResponses = responses[characterId as keyof typeof responses] || ["I understand."];
    return characterResponses[Math.floor(Math.random() * characterResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      
      const response = await fetch("https://api-persona-chat.onrender.com/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          character: characterId,
        }),
      });
      
      const data = await response.json();
      const responseContent = data.response || "Not able to listen... try again.";
      
      
      const characterMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: 'character',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, characterMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = async (message: string) => {
    try {
      const res = await fetch("https://api-persona-chat.onrender.com/api/speak/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: message }),
      });
  
      if (!res.ok) throw new Error("Failed to fetch audio");
  
      const data = await res.json();
      const audio = new Audio(data.audio_url);
      audio.play();
    } catch (error) {
      toast({
        title: "Voice Error",
        description: "Could not generate voice. Please try again.",
      });
      console.error(error);
    }
  };
  

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-crime flex flex-col">
      {/* Header */}
      <div className="border-b border-border/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Selection
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className={`text-${character.color}`}>
              {character.icon}
            </div>
            <div>
              <h2 className="font-bold text-lg">{character.name}</h2>
              <p className="text-sm text-muted-foreground">{character.subtitle}</p>
            </div>
          </div>

          <div className="w-32" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4">
        <ScrollArea className="h-[calc(100vh-200px)]" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <Card className={`max-w-[70%] ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card border-border/20'
                }`}>
                  <CardContent className="p-4">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.sender === 'character' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSpeak(message.content)}
                          className="h-6 w-6 p-0 hover:bg-secondary/50"
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <Card className="max-w-[70%] bg-card border-border/20">
                  <CardContent className="p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t border-border/20 bg-card/50 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask ${character.name} anything...`}
            className="flex-1 bg-background border-border/20 focus:border-primary"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}