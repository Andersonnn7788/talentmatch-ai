
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Video, Mic, MicOff, VideoOff, Send } from 'lucide-react';

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

  const toggleMic = () => setMicEnabled(!micEnabled);
  const toggleVideo = () => setVideoEnabled(!videoEnabled);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={interviewee.profileImage} alt={interviewee.name} />
            <AvatarFallback>{interviewee.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{interviewee.name}</span>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={toggleVideo} variant="ghost" size="icon" className={!videoEnabled ? "bg-gray-200 dark:bg-gray-700" : ""}>
            {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
          </Button>
          <Button onClick={toggleMic} variant="ghost" size="icon" className={!micEnabled ? "bg-gray-200 dark:bg-gray-700" : ""}>
            {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <Video size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Video Interview</h3>
            <p className="text-sm text-muted-foreground">
              The video will appear here when you join the interview.
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t">
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default InterviewChat;
