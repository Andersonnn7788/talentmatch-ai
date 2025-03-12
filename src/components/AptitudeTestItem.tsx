
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Building, ArrowRight } from 'lucide-react';

interface AptitudeTestItemProps {
  test: {
    id: string;
    title: string;
    description: string;
    questions: number;
    timeLimit: number;
    category: 'technical' | 'soft';
    company: string;
    status: 'available' | 'in-progress' | 'completed';
  };
}

const AptitudeTestItem = ({ test }: AptitudeTestItemProps) => {
  return (
    <div className="glass rounded-xl p-6 card-hover animate-slide-up" style={{ animationDelay: '100ms' }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold">{test.title}</h3>
            <Badge variant={test.category === 'technical' ? 'default' : 'secondary'}>
              {test.category === 'technical' ? 'Technical' : 'Soft Skills'}
            </Badge>
          </div>
          
          <p className="mt-2 text-sm text-muted-foreground">
            {test.description}
          </p>
          
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <Building size={14} className="mr-1" />
              {test.company}
            </div>
            <div className="flex items-center text-muted-foreground">
              <FileText size={14} className="mr-1" />
              {test.questions} Questions
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock size={14} className="mr-1" />
              {test.timeLimit} Minutes
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {test.status === 'available' && (
            <Button className="w-full md:w-auto">
              Take Test <ArrowRight size={16} className="ml-1" />
            </Button>
          )}
          {test.status === 'in-progress' && (
            <Button className="w-full md:w-auto" variant="secondary">
              Continue Test <ArrowRight size={16} className="ml-1" />
            </Button>
          )}
          {test.status === 'completed' && (
            <Button className="w-full md:w-auto" variant="outline">
              View Results
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AptitudeTestItem;
