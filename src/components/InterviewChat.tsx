
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Video, Mic, MicOff, VideoOff, Send, ExternalLink, Phone, MoreVertical, Maximize2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender: 'me' | 'other';
  text: string;
  timestamp: Date;
  type?: 'text' | 'system';
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
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'other',
      text: `Hi! I'm ready for our interview session.`,
      timestamp: new Date(Date.now() - 300000),
      type: 'text'
    },
    {
      id: '2',
      sender: 'me',
      text: 'Great! Let me start the video call.',
      timestamp: new Date(Date.now() - 240000),
      type: 'text'
    },
    {
      id: '3',
      sender: 'other',
      text: 'Perfect! I can see the video area is ready. Should we begin with the technical questions?',
      timestamp: new Date(Date.now() - 180000),
      type: 'text'
    },
    {
      id: '4',
      sender: 'me',
      text: 'Yes, let\'s start. Can you tell me about your experience with React?',
      timestamp: new Date(Date.now() - 120000),
      type: 'text'
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
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');

      // Simulate response with delay
      setTimeout(() => {
        const responses = [
          'Thanks for your message! I appreciate the communication.',
          'That\'s a great question. Let me think about that for a moment.',
          'I understand. Could you elaborate on that point?',
          'Yes, I have experience with that technology.',
          'That sounds like an interesting approach to the problem.'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'other',
          text: randomResponse,
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 1000 + Math.random() * 2000);
    }
  };

  const joinZoomMeeting = () => {
    window.open('https://app.zoom.us/wc/82868055331/start?fromPWA=1&pwd=CNZzNwBGdaEgJ08MxEg1k25FsvD1ck.1', '_blank');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleVideoExpanded = () => {
    setIsVideoExpanded(!isVideoExpanded);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-14 w-14 ring-3 ring-white/30 shadow-lg">
                <AvatarImage 
                  src={interviewee.profileImage} 
                  alt={interviewee.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-blue-500 text-white font-semibold text-lg">
                  {interviewee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-semibold text-xl">{interviewee.name}</h3>
              <p className="text-blue-100 text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Interview Session • Online
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={joinZoomMeeting} 
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-md gap-2 font-medium px-6 py-2"
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
                className={`text-white hover:bg-white/20 transition-all duration-200 ${!videoEnabled ? "bg-red-500 hover:bg-red-600" : ""}`}
                title={videoEnabled ? "Turn off camera" : "Turn on camera"}
              >
                {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
              </Button>
              <Button 
                onClick={toggleMic} 
                variant="ghost" 
                size="icon" 
                className={`text-white hover:bg-white/20 transition-all duration-200 ${!micEnabled ? "bg-red-500 hover:bg-red-600" : ""}`}
                title={micEnabled ? "Mute microphone" : "Unmute microphone"}
              >
                {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 p-4 min-h-0">
        <div className={`grid gap-4 h-full ${isVideoExpanded ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {/* Video Area */}
          <div className={`${isVideoExpanded ? 'col-span-1' : 'lg:col-span-2'} h-full`}>
            <Card className="h-full bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-blue-200/20 shadow-xl overflow-hidden relative">
              <Button
                onClick={toggleVideoExpanded}
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                title={isVideoExpanded ? "Exit fullscreen" : "Expand video"}
              >
                <Maximize2 size={20} />
              </Button>
              
              <ScrollArea className="h-full">
                <div className="h-full flex flex-col justify-center items-center text-white p-8">
                  <div className="text-center max-w-md">
                    <div className="bg-blue-600/20 p-8 rounded-full mb-8 inline-block backdrop-blur-sm">
                      <Video size={64} className="text-blue-400" />
                    </div>
                    <h3 className="text-3xl font-semibold mb-4">Video Interview</h3>
                    <p className="text-slate-300 mb-8 text-lg leading-relaxed">
                      Click "Join Zoom" to start the video call and begin your interview session
                    </p>
                    <Button 
                      onClick={joinZoomMeeting} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
                    >
                      <ExternalLink size={24} className="mr-3" />
                      Connect to Zoom
                    </Button>
                    
                    {/* Video Status Indicators */}
                    <div className="flex justify-center gap-6 mt-8">
                      <div className="flex items-center gap-2 text-sm">
                        {videoEnabled ? (
                          <Video size={16} className="text-green-400" />
                        ) : (
                          <VideoOff size={16} className="text-red-400" />
                        )}
                        <span className={videoEnabled ? "text-green-400" : "text-red-400"}>
                          Camera {videoEnabled ? "On" : "Off"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {micEnabled ? (
                          <Mic size={16} className="text-green-400" />
                        ) : (
                          <MicOff size={16} className="text-red-400" />
                        )}
                        <span className={micEnabled ? "text-green-400" : "text-red-400"}>
                          Mic {micEnabled ? "On" : "Off"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Chat Messages */}
          {!isVideoExpanded && (
            <div className="lg:col-span-1 h-full">
              <Card className="h-full flex flex-col bg-white/90 backdrop-blur-sm border-2 border-blue-200/50 shadow-xl">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-t-lg">
                  <h4 className="font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Chat Messages
                    </div>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8">
                      <MoreVertical size={16} />
                    </Button>
                  </h4>
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md ${
                            msg.sender === 'me'
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200/50'
                          }`}
                        >
                          <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                          <p className={`text-xs mt-2 ${
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
                
                {/* Enhanced Message Input */}
                <div className="p-4 border-t bg-gray-50/80 backdrop-blur-sm rounded-b-lg">
                  <form onSubmit={sendMessage} className="flex gap-3">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 border-blue-200 focus:border-blue-400 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 transition-all duration-200 focus:shadow-md"
                    />
                    <Button 
                      type="submit" 
                      size="icon" 
                      disabled={!message.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <Send size={18} />
                    </Button>
                  </form>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Press Enter to send • {messages.length} messages
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewChat;
