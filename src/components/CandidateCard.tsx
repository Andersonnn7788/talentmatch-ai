
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Briefcase, Award, User } from 'lucide-react';

interface CandidateCardProps {
  candidate: {
    id: string;
    name: string;
    matchScore: number;
    university: string;
    degree: string;
    experience: string[];
    skills: string[];
    status: 'new' | 'reviewed';
    profileImage?: string;
  };
}

const CandidateCard = ({ candidate }: CandidateCardProps) => {
  return (
    <div className="w-full glass rounded-xl p-6 card-hover animate-slide-up" style={{ animationDelay: '100ms' }}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {candidate.profileImage ? (
            <img 
              src={candidate.profileImage} 
              alt={candidate.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary/10"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User size={24} className="text-primary" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{candidate.name}</h3>
              <div className="flex items-center mt-1 text-muted-foreground">
                <GraduationCap size={14} className="mr-1" />
                <span className="mr-1">{candidate.degree},</span>
                <span>{candidate.university}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <Badge className={candidate.status === 'new' ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                {candidate.status === 'new' ? 'New' : 'Reviewed'}
              </Badge>
              
              <div className="mt-2 flex items-center">
                <span className="text-sm font-medium mr-2">{candidate.matchScore}%</span>
                <Progress value={candidate.matchScore} className="w-24 h-2" />
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-1 flex items-center">
              <Briefcase size={14} className="mr-1" /> Experience
            </h4>
            <p className="text-sm text-muted-foreground">
              {candidate.experience.join(' • ')}
            </p>
          </div>
          
          <div className="mt-2">
            <h4 className="text-sm font-medium mb-1 flex items-center">
              <Award size={14} className="mr-1" /> Skills
            </h4>
            <div className="flex flex-wrap gap-1">
              {candidate.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button size="sm" variant="outline">View Profile</Button>
            <Button size="sm" className="ml-2">Contact</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
