
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Bot, SendHorizontal, X, Sparkles } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface AIAssistantProps {
  userType: 'employee' | 'recruiter';
  userName?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ userType, userName = "User" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [aiResponses, setAiResponses] = useState<React.ReactNode[]>([]);

  // Generate initial welcome message based on user type
  const getWelcomeMessage = () => {
    if (userType === 'employee') {
      return (
        <div className="space-y-3">
          <p>Hi {userName}, I am your AI career assistant.</p>
          <p>After analyzing your profile, I found that:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Your skills match with 18 open positions in your area.</li>
            <li>Adding <strong>cloud computing</strong> skills could increase your match rate by 35%.</li>
          </ul>
          <p>How can I help with your job search today?</p>
        </div>
      );
    } else {
      return (
        <div className="space-y-3">
          <p>Hi {userName}, I am your AI recruiting assistant.</p>
          <p>Based on your current positions:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>You have 12 qualified candidates for the Senior Developer role.</li>
            <li>Adding <strong>remote work options</strong> could increase your applicant pool by 40%.</li>
          </ul>
          <p>How can I help with your recruiting efforts today?</p>
        </div>
      );
    }
  };

  const simulateAIResponse = (question: string) => {
    // Simple response simulation based on keywords
    if (question.toLowerCase().includes("company") || question.toLowerCase().includes("companies")) {
      if (userType === 'employee') {
        return (
          <div className="space-y-2">
            <p>Based on your preference for large-scale companies, I recommend:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>TechCorp Inc.</strong> - They're hiring for your skills and offer competitive benefits.</li>
              <li><strong>DataWorks Labs</strong> - Their salary range matches your expectations.</li>
            </ul>
            <p>Would you like me to prepare your application for these companies?</p>
          </div>
        );
      } else {
        return (
          <div className="space-y-2">
            <p>To attract candidates from large companies, consider:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Highlighting your company's growth trajectory</li>
              <li>Emphasizing your competitive benefits package</li>
              <li>Showcasing your modern tech stack and innovation</li>
            </ul>
          </div>
        );
      }
    } else if (question.toLowerCase().includes("salary") || question.toLowerCase().includes("pay")) {
      if (userType === 'employee') {
        return (
          <div className="space-y-2">
            <p>Based on your experience and skills, your market value is <strong>$95K-$120K</strong>.</p>
            <p>Top paying companies in your field:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>TechCorp Inc.</strong> - $120K-$150K</li>
              <li><strong>DataWorks Labs</strong> - $110K-$135K</li>
            </ul>
          </div>
        );
      } else {
        return (
          <div className="space-y-2">
            <p>Current market rates for the positions you're hiring:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Senior Developer:</strong> $120K-$150K</li>
              <li><strong>UX Designer:</strong> $90K-$120K</li>
              <li><strong>Product Manager:</strong> $110K-$140K</li>
            </ul>
            <p>Your offered salaries are 5% below market average, which may impact application rates.</p>
          </div>
        );
      }
    } else {
      return (
        <div className="space-y-2">
          <p>I'm here to help with your {userType === 'employee' ? 'job search' : 'recruitment needs'}. You can ask me about:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Job matches and requirements</li>
            <li>Salary insights and negotiations</li>
            <li>Interview preparation</li>
            <li>{userType === 'employee' ? 'Career growth opportunities' : 'Candidate sourcing strategies'}</li>
          </ul>
        </div>
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setAiResponses(prev => [...prev, 
      <div key={`user-${Date.now()}`} className="bg-primary/5 p-3 rounded-lg ml-auto max-w-[80%] text-sm">
        {input}
      </div>
    ]);

    // Simulate AI response
    setTimeout(() => {
      setAiResponses(prev => [...prev,
        <div key={`ai-${Date.now()}`} className="bg-muted p-3 rounded-lg mr-auto max-w-[80%] text-sm">
          {simulateAIResponse(input)}
        </div>
      ]);
    }, 500);

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
            className="w-80 p-0 shadow-lg border rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary/10 p-3 flex items-center justify-between border-b">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-primary/20">
                  <Bot size={16} className="text-primary" />
                </Avatar>
                <div>
                  <div className="text-sm font-medium">AI Assistant</div>
                  <div className="text-xs text-muted-foreground">Powered by TalentMatch.AI</div>
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
            <div className="h-[320px] overflow-y-auto p-3 space-y-3">
              <div className="bg-muted p-3 rounded-lg mr-auto max-w-[80%] text-sm">
                {getWelcomeMessage()}
              </div>
              
              {aiResponses.map((response, index) => (
                <React.Fragment key={index}>{response}</React.Fragment>
              ))}
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
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!input.trim()}
                  className="h-10 w-10 shrink-0"
                >
                  <SendHorizontal size={16} />
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
