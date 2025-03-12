
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, CalendarDays, FileText } from 'lucide-react';

interface AptitudeTestProps {
  test: {
    id: string;
    title: string;
    description: string;
    questions: number;
    timeLimit: number;
    category: 'technical' | 'soft';
    created: string;
    responses: number;
  };
}

const AptitudeTestCard = ({ test }: AptitudeTestProps) => {
  return (
    <div className="glass rounded-xl p-6 card-hover animate-slide-up" style={{ animationDelay: '100ms' }}>
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold">{test.title}</h3>
        <Badge variant={test.category === 'technical' ? 'default' : 'secondary'}>
          {test.category === 'technical' ? 'Technical' : 'Soft Skills'}
        </Badge>
      </div>
      
      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
        {test.description}
      </p>
      
      <div className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
        <div className="flex items-center text-muted-foreground">
          <FileText size={14} className="mr-1" />
          {test.questions} Questions
        </div>
        <div className="flex items-center text-muted-foreground">
          <Clock size={14} className="mr-1" />
          {test.timeLimit} Minutes
        </div>
        <div className="flex items-center text-muted-foreground">
          <CalendarDays size={14} className="mr-1" />
          Created {test.created}
        </div>
        <div className="flex items-center text-muted-foreground">
          <Users size={14} className="mr-1" />
          {test.responses} Responses
        </div>
      </div>
      
      <div className="mt-4 flex justify-between">
        <Button size="sm" variant="outline">View Results</Button>
        <Button size="sm">Edit Test</Button>
      </div>
    </div>
  );
};

export default AptitudeTestCard;
