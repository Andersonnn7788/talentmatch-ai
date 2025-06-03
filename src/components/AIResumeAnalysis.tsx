
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Brain, User, Target, Award, Cpu, Briefcase } from 'lucide-react';
import { testParseResume } from '../services/testResumeParser';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

interface JobSuggestion {
  title: string;
  reason: string;
  keySkills: string[];
}

interface ResumeAnalysisData {
  profileSummary: string;
  highlightedSkills: string[];
  experienceLevel: string;
  careerFocus: string;
  suggestedJobs: JobSuggestion[];
}

interface AIResumeAnalysisProps {
  fileName?: string;
  filePath?: string;
  onAnalysisComplete?: (analysis: ResumeAnalysisData) => void;
}

const AIResumeAnalysis: React.FC<AIResumeAnalysisProps> = ({ 
  fileName, 
  filePath,
  onAnalysisComplete 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<ResumeAnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeResume = async () => {
    if (!filePath || !user) {
      setError('No resume uploaded or user not authenticated');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      console.log('🧠 Starting GPT-4o-mini resume analysis for:', filePath);
      
      // Extract just the filename from the full path for the API call
      let cleanFileName = filePath;
      
      // If the filePath includes the full storage path, extract just the filename part
      if (filePath.includes('resumes/')) {
        const parts = filePath.split('resumes/');
        cleanFileName = parts[parts.length - 1];
      }
      
      console.log('📁 Clean filename for API:', cleanFileName);
      
      const response = await testParseResume({
        user_id: user.id,
        file_name: cleanFileName
      });

      if (response.success && response.analysis) {
        console.log('✅ Analysis response received:', response.analysis);
        
        let parsedAnalysis: ResumeAnalysisData;
        
        // Check if the analysis is already parsed JSON or needs parsing
        if (typeof response.analysis === 'string') {
          try {
            // Try to parse as JSON first
            const jsonAnalysis = JSON.parse(response.analysis);
            parsedAnalysis = {
              profileSummary: jsonAnalysis.profileSummary || 'Professional with diverse experience.',
              highlightedSkills: jsonAnalysis.highlightedSkills || ['Communication', 'Problem Solving'],
              experienceLevel: jsonAnalysis.experienceLevel || 'Mid',
              careerFocus: jsonAnalysis.careerFocus || 'Technology and professional services',
              suggestedJobs: jsonAnalysis.suggestedJobs || []
            };
          } catch (parseError) {
            console.warn('📄 Analysis is not JSON, treating as text:', parseError);
            // Fallback to text parsing for backwards compatibility
            const analysisText = response.analysis;
            const lines = analysisText.split('\n').filter(line => line.trim());
            
            let summary = '';
            let keySkills: string[] = [];
            let experienceLevel = 'Mid';
            let careerFocus = '';
            
            // Parse the analysis text to extract the different sections
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i].toLowerCase();
              
              if (line.includes('summary') || line.includes('overview')) {
                summary = lines.slice(i + 1, i + 3).join(' ').trim();
              } else if (line.includes('skills') || line.includes('technologies')) {
                const skillsLine = lines[i + 1] || '';
                keySkills = skillsLine.split(/[,•\-\n]/)
                  .map(skill => skill.trim().replace(/^[•\-\*]\s*/, ''))
                  .filter(skill => skill && skill.length > 1)
                  .slice(0, 8);
              } else if (line.includes('experience') && (line.includes('years') || line.includes('level'))) {
                const expLine = lines[i];
                if (expLine.match(/\b[0-9]+\s*years?\b/)) {
                  const years = parseInt(expLine.match(/\b([0-9]+)\s*years?\b/)?.[1] || '0');
                  if (years >= 5) experienceLevel = 'Senior';
                  else if (years >= 2) experienceLevel = 'Mid';
                  else experienceLevel = 'Junior';
                }
              } else if (line.includes('focus') || line.includes('specializ') || line.includes('position')) {
                careerFocus = lines[i + 1]?.trim() || lines[i].trim();
              }
            }

            parsedAnalysis = {
              profileSummary: summary || 'Professional with experience and skills.',
              highlightedSkills: keySkills.length > 0 ? keySkills : ['Communication', 'Problem Solving'],
              experienceLevel,
              careerFocus: careerFocus || 'Professional services and technology',
              suggestedJobs: []
            };
          }
        } else {
          // Analysis is already an object
          parsedAnalysis = response.analysis as ResumeAnalysisData;
        }

        setAnalysis(parsedAnalysis);
        onAnalysisComplete?.(parsedAnalysis);

        toast({
          title: "AI Resume Analysis Complete!",
          description: `GPT-4o-mini analysis completed with ${parsedAnalysis.highlightedSkills.length} skills and ${parsedAnalysis.suggestedJobs.length} job suggestions.`,
        });

      } else {
        const errorMsg = response.error || 'Failed to analyze resume';
        setError(errorMsg);
        toast({
          title: "Analysis Failed",
          description: errorMsg.includes('File not found') 
            ? "We couldn't find your resume file. Please try uploading again."
            : "We couldn't analyze your resume. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Resume analysis error:', error);
      const errorMessage = 'We couldn\'t analyze your resume. Please try again.';
      setError(errorMessage);
      toast({
        title: "Analysis Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-analyze when filePath is provided
  React.useEffect(() => {
    if (filePath && user && !analysis && !loading) {
      analyzeResume();
    }
  }, [filePath, user]);

  if (!fileName) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain size={20} />
            AI Resume Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Upload a resume to get AI-powered analysis with GPT-4o-mini of your skills and experience.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain size={20} />
          AI Resume Analysis (GPT-4o-mini)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 size={24} className="animate-spin mr-2" />
            <span>Analyzing your resume with GPT-4o-mini...</span>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {analysis && (
          <div className="space-y-6">
            {/* Profile Summary */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User size={16} className="text-blue-500" />
                <h3 className="font-semibold text-blue-700">Profile Summary</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {analysis.profileSummary}
              </p>
            </div>

            {/* Career Focus */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-blue-500" />
                <h3 className="font-semibold text-blue-700">Career Focus</h3>
              </div>
              <p className="text-sm text-gray-700">
                {analysis.careerFocus}
              </p>
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-blue-500" />
                <h3 className="font-semibold text-blue-700">Experience Level</h3>
              </div>
              <Badge variant="outline" className="font-medium">
                {analysis.experienceLevel}
              </Badge>
            </div>

            {/* Highlighted Skills */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-blue-500" />
                <h3 className="font-semibold text-blue-700">Highlighted Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.highlightedSkills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Suggested Jobs */}
            {analysis.suggestedJobs && analysis.suggestedJobs.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-blue-500" />
                  <h3 className="font-semibold text-blue-700">Suggested Jobs</h3>
                </div>
                <div className="space-y-3">
                  {analysis.suggestedJobs.map((job, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-gray-50">
                      <h4 className="font-medium text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{job.reason}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {job.keySkills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIResumeAnalysis;
