import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Video, Mic, MicOff, VideoOff, Send, ExternalLink, Loader2 } from 'lucide-react';
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
    setTimeout(() => {
      setIsConnecting(false);
      window.open('https://app.zoom.us/wc/82868055331/start?fromPWA=1&pwd=CNZzNwBGdaEgJ08MxEg1k25FsvD1ck.1', '_blank');
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <TooltipProvider>
      <div className="h-full max-h-[85vh] overflow-y-auto bg-gradient-to-br from-blue-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sticky top-0 z-10 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-white/30">
                  <AvatarImage 
                    src={interviewee.profileImage} 
                    alt={interviewee.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-blue-500 text-white font-semibold">
                    {interviewee.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{interviewee.name}</h3>
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Interview Session • Online</span>
                </div>
              </div>
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={toggleVideo} 
                    variant="ghost" 
                    size="icon" 
                    className={`text-white hover:bg-white/20 transition-all duration-200 ${
                      !videoEnabled ? "bg-red-500/80 hover:bg-red-600/80" : ""
                    }`}
                  >
                    {videoEnabled ? <Video size={18} /> : <VideoOff size={18} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{videoEnabled ? "Turn off camera" : "Turn on camera"}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={toggleMic} 
                    variant="ghost" 
                    size="icon" 
                    className={`text-white hover:bg-white/20 transition-all duration-200 ${
                      !micEnabled ? "bg-red-500/80 hover:bg-red-600/80" : ""
                    }`}
                  >
                    {micEnabled ? <Mic size={18} /> : <MicOff size={18} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{micEnabled ? "Mute microphone" : "Unmute microphone"}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
        
        {/* Video Area */}
        <div className="p-6">
          <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 border-0 shadow-2xl overflow-hidden">
            <div className="h-96 flex flex-col justify-center items-center text-white p-8 relative">
              <div className="text-center max-w-md">
                <div className="bg-white/10 p-6 rounded-full mb-6 inline-block backdrop-blur-sm border border-white/20 shadow-lg">
                  <Video size={48} className="text-blue-100" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">
                  Video Interview Ready
                </h3>
                <p className="text-blue-100 mb-8 leading-relaxed">
                  Ready to begin your interview session? Click below to start the video call
                </p>
                
                {/* Single Connect Button - Centered */}
                <div className="flex justify-center mb-8">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={joinZoomMeeting} 
                        disabled={isConnecting}
                        className="bg-white text-blue-700 hover:bg-blue-50 hover:shadow-xl shadow-lg font-semibold px-8 py-4 text-base transition-all duration-300 focus:ring-4 focus:ring-blue-300/50 disabled:opacity-50 rounded-xl transform hover:scale-105 disabled:hover:scale-100"
                        size="lg"
                      >
                        {isConnecting ? (
                          <>
                            <Loader2 size={20} className="animate-spin mr-2" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <ExternalLink size={20} className="mr-2" />
                            Connect to Zoom
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Opens a secure Zoom session in a new tab</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                {/* Status Indicators */}
                <div className="flex justify-center gap-8 p-6 bg-black/20 rounded-2xl backdrop-blur-sm border border-white/10 shadow-inner">
                  <div className="flex items-center gap-3">
                    {videoEnabled ? (
                      <Video size={18} className="text-green-400" />
                    ) : (
                      <VideoOff size={18} className="text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${videoEnabled ? "text-green-400" : "text-red-400"}`}>
                      Camera {videoEnabled ? "Ready" : "Off"}
                    </span>
                    {videoEnabled && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
                  </div>
                  <div className="flex items-center gap-3">
                    {micEnabled ? (
                      <Mic size={18} className="text-green-400" />
                    ) : (
                      <MicOff size={18} className="text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${micEnabled ? "text-green-400" : "text-red-400"}`}>
                      Mic {micEnabled ? "Ready" : "Muted"}
                    </span>
                    {micEnabled && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Chat Section */}
        <div className="px-6 pb-6">
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <h4 className="font-semibold text-lg">Interview Chat</h4>
                  <span className="text-sm text-blue-100 bg-white/20 px-3 py-1 rounded-full font-medium">
                    {messages.length} messages
                  </span>
                </div>
              </div>
            </div>
            
            {/* Messages Area */}
            <div className="h-80 overflow-y-auto p-6 bg-gradient-to-b from-blue-50/30 to-gray-50/30">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-md transition-all duration-200 hover:shadow-lg ${
                        msg.sender === 'me'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-200'
                          : 'bg-white text-gray-800 border border-gray-100 shadow-gray-200'
                      }`}
                    >
                      <p className="text-sm leading-relaxed mb-2">{msg.text}</p>
                      <p className={`text-xs ${
                        msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Message Input */}
            <div className="p-6 border-t border-gray-100 bg-white rounded-b-xl">
              <form onSubmit={sendMessage} className="flex gap-3">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!message.trim()}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-50 focus:ring-4 focus:ring-blue-300/50 rounded-xl px-4 py-3 transform hover:scale-105 disabled:hover:scale-100"
                >
                  <Send size={18} />
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Press Enter to send • End-to-end encrypted
              </p>
            </div>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default InterviewChat;
