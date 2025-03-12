
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export interface InterviewMessage {
  id: string;
  name: string;
  message: string;
  date: string;
  profileImage?: string;
  unread: boolean;
}

interface InterviewMessageProps {
  message: InterviewMessage;
}

const InterviewMessage = ({ message }: InterviewMessageProps) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary/80 glass animate-slide-up">
      <div className="flex gap-4">
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={message.profileImage} alt={message.name} />
            <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {message.unread && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
              {1}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold">{message.name}</h3>
            <span className="text-sm text-muted-foreground">{message.date}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
        </div>
      </div>
    </Card>
  );
};

export default InterviewMessage;
