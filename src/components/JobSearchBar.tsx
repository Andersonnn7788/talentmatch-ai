
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Upload, Sparkles } from 'lucide-react';

interface JobSearchBarProps {
  onSearch: (searchParams: {
    query: string;
    jobType: string;
    industry: string;
    location: string;
  }) => void;
  onAIMatch: () => void;
}

const JobSearchBar = ({ onSearch, onAIMatch }: JobSearchBarProps) => {
  const [query, setQuery] = useState('');
  const [jobType, setJobType] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ query, jobType, industry, location });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="glass rounded-xl p-6 animate-fade-in">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label htmlFor="jobType" className="text-sm font-medium">Type of Job</label>
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="industry" className="text-sm font-medium">Industry</label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">Location</label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="new-york">New York</SelectItem>
                  <SelectItem value="san-francisco">San Francisco</SelectItem>
                  <SelectItem value="london">London</SelectItem>
                  <SelectItem value="tokyo">Tokyo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="search" className="text-sm font-medium">Search</label>
              <div className="flex">
                <Input
                  id="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Job title, keyword, company..."
                  className="rounded-r-none"
                />
                <Button type="submit" className="rounded-l-none">
                  <Search size={18} />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-4 sm:mb-0">
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => document.getElementById('resume-upload')?.click()}
              >
                <Upload size={16} />
                <span>Upload Resume</span>
                <input id="resume-upload" type="file" className="hidden" accept=".pdf,.doc,.docx" />
              </Button>
              <span className="text-sm text-muted-foreground">PDF, DOC, DOCX (5MB max)</span>
            </div>
            
            <Button 
              type="button" 
              onClick={onAIMatch} 
              variant="default" 
              className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
            >
              <Sparkles size={16} className="animate-float" />
              <span>AI Match</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JobSearchBar;
