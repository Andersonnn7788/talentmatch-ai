
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Video, Mic, MicOff, VideoOff, Send, ExternalLink, Phone } from 'lucide-react';
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
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: '2',
      sender: 'me',
      text: 'Great! Let me start the video call.',
      timestamp: new Date(Date.now() - 240000)
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
      description: "Please provide your Zoom API credentials to enable video calls.",
      duration: 5000
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-12 w-12 ring-2 ring-white/20">
                <AvatarImage src={interviewee.profileImage} alt={interviewee.name} />
                <AvatarFallback className="bg-blue-500 text-white font-semibold">
                  {interviewee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{interviewee.name}</h3>
              <p className="text-blue-100 text-sm">Interview Session</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={joinZoomMeeting} 
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-md gap-2 font-medium"
              size="sm"
            >
              <ExternalLink size={16} />
              Join Zoom
            </Button>
            <div className="flex gap-2">
              <Button 
                onClick={toggleVideo} 
                variant="ghost" 
                size="icon" 
                className={`text-white hover:bg-white/20 ${!videoEnabled ? "bg-red-500 hover:bg-red-600" : ""}`}
              >
                {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
              </Button>
              <Button 
                onClick={toggleMic} 
                variant="ghost" 
                size="icon" 
                className={`text-white hover:bg-white/20 ${!micEnabled ? "bg-red-500 hover:bg-red-600" : ""}`}
              >
                {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Area */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Main Video Area */}
          <div className="lg:col-span-2">
            <Card className="h-full bg-gradient-to-br from-slate-900 to-slate-800 border-blue-200 shadow-xl overflow-hidden">
              <div className="h-full flex flex-col justify-center items-center text-white p-8">
                <div className="text-center">
                  <div className="bg-blue-600/20 p-6 rounded-full mb-6 inline-block">
                    <Video size={48} className="text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">Video Interview</h3>
                  <p className="text-slate-300 mb-6 text-lg">
                    Click "Join Zoom" to start the video call
                  </p>
                  <Button 
                    onClick={joinZoomMeeting} 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium shadow-lg"
                  >
                    <ExternalLink size={20} className="mr-3" />
                    Connect to Zoom
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Chat Messages */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-t-lg">
                <h4 className="font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Chat Messages
                </h4>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                          msg.sender === 'me'
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        <p className="text-sm font-medium">{msg.text}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Message Input */}
              <div className="p-4 border-t bg-gray-50/80 backdrop-blur-sm rounded-b-lg">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border-blue-200 focus:border-blue-400 bg-white/80"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={!message.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  >
                    <Send size={18} />
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewChat;
