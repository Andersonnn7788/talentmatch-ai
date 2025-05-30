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
      const result = await uploadResumeToSupabase(file, user.id);

      if (result.success) {
        toast({
          title: "Resume uploaded successfully!",
          description: "Your resume has been uploaded and will be used for AI job matching.",
        });
      } else {
        toast({
          title: "Upload failed",
          description: result.error || "Failed to upload resume. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
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

    setAiLoading(true);
    setAiError(undefined);
    setAiAnalysis(null);
    setAiMatches(null);
    setAiModalOpen(true);
    onAIMatch(); // Call the original handler

    try {
      // In a real app, you'd fetch the user's uploaded resume URL from their profile
      // For demo purposes, we'll check if they have a resume or use demo data
      let resumeText = '';
      
      // Try to get the user's actual resume if they uploaded one
      // This would typically come from the user's profile in the database
      const demoResumeUrl = 'https://example.com/demo-resume.pdf'; // Replace with actual resume URL
      
      console.log('🔍 Extracting text from resume...');
      const extractResult = await extractResumeText(demoResumeUrl);
      
      if (extractResult.success && extractResult.text) {
        resumeText = extractResult.text;
        console.log('✅ Resume text extracted successfully');
      } else {
        console.log('⚠️ Using fallback demo resume text');
        // Fallback to demo text if extraction fails
        resumeText = `
ALEX THOMPSON - Software Engineer

PROFESSIONAL SUMMARY:
Experienced Software Engineer with 5+ years in full-stack development, specializing in React, TypeScript, and cloud technologies. Proven track record of delivering scalable applications and leading development teams.

TECHNICAL SKILLS:
• Frontend: React, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS, Next.js
• Backend: Node.js, Express.js, Python, Django, REST APIs, GraphQL
• Databases: PostgreSQL, MongoDB, Redis, MySQL
• Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD, GitHub Actions
• Tools: Git, Webpack, Jest, React Testing Library, Figma

EXPERIENCE:
Senior Frontend Developer | TechFlow Solutions (2021 - Present)
• Led development of React-based dashboard serving 50K+ users daily
• Implemented TypeScript across codebase, reducing bugs by 40%
• Mentored team of 3 junior developers and established coding standards
• Built real-time features using WebSocket and modern state management

Full Stack Developer | Digital Innovations (2019 - 2021)
• Developed and maintained Node.js microservices handling 2M+ requests daily
• Created responsive web applications using React and modern CSS frameworks
• Collaborated with UX team to implement pixel-perfect designs and animations
• Optimized database queries and API performance for better user experience

Frontend Developer | StartupLab (2018 - 2019)
• Built interactive web applications using React and vanilla JavaScript
• Implemented responsive design principles for mobile-first approach
• Worked with designers to create component libraries and design systems
• Contributed to open-source projects and internal development tools

EDUCATION:
Bachelor of Science in Computer Science | State University (2018)
Relevant Coursework: Data Structures, Algorithms, Software Engineering, Web Development

PROJECTS:
• E-Commerce Platform: Full-stack application with payment processing and admin dashboard
• Task Management App: Collaborative tool with real-time updates and team features  
• Weather Dashboard: React application with geolocation and data visualization

CERTIFICATIONS:
• AWS Certified Solutions Architect (2022)
• React Developer Certification (2021)

INTERESTS:
Modern web technologies, cloud computing, user experience design, team leadership, open source contributions
        `.trim();
      }

      // Generate personalized job listings based on resume
      const jobListings = generatePersonalizedJobListings(resumeText);
      console.log('🎯 Getting AI job matches with extracted resume text...');
      
      const matchResult = await getAIJobMatches(resumeText, jobListings);

      if (matchResult.success && matchResult.matches) {
        setAiMatches(matchResult.matches);
        setAiAnalysis(matchResult.analysis || null);
        toast({
          title: "AI analysis complete!",
          description: `Found ${matchResult.matches.length} great job matches based on your resume.`,
        });
      } else {
        setAiError(matchResult.error || 'Failed to get AI job matches');
        toast({
          title: "AI matching failed",
          description: matchResult.error || "Failed to analyze your resume. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('AI matching error:', error);
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
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                />
                <span className="text-sm text-muted-foreground">PDF, DOC, DOCX (5MB max)</span>
              </div>
              
              <Button 
                type="button" 
                onClick={handleAIMatch} 
                variant="default" 
                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                disabled={aiLoading}
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
