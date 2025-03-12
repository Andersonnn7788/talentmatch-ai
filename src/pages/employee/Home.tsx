
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import JobSearchBar from '@/components/JobSearchBar';
import JobCard from '@/components/JobCard';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Sample job data for demo
const sampleJobs = [
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
];

const EmployeeHome = () => {
  const [jobs, setJobs] = useState(sampleJobs);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = (searchParams: any) => {
    console.log('Search params:', searchParams);
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      // In a real app, you would filter jobs based on search params
    }, 1000);
  };
  
  const handleAIMatch = () => {
    console.log('AI Match initiated');
    setIsSearching(true);
    
    // Simulate AI matching delay
    setTimeout(() => {
      setIsSearching(false);
      // In a real app, this would trigger the AI matching algorithm
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="employee" />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          <section className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-3 animate-fade-in">Find Your Perfect Job</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
              Search for jobs or let our AI match your skills with the best opportunities.
            </p>
            
            <JobSearchBar onSearch={handleSearch} onAIMatch={handleAIMatch} />
          </section>
          
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {isSearching ? 'Searching...' : 'Recommended Jobs'}
              </h2>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default EmployeeHome;
