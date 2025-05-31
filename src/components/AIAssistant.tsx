
import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Bot, SendHorizontal, X, Sparkles, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { getAIAssistantResponse } from '@/services/aiAssistant';
import { extractResumeText } from '@/services/resumeTextExtraction';

interface AIAssistantProps {
  userType: 'employee' | 'recruiter';
  userName?: string;
}

interface Message {
  id: string;
  content: React.ReactNode;
  isUser: boolean;
  timestamp: Date;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ userType, userName = "User" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeText, setResumeText] = useState<string>('');
  const { toast } = useToast();

  // Load user's resume text when component mounts
  useEffect(() => {
    const loadResumeText = async () => {
      // Try to get the latest uploaded resume URL from localStorage
      const lastResumeUrl = localStorage.getItem('lastUploadedResumeUrl');
      if (lastResumeUrl && userType === 'employee') {
        try {
          const result = await extractResumeText(lastResumeUrl);
          if (result.success && result.text) {
            setResumeText(result.text);
            console.log('📄 Resume loaded for AI assistant');
          }
        } catch (error) {
          console.log('Could not load resume text for AI assistant');
        }
      }
    };

    loadResumeText();
  }, [userType]);

  // Generate initial welcome message based on user type
  const getWelcomeMessage = (): React.ReactNode => {
    if (userType === 'employee') {
      return (
        <div className="space-y-2">
          <p className="text-sm">Hi {userName}, I'm your AI career assistant.</p>
          {resumeText ? (
            <p className="text-sm">I have access to your resume for personalized advice.</p>
          ) : (
            <p className="text-sm">Upload your resume to get personalized career guidance.</p>
          )}
          <p className="text-sm font-medium">How can I help with your career today?</p>
        </div>
      );
    } else {
      return (
        <div className="space-y-2">
          <p className="text-sm">Hi {userName}, I'm your AI recruiting assistant.</p>
          <div className="text-sm space-y-1">
            <p className="font-medium">I can help with:</p>
            <p>• Candidate evaluation strategies</p>
            <p>• Job posting optimization</p>
            <p>• Interview techniques</p>
            <p>• Recruitment best practices</p>
          </div>
          <p className="text-sm font-medium">What would you like to know?</p>
        </div>
      );
    }
  };

  // Initialize welcome message when component first opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: getWelcomeMessage(),
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, userType, userName, resumeText]);

  const formatAIResponse = (response: string): React.ReactNode => {
    // Split response into lines and format for better readability
    const lines = response.split('\n').filter(line => line.trim());
    
    return (
      <div className="space-y-1.5 text-sm leading-relaxed">
        {lines.map((line, index) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return null;
          
          // Check if line looks like a bullet point or category
          if (trimmedLine.includes(':') && trimmedLine.length < 50) {
            return (
              <p key={index} className="font-medium text-primary">
                {trimmedLine}
              </p>
            );
          }
          
          // Format bullet points
          if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
            return (
              <p key={index} className="pl-2">
                {trimmedLine}
              </p>
            );
          }
          
          // Regular sentences
          return (
            <p key={index} className="break-words">
              {trimmedLine}
            </p>
          );
        })}
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await getAIAssistantResponse({
        userInput: input,
        resumeText: resumeText,
        userType: userType,
        userName: userName
      });

      if (response.success && response.response) {
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          content: formatAIResponse(response.response),
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        toast({
          title: "AI Assistant Error",
          description: response.error || "Failed to get response from AI assistant",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to connect to AI assistant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }

    setInput("");
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button 
              size="icon" 
              className={`rounded-full h-14 w-14 shadow-lg group ${isOpen ? 'bg-primary' : 'bg-white border'}`}
            >
              <Badge 
                className="absolute -top-1 -right-1 bg-primary px-1.5 text-[10px] group-hover:scale-110 transition-all"
              >
                <Sparkles size={10} className="mr-0.5" />
                AI
              </Badge>
              <Bot size={22} className={`${isOpen ? 'text-white' : 'text-primary'} transition-colors`} />
            </Button>
          </PopoverTrigger>
          
          <PopoverContent 
            side="left" 
            align="end" 
            className="w-96 p-0 shadow-lg border rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary/10 p-3 flex items-center justify-between border-b">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-primary/20">
                  <Bot size={16} className="text-primary" />
                </Avatar>
                <div>
                  <div className="text-sm font-medium">AI Assistant</div>
                  <div className="text-xs text-muted-foreground">Powered by GPT-4o mini</div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => setIsOpen(false)}
              >
                <X size={16} />
              </Button>
            </div>
            
            {/* Messages */}
            <div className="h-[360px] overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[85%] ${
                    message.isUser
                      ? 'ml-auto'
                      : 'mr-auto'
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      message.isUser
                        ? 'bg-primary/5 text-right'
                        : 'bg-muted'
                    }`}
                    style={{
                      maxWidth: '320px',
                      lineHeight: '1.6',
                      fontSize: '14px'
                    }}
                  >
                    {message.isUser ? (
                      <div className="text-sm break-words">{message.content}</div>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="max-w-[85%] mr-auto">
                  <div className="bg-muted p-3 rounded-lg flex items-center gap-2 text-sm">
                    <Loader2 size={14} className="animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t">
              <div className="flex gap-2">
                <Textarea 
                  placeholder="Ask me anything..." 
                  className="min-h-[40px] resize-none text-sm py-2"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!input.trim() || isLoading}
                  className="h-10 w-10 shrink-0"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <SendHorizontal size={16} />
                  )}
                </Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default AIAssistant;
