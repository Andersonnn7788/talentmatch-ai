
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import JobCard from '@/components/JobCard';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, ArrowUpDown, RefreshCw, Sparkles, Zap, Brain, BarChart } from 'lucide-react';
import { Slider } from "@/components/ui/slider";

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
  const [showAIPreferences, setShowAIPreferences] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [skillFocus, setSkillFocus] = useState<number[]>([50]);
  const [workLifeBalance, setWorkLifeBalance] = useState<number[]>([50]);
  const [careerGrowth, setCareerGrowth] = useState<number[]>([60]);
  const [compensation, setCompensation] = useState<number[]>([40]);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  
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
  
  const handleOptimizeMatches = () => {
    setIsOptimizing(true);
    
    setTimeout(() => {
      setIsOptimizing(false);
      
      // Simulate AI-optimized match scores based on preferences
      const updatedJobs = matchedJobs.map(job => {
        // Adjust match score based on preferences
        const skillImpact = (skillFocus[0] - 50) * 0.1;
        const balanceImpact = (workLifeBalance[0] - 50) * 0.08;
        const growthImpact = (careerGrowth[0] - 50) * 0.12;
        const compensationImpact = (compensation[0] - 50) * 0.1;
        
        const adjustedMatch = Math.min(
          99, 
          Math.max(50, job.match + skillImpact + balanceImpact + growthImpact + compensationImpact)
        );
        
        return { ...job, match: Math.round(adjustedMatch) };
      });
      
      // Sort by new match scores
      setMatchedJobs([...updatedJobs].sort((a, b) => (b.match || 0) - (a.match || 0)));
      
      // Generate AI insight
      const topJob = updatedJobs.sort((a, b) => (b.match || 0) - (a.match || 0))[0];
      
      setAiInsight(
        `Based on your preferences, ${topJob.title} at ${topJob.company} is your top match. ` +
        `They offer excellent ${careerGrowth[0] > 60 ? 'growth opportunities' : 'work-life balance'} ` +
        `and the skills required align well with your experience. ` +
        `Consider applying soon as this position was posted ${topJob.posted}.`
      );
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="employee" />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center">
                <h1 className="text-3xl font-bold mr-2 animate-fade-in">AI Job Matches</h1>
                <Badge variant="outline" className="bg-primary/10 text-primary px-2 py-1 gap-1 flex items-center">
                  <Sparkles size={12} />
                  <span>AI Enhanced</span>
                </Badge>
              </div>
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
                variant="outline" 
                size="sm"
                onClick={() => setShowAIPreferences(!showAIPreferences)}
                className="flex items-center gap-1"
              >
                <Brain size={14} />
                <span>AI Preferences</span>
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
          
          {/* AI Preferences Panel */}
          {showAIPreferences && (
            <Card className="mb-6 animate-fade-in bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap size={20} className="text-primary" />
                    AI Job Matching Preferences
                  </CardTitle>
                  <Button 
                    onClick={handleOptimizeMatches} 
                    disabled={isOptimizing}
                    size="sm"
                    className="gap-1"
                  >
                    <Sparkles size={16} className={isOptimizing ? "animate-pulse" : ""} />
                    {isOptimizing ? "Optimizing..." : "Optimize Matches"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Skill Focus</label>
                        <span className="text-sm">{skillFocus[0]}</span>
                      </div>
                      <Slider 
                        value={skillFocus} 
                        onValueChange={setSkillFocus} 
                        max={100} 
                        step={5}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Diverse Skills</span>
                        <span>Specialized</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Work-Life Balance</label>
                        <span className="text-sm">{workLifeBalance[0]}</span>
                      </div>
                      <Slider 
                        value={workLifeBalance} 
                        onValueChange={setWorkLifeBalance} 
                        max={100} 
                        step={5}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Less Priority</span>
                        <span>High Priority</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Career Growth</label>
                        <span className="text-sm">{careerGrowth[0]}</span>
                      </div>
                      <Slider 
                        value={careerGrowth} 
                        onValueChange={setCareerGrowth} 
                        max={100} 
                        step={5}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Less Priority</span>
                        <span>High Priority</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Compensation</label>
                        <span className="text-sm">{compensation[0]}</span>
                      </div>
                      <Slider 
                        value={compensation} 
                        onValueChange={setCompensation} 
                        max={100} 
                        step={5}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Less Priority</span>
                        <span>High Priority</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {aiInsight && (
                  <div className="mt-4 p-3 bg-primary/10 rounded-md border border-primary/20 text-sm">
                    <div className="flex items-start gap-2">
                      <Brain size={18} className="text-primary shrink-0 mt-0.5" />
                      <p>{aiInsight}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
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
