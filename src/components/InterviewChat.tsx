
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Video, Mic, MicOff, VideoOff, Send, ExternalLink, Globe, Loader2 } from 'lucide-react';
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

  const goToZoom = () => {
    window.open('https://zoom.us', '_blank');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full max-h-[80vh] overflow-y-auto bg-white rounded-lg">
      {/* Header */}
      <div className="bg-primary text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12 ring-2 ring-white/30">
                <AvatarImage 
                  src={interviewee.profileImage} 
                  alt={interviewee.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary-foreground text-primary font-semibold">
                  {interviewee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
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
            <Button 
              onClick={toggleVideo} 
              variant="ghost" 
              size="icon" 
              className={`text-white hover:bg-white/20 transition-colors ${
                !videoEnabled ? "bg-red-500/80 hover:bg-red-600/80" : ""
              }`}
              title={videoEnabled ? "Turn off camera" : "Turn on camera"}
            >
              {videoEnabled ? <Video size={18} /> : <VideoOff size={18} />}
            </Button>
            <Button 
              onClick={toggleMic} 
              variant="ghost" 
              size="icon" 
              className={`text-white hover:bg-white/20 transition-colors ${
                !micEnabled ? "bg-red-500/80 hover:bg-red-600/80" : ""
              }`}
              title={micEnabled ? "Mute microphone" : "Unmute microphone"}
            >
              {micEnabled ? <Mic size={18} /> : <MicOff size={18} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content Container */}
      <div className="p-6 space-y-6">
        {/* Video Area */}
        <Card className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 border border-blue-200 shadow-lg">
          <div className="h-80 flex flex-col justify-center items-center text-white p-8">
            <div className="text-center max-w-md">
              <div className="bg-blue-600/30 p-8 rounded-full mb-6 inline-block backdrop-blur-sm border border-white/10">
                <Video size={48} className="text-blue-200" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-blue-100">
                Video Interview Ready
              </h3>
              <p className="text-blue-200 mb-6 leading-relaxed">
                Ready to begin your interview session? Click "Connect to Zoom" to start the video call
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={joinZoomMeeting} 
                  disabled={isConnecting}
                  className="bg-white text-blue-600 hover:bg-blue-50 shadow-md font-medium px-6 py-2 transition-all duration-200 hover:shadow-lg focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <ExternalLink size={16} className="mr-2" />
                      Connect to Zoom
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={goToZoom}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 font-medium px-6 py-2 transition-all duration-200 focus:ring-2 focus:ring-blue-300"
                >
                  <Globe size={16} className="mr-2" />
                  Go to Zoom
                </Button>
              </div>
              
              {/* Status Indicators */}
              <div className="flex justify-center gap-6 mt-6 p-3 bg-black/20 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-2 text-sm">
                  {videoEnabled ? (
                    <Video size={14} className="text-green-400" />
                  ) : (
                    <VideoOff size={14} className="text-red-400" />
                  )}
                  <span className={`text-xs font-medium ${videoEnabled ? "text-green-400" : "text-red-400"}`}>
                    Camera {videoEnabled ? "Ready" : "Off"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {micEnabled ? (
                    <Mic size={14} className="text-green-400" />
                  ) : (
                    <MicOff size={14} className="text-red-400" />
                  )}
                  <span className={`text-xs font-medium ${micEnabled ? "text-green-400" : "text-red-400"}`}>
                    Mic {micEnabled ? "Ready" : "Muted"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Chat Section */}
        <Card className="border border-gray-200 shadow-sm bg-white">
          <div className="bg-gray-50 px-4 py-3 border-b rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <h4 className="font-semibold text-gray-900">Interview Chat</h4>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                  {messages.length} messages
                </span>
              </div>
            </div>
          </div>
          
          {/* Messages Area - Fixed Height with Scroll */}
          <div className="h-80 overflow-y-auto p-4 bg-gray-50/50">
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md ${
                      msg.sender === 'me'
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm leading-relaxed mb-1">{msg.text}</p>
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
          
          {/* Message Input - Fixed at Bottom */}
          <div className="p-4 border-t bg-white rounded-b-lg">
            <form onSubmit={sendMessage} className="flex gap-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border-gray-300 focus:border-primary focus:ring-primary transition-colors"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!message.trim()}
                className="bg-primary hover:bg-primary/90 shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-50 focus:ring-2 focus:ring-primary/30"
              >
                <Send size={16} />
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • End-to-end encrypted
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InterviewChat;
