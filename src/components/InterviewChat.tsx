
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Video, Mic, MicOff, VideoOff, Send, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender: 'me' | 'other';
  text: string;
  timestamp: Date;
}

interface InterviewChatProps {
  interviewee: {
    name: string;
    profileImage?: string;
  };
}

const InterviewChat = ({ interviewee }: InterviewChatProps) => {
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'other',
      text: `Hi! I'm ready for our interview session.`,
      timestamp: new Date(Date.now() - 300000) // 5 minutes ago
    },
    {
      id: '2',
      sender: 'me',
      text: 'Great! Let me start the video call.',
      timestamp: new Date(Date.now() - 240000) // 4 minutes ago
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleMic = () => {
    setMicEnabled(!micEnabled);
    toast({
      title: micEnabled ? "Microphone muted" : "Microphone unmuted",
      description: micEnabled ? "Your microphone is now muted" : "Your microphone is now active"
    });
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    toast({
      title: videoEnabled ? "Camera turned off" : "Camera turned on",
      description: videoEnabled ? "Your camera is now off" : "Your camera is now active"
    });
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'me',
        text: message.trim(),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');

      // Simulate a response after 2 seconds
      setTimeout(() => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'other',
          text: 'Thanks for your message! I appreciate the communication.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 2000);
    }
  };

  const joinZoomMeeting = () => {
    toast({
      title: "Zoom Integration Required",
      description: "Please connect to Supabase to enable Zoom API integration for video calls.",
      duration: 5000
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-t-lg flex items-center justify-between border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={interviewee.profileImage} alt={interviewee.name} />
            <AvatarFallback>{interviewee.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <span className="font-medium">{interviewee.name}</span>
            <div className="text-xs text-muted-foreground">Interview Session</div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={joinZoomMeeting} 
            variant="outline" 
            size="sm" 
            className="gap-2"
          >
            <ExternalLink size={16} />
            Join Zoom
          </Button>
          <Button 
            onClick={toggleVideo} 
            variant="ghost" 
            size="icon" 
            className={!videoEnabled ? "bg-red-100 dark:bg-red-900/20 text-red-600" : ""}
          >
            {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
          </Button>
          <Button 
            onClick={toggleMic} 
            variant="ghost" 
            size="icon" 
            className={!micEnabled ? "bg-red-100 dark:bg-red-900/20 text-red-600" : ""}
          >
            {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </Button>
        </div>
      </div>
      
      {/* Video Area */}
      <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 flex flex-col">
        <div className="flex-1 mb-4 bg-black rounded-lg flex justify-center items-center min-h-[200px]">
          <div className="text-center text-white">
            <Video size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Video Interview</h3>
            <p className="text-sm text-gray-300 mb-4">
              Click "Join Zoom" to start the video call
            </p>
            <Button onClick={joinZoomMeeting} variant="secondary" size="sm">
              <ExternalLink size={16} className="mr-2" />
              Connect to Zoom
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <Card className="flex-1 min-h-[200px] flex flex-col">
          <div className="p-3 border-b">
            <h4 className="font-medium text-sm">Chat Messages</h4>
          </div>
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 ${
                      msg.sender === 'me'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </Card>
      </div>
      
      {/* Message Input */}
      <div className="p-4 border-t bg-background">
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={false}
          />
          <Button type="submit" size="icon" disabled={!message.trim()}>
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default InterviewChat;
