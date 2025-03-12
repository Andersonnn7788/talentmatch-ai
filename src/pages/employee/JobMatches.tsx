
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import JobCard from '@/components/JobCard';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, ArrowUpDown, RefreshCw } from 'lucide-react';

// Sample job data for demo
const sampleMatchedJobs = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$120K - $150K',
    description: 'We are looking for a senior frontend developer with expertise in React, TypeScript, and modern web technologies to join our team.',
    match: 95,
    posted: '2 days ago',
    type: 'Full-time',
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    company: 'DesignStudio',
    location: 'Remote',
    salary: '$90K - $120K',
    description: 'Creative and experienced UX/UI Designer needed to craft beautiful and functional user experiences for our products.',
    match: 88,
    posted: '1 week ago',
    type: 'Full-time',
  },
  {
    id: '3',
    title: 'Data Scientist',
    company: 'DataWorks Labs',
    location: 'New York, NY',
    salary: '$130K - $160K',
    description: 'Join our team of data scientists working on cutting-edge machine learning models and data analytics solutions.',
    match: 82,
    posted: '3 days ago',
    type: 'Full-time',
  },
  {
    id: '4',
    title: 'Marketing Specialist',
    company: 'GrowthHackers',
    location: 'Chicago, IL',
    salary: '$70K - $90K',
    description: 'Looking for a marketing specialist with experience in digital marketing, SEO, and social media campaigns.',
    match: 75,
    posted: '5 days ago',
    type: 'Part-time',
  },
  {
    id: '5',
    title: 'Product Manager',
    company: 'InnovateTech',
    location: 'Boston, MA',
    salary: '$110K - $140K',
    description: 'Seeking an experienced product manager to lead our product development efforts and drive innovation.',
    match: 73,
    posted: '1 week ago',
    type: 'Full-time',
  },
  {
    id: '6',
    title: 'Backend Developer',
    company: 'ServerSide Solutions',
    location: 'Remote',
    salary: '$100K - $130K',
    description: 'Backend developer with experience in Node.js, Express, and MongoDB to join our engineering team.',
    match: 68,
    posted: '3 days ago',
    type: 'Full-time',
  },
];

const JobMatches = () => {
  const [matchedJobs, setMatchedJobs] = useState(sampleMatchedJobs);
  const [sortBy, setSortBy] = useState<'match' | 'date'>('match');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleSort = (type: 'match' | 'date') => {
    setSortBy(type);
    if (type === 'match') {
      setMatchedJobs([...matchedJobs].sort((a, b) => (b.match || 0) - (a.match || 0)));
    } else {
      // This is just a simplistic sort for the demo
      // In reality, you'd parse the date strings and compare them
      setMatchedJobs([...matchedJobs].sort((a, b) => a.posted.localeCompare(b.posted)));
    }
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
      // In a real app, this would trigger a refresh of matches from the API
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="employee" />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 animate-fade-in">AI Job Matches</h1>
              <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '100ms' }}>
                Jobs matched to your profile based on your resume and preferences
              </p>
            </div>
            
            <div className="flex items-center space-x-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => handleSort('match')}
              >
                <ArrowUpDown size={14} />
                <span>Match %</span>
                {sortBy === 'match' && <Badge className="ml-1 h-1.5 w-1.5 rounded-full bg-primary" />}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => handleSort('date')}
              >
                <ArrowUpDown size={14} />
                <span>Date</span>
                {sortBy === 'date' && <Badge className="ml-1 h-1.5 w-1.5 rounded-full bg-primary" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleRefresh}
                className="flex items-center gap-1"
                disabled={isRefreshing}
              >
                <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
                <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {matchedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobMatches;
