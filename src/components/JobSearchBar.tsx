import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Upload, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { uploadResumeToSupabase } from '@/services/resumeUpload';
import { getAIJobMatches, generatePersonalizedJobListings, JobMatch, ResumeAnalysis } from '@/services/aiJobMatch';
import { extractResumeText } from '@/services/resumeTextExtraction';
import AIJobMatchesModal from './AIJobMatchesModal';

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
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [jobType, setJobType] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [uploading, setUploading] = useState(false);
  const [lastUploadedResumeUrl, setLastUploadedResumeUrl] = useState<string | null>(null);
  
  // AI Matching states
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiMatches, setAiMatches] = useState<JobMatch[] | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<ResumeAnalysis | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | undefined>();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ query, jobType, industry, location });
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    try {
      console.log('📎 Starting resume upload for file:', file.name);
      const result = await uploadResumeToSupabase(file, user.id);

      if (result.success && result.fileUrl) {
        setLastUploadedResumeUrl(result.fileUrl);
        console.log('✅ Resume uploaded successfully to:', result.fileUrl);
        
        toast({
          title: "Resume uploaded successfully!",
          description: "Your resume has been uploaded and is ready for AI analysis.",
        });
      } else {
        console.error('❌ Resume upload failed:', result.error);
        toast({
          title: "Upload failed",
          description: result.error || "Failed to upload resume. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Resume upload error:', error);
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAIMatch = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to use AI job matching.",
        variant: "destructive",
      });
      return;
    }

    if (!lastUploadedResumeUrl) {
      toast({
        title: "Upload resume first",
        description: "Please upload your resume before using AI job matching.",
        variant: "destructive",
      });
      return;
    }

    setAiLoading(true);
    setAiError(undefined);
    setAiAnalysis(null);
    setAiMatches(null);
    setAiModalOpen(true);
    onAIMatch(); // Call the original handler

    try {
      console.log('🔍 Starting AI job matching with uploaded resume:', lastUploadedResumeUrl);
      
      // Extract text from the uploaded resume
      const extractResult = await extractResumeText(lastUploadedResumeUrl);
      
      if (!extractResult.success || !extractResult.text) {
        throw new Error(extractResult.error || 'Failed to extract text from resume');
      }

      const resumeText = extractResult.text;
      console.log('✅ Resume text extracted, length:', resumeText.length);
      console.log('📄 Resume content preview:', resumeText.substring(0, 200) + '...');

      // Generate personalized job listings based on resume
      const jobListings = generatePersonalizedJobListings(resumeText);
      console.log('🎯 Generated personalized job listings:', jobListings.length);
      
      const matchResult = await getAIJobMatches(resumeText, jobListings);

      if (matchResult.success && matchResult.matches) {
        setAiMatches(matchResult.matches);
        setAiAnalysis(matchResult.analysis || null);
        console.log('✅ AI analysis complete:', matchResult);
        
        toast({
          title: "AI analysis complete!",
          description: `Found ${matchResult.matches.length} great job matches based on your resume.`,
        });
      } else {
        setAiError(matchResult.error || 'Failed to get AI job matches');
        console.error('❌ AI matching failed:', matchResult.error);
        
        toast({
          title: "AI matching failed",
          description: matchResult.error || "Failed to analyze your resume. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ AI matching error:', error);
      setAiError('An unexpected error occurred during AI matching');
      toast({
        title: "AI matching failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleViewJob = (jobId: string) => {
    // In a real app, navigate to the job details page
    console.log('Viewing job:', jobId);
    toast({
      title: "Job details",
      description: "This would navigate to the job details page.",
    });
    setAiModalOpen(false);
  };

  const closeAiModal = () => {
    setAiModalOpen(false);
    setAiMatches(null);
    setAiAnalysis(null);
    setAiError(undefined);
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto">
        <form onSubmit={handleSearch} className="glass rounded-xl p-6 shadow-sm border border-slate-200 bg-white/50 backdrop-blur-sm">
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
                  <Button type="submit" className="rounded-l-none bg-blue-500 hover:bg-blue-600">
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
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload size={16} />
                  <span>{uploading ? 'Uploading...' : 'Upload Resume'}</span>
                </Button>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  onChange={handleResumeUpload}
                />
                <span className="text-sm text-muted-foreground">
                  {lastUploadedResumeUrl ? '✅ Resume uploaded' : 'PDF, DOC, DOCX, images (5MB max)'}
                </span>
              </div>
              
              <Button 
                type="button" 
                onClick={handleAIMatch} 
                variant="default" 
                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                disabled={aiLoading || !lastUploadedResumeUrl}
              >
                <Sparkles size={16} className={aiLoading ? "animate-spin" : "animate-float"} />
                <span>{aiLoading ? 'Analyzing...' : 'AI Match'}</span>
              </Button>
            </div>
          </div>
        </form>
      </div>

      <AIJobMatchesModal
        isOpen={aiModalOpen}
        onClose={closeAiModal}
        matches={aiMatches}
        analysis={aiAnalysis}
        isLoading={aiLoading}
        error={aiError}
        onViewJob={handleViewJob}
      />
    </>
  );
};

export default JobSearchBar;
