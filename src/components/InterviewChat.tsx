
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
    <div className="h-full max-h-[85vh] overflow-y-auto bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sticky top-0 z-10">
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
              className={`text-white hover:bg-white/20 transition-all duration-200 ${
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
              className={`text-white hover:bg-white/20 transition-all duration-200 ${
                !micEnabled ? "bg-red-500/80 hover:bg-red-600/80" : ""
              }`}
              title={micEnabled ? "Mute microphone" : "Unmute microphone"}
            >
              {micEnabled ? <Mic size={18} /> : <MicOff size={18} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Video Area */}
      <div className="p-6">
        <Card className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 border border-blue-200 shadow-xl">
          <div className="h-96 flex flex-col justify-center items-center text-white p-8 relative">
            <div className="text-center max-w-md">
              <div className="bg-blue-600/40 p-8 rounded-full mb-6 inline-block backdrop-blur-sm border border-white/20 shadow-lg">
                <Video size={56} className="text-blue-100" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-blue-50">
                Video Interview Ready
              </h3>
              <p className="text-blue-200 mb-8 leading-relaxed text-lg">
                Ready to begin your interview session? Click "Connect to Zoom" to start the video call
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={joinZoomMeeting} 
                  disabled={isConnecting}
                  className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg font-semibold px-8 py-3 text-base transition-all duration-200 hover:shadow-xl focus:ring-4 focus:ring-blue-300/50 disabled:opacity-50 rounded-lg"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <ExternalLink size={18} className="mr-2" />
                      Connect to Zoom
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={goToZoom}
                  variant="outline"
                  className="border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60 font-semibold px-8 py-3 text-base transition-all duration-200 focus:ring-4 focus:ring-blue-300/50 rounded-lg backdrop-blur-sm"
                >
                  <Globe size={18} className="mr-2" />
                  Go to Zoom
                </Button>
              </div>
              
              {/* Status Indicators */}
              <div className="flex justify-center gap-8 mt-8 p-4 bg-black/30 rounded-xl backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-2">
                  {videoEnabled ? (
                    <Video size={16} className="text-green-400" />
                  ) : (
                    <VideoOff size={16} className="text-red-400" />
                  )}
                  <span className={`text-sm font-medium ${videoEnabled ? "text-green-400" : "text-red-400"}`}>
                    Camera {videoEnabled ? "Ready" : "Off"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {micEnabled ? (
                    <Mic size={16} className="text-green-400" />
                  ) : (
                    <MicOff size={16} className="text-red-400" />
                  )}
                  <span className={`text-sm font-medium ${micEnabled ? "text-green-400" : "text-red-400"}`}>
                    Mic {micEnabled ? "Ready" : "Muted"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Chat Section */}
      <div className="px-6 pb-6">
        <Card className="border border-gray-200 shadow-lg bg-white">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h4 className="font-semibold text-gray-900 text-lg">Interview Chat</h4>
                <span className="text-sm text-gray-600 bg-gray-200 px-3 py-1 rounded-full font-medium">
                  {messages.length} messages
                </span>
              </div>
            </div>
          </div>
          
          {/* Messages Area - Fixed Height with Scroll */}
          <div className="h-80 overflow-y-auto p-6 bg-gray-50/30">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-md transition-all duration-200 hover:shadow-lg ${
                      msg.sender === 'me'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
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
          
          {/* Message Input - Fixed at Bottom */}
          <div className="p-6 border-t bg-white rounded-b-lg">
            <form onSubmit={sendMessage} className="flex gap-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 rounded-lg px-4 py-3"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!message.trim()}
                className="bg-blue-600 hover:bg-blue-700 shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-50 focus:ring-4 focus:ring-blue-300/50 rounded-lg px-4 py-3"
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
  );
};

export default InterviewChat;
