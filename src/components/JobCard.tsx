
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, Briefcase, DollarSign } from 'lucide-react';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    description: string;
    match?: number;
    posted: string;
    type: string;
  };
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <div className="w-full glass rounded-xl p-6 card-hover animate-slide-up" style={{ animationDelay: '100ms' }}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{job.title}</h3>
          <div className="flex items-center mt-1 text-muted-foreground">
            <Building2 size={14} className="mr-1" />
            <span className="mr-3">{job.company}</span>
            <MapPin size={14} className="mr-1" />
            <span>{job.location}</span>
          </div>
        </div>
        
        {job.match && (
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {job.match}% Match
          </Badge>
        )}
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="secondary" className="flex items-center">
          <Briefcase size={12} className="mr-1" />
          {job.type}
        </Badge>
        <Badge variant="secondary" className="flex items-center">
          <DollarSign size={12} className="mr-1" />
          {job.salary}
        </Badge>
        <Badge variant="outline">Posted {job.posted}</Badge>
      </div>
      
      <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
        {job.description}
      </p>
      
      <div className="mt-4 flex justify-end">
        <Button size="sm" variant="outline">View Details</Button>
        <Button size="sm" className="ml-2">Apply Now</Button>
      </div>
    </div>
  );
};

export default JobCard;
