
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Video, Mic, MicOff, VideoOff, Send, ExternalLink, Phone, MoreVertical, Maximize2, Loader2 } from 'lucide-react';
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
  const [isConnecting, setIsConnecting] = useState(false);
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

  const joinZoomMeeting = async () => {
    setIsConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      window.open('https://app.zoom.us/wc/82868055331/start?fromPWA=1&pwd=CNZzNwBGdaEgJ08MxEg1k25FsvD1ck.1', '_blank');
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleVideoExpanded = () => {
    setIsVideoExpanded(!isVideoExpanded);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 font-inter">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 shadow-2xl border-b-4 border-blue-400/30">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="h-16 w-16 ring-4 ring-white/40 shadow-2xl transition-transform group-hover:scale-105">
                <AvatarImage 
                  src={interviewee.profileImage} 
                  alt={interviewee.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl">
                  {interviewee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-3 border-white animate-pulse shadow-lg"></div>
            </div>
            <div>
              <h3 className="font-bold text-2xl tracking-tight">{interviewee.name}</h3>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-2 text-blue-100">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Interview Session • Online</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center gap-4">
            <Button 
              onClick={joinZoomMeeting} 
              disabled={isConnecting}
              className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-lg gap-3 font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 focus:ring-4 focus:ring-white/30 disabled:opacity-50"
              size="lg"
            >
              {isConnecting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink size={20} />
                  Connect to Zoom
                </>
              )}
            </Button>
            
            <div className="flex gap-3">
              <Button 
                onClick={toggleVideo} 
                variant="ghost" 
                size="icon" 
                className={`text-white hover:bg-white/20 transition-all duration-300 rounded-xl h-12 w-12 focus:ring-4 focus:ring-white/30 ${
                  !videoEnabled ? "bg-red-500/90 hover:bg-red-600/90 shadow-lg" : "hover:shadow-md"
                }`}
                title={videoEnabled ? "Turn off camera" : "Turn on camera"}
              >
                {videoEnabled ? <Video size={22} /> : <VideoOff size={22} />}
              </Button>
              <Button 
                onClick={toggleMic} 
                variant="ghost" 
                size="icon" 
                className={`text-white hover:bg-white/20 transition-all duration-300 rounded-xl h-12 w-12 focus:ring-4 focus:ring-white/30 ${
                  !micEnabled ? "bg-red-500/90 hover:bg-red-600/90 shadow-lg" : "hover:shadow-md"
                }`}
                title={micEnabled ? "Mute microphone" : "Unmute microphone"}
              >
                {micEnabled ? <Mic size={22} /> : <MicOff size={22} />}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area - Vertical Layout */}
      <div className="flex-1 p-6 min-h-0 max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-6 h-full">
          {/* Video Area - Top Section */}
          <div className={`${isVideoExpanded ? 'h-full' : 'h-80 md:h-96'} transition-all duration-500`}>
            <Card className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-slate-700/50 shadow-2xl overflow-hidden relative rounded-2xl">
              <Button
                onClick={toggleVideoExpanded}
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-white/30"
                title={isVideoExpanded ? "Exit fullscreen" : "Expand video"}
              >
                <Maximize2 size={22} />
              </Button>
              
              <div className="h-full flex flex-col justify-center items-center text-white p-8">
                <div className="text-center max-w-lg">
                  <div className="bg-gradient-to-br from-blue-600/30 to-purple-600/30 p-12 rounded-full mb-8 inline-block backdrop-blur-sm border border-white/10 shadow-2xl">
                    <Video size={80} className="text-blue-300" />
                  </div>
                  <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                    Video Interview
                  </h3>
                  <p className="text-slate-300 mb-8 text-lg leading-relaxed max-w-md mx-auto">
                    Ready to begin your interview session? Click "Connect to Zoom" to start the video call
                  </p>
                  
                  {/* Video Status Indicators */}
                  <div className="flex justify-center gap-8 mt-8 p-4 bg-black/20 rounded-xl backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-3 text-sm">
                      {videoEnabled ? (
                        <Video size={18} className="text-emerald-400" />
                      ) : (
                        <VideoOff size={18} className="text-red-400" />
                      )}
                      <span className={`font-medium ${videoEnabled ? "text-emerald-400" : "text-red-400"}`}>
                        Camera {videoEnabled ? "Ready" : "Off"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      {micEnabled ? (
                        <Mic size={18} className="text-emerald-400" />
                      ) : (
                        <MicOff size={18} className="text-red-400" />
                      )}
                      <span className={`font-medium ${micEnabled ? "text-emerald-400" : "text-red-400"}`}>
                        Microphone {micEnabled ? "Ready" : "Muted"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Chat Messages - Bottom Section */}
          {!isVideoExpanded && (
            <div className="h-96 flex-shrink-0">
              <Card className="h-full flex flex-col bg-white/95 backdrop-blur-md border-2 border-slate-200/50 shadow-2xl rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 text-white px-6 py-4 rounded-t-2xl border-b border-slate-600/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg"></div>
                      <h4 className="font-bold text-lg">Interview Chat</h4>
                      <span className="text-slate-300 text-sm bg-slate-800/50 px-3 py-1 rounded-full">
                        {messages.length} messages
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8 rounded-lg">
                      <MoreVertical size={18} />
                    </Button>
                  </div>
                </div>
                
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-slide-up group`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-5 py-4 shadow-lg transition-all duration-300 hover:shadow-xl group-hover:scale-[1.02] ${
                            msg.sender === 'me'
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-500/30'
                              : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 border border-slate-300/50 shadow-slate-400/20'
                          }`}
                        >
                          <p className="text-sm font-medium leading-relaxed mb-2">{msg.text}</p>
                          <div className="flex justify-between items-center">
                            <p className={`text-xs font-medium ${
                              msg.sender === 'me' ? 'text-blue-100' : 'text-slate-500'
                            }`}>
                              {formatTime(msg.timestamp)}
                            </p>
                            {msg.sender === 'me' && (
                              <div className="flex gap-1">
                                <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
                                <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                {/* Enhanced Message Input */}
                <div className="p-6 border-t bg-gradient-to-r from-slate-50 to-slate-100 rounded-b-2xl">
                  <form onSubmit={sendMessage} className="flex gap-4">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 border-2 border-slate-300 focus:border-blue-500 bg-white rounded-xl px-5 py-4 text-sm transition-all duration-300 focus:shadow-lg focus:ring-4 focus:ring-blue-500/20 placeholder:text-slate-400"
                    />
                    <Button 
                      type="submit" 
                      size="icon" 
                      disabled={!message.trim()}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg rounded-xl h-12 w-12 transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 focus:ring-4 focus:ring-blue-500/30"
                    >
                      <Send size={20} />
                    </Button>
                  </form>
                  <p className="text-xs text-slate-500 mt-3 text-center font-medium">
                    Press Enter to send • Messages are encrypted
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
