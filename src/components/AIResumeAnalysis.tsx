
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Brain, User, Target, Award, Cpu, Briefcase, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
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
  const [diagnostics, setDiagnostics] = useState<any>(null);

  const analyzeResume = async () => {
    if (!filePath || !user) {
      setError('No resume uploaded or user not authenticated');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);
    setDiagnostics(null);

    try {
      console.log('🧠 Starting enhanced GPT-4o-mini resume analysis for:', filePath);
      
      let cleanFileName = filePath;
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
        console.log('✅ Enhanced analysis response received:', response);
        
        let parsedAnalysis: ResumeAnalysisData;
        
        if (typeof response.analysis === 'string') {
          try {
            const jsonAnalysis = JSON.parse(response.analysis);
            parsedAnalysis = {
              profileSummary: jsonAnalysis.profileSummary || 'Unable to generate profile summary from the resume content.',
              highlightedSkills: Array.isArray(jsonAnalysis.highlightedSkills) && jsonAnalysis.highlightedSkills.length > 0 
                ? jsonAnalysis.highlightedSkills 
                : ['Communication', 'Problem Solving', 'Technical Skills'],
              experienceLevel: ['Junior', 'Mid', 'Senior'].includes(jsonAnalysis.experienceLevel) 
                ? jsonAnalysis.experienceLevel 
                : 'Mid',
              careerFocus: jsonAnalysis.careerFocus || 'Professional services',
              suggestedJobs: Array.isArray(jsonAnalysis.suggestedJobs) && jsonAnalysis.suggestedJobs.length > 0
                ? jsonAnalysis.suggestedJobs 
                : []
            };
          } catch (parseError) {
            console.warn('📄 Analysis is not JSON, treating as error');
            throw new Error('Failed to extract readable text from the resume. Please try a different PDF file.');
          }
        } else {
          parsedAnalysis = response.analysis as ResumeAnalysisData;
        }

        // Enhanced validation - check for meaningful content
        if (!parsedAnalysis.profileSummary || 
            parsedAnalysis.profileSummary.includes('obfuscated') || 
            parsedAnalysis.profileSummary.includes('corrupted') ||
            parsedAnalysis.profileSummary.includes('difficult to extract') ||
            parsedAnalysis.profileSummary.includes('heavily formatted')) {
          throw new Error('The resume text extraction quality is too low for meaningful analysis. Please ensure your PDF contains readable text and try uploading again.');
        }

        setAnalysis(parsedAnalysis);
        
        // Store diagnostics if available
        if (response.diagnostics) {
          setDiagnostics(response.diagnostics);
        }
        
        onAnalysisComplete?.(parsedAnalysis);

        toast({
          title: "AI Resume Analysis Complete!",
          description: `Enhanced GPT-4o-mini analysis completed with ${parsedAnalysis.highlightedSkills.length} skills identified and ${parsedAnalysis.suggestedJobs.length} job suggestions.`,
        });

      } else {
        const errorMsg = response.error || 'Failed to analyze resume';
        setError(errorMsg);
        
        // Enhanced error messages based on common issues
        let userFriendlyMessage = errorMsg;
        if (errorMsg.includes('text extraction')) {
          userFriendlyMessage = "We couldn't extract readable text from your PDF. Please ensure it's not an image-based scan.";
        } else if (errorMsg.includes('encrypted') || errorMsg.includes('password')) {
          userFriendlyMessage = "Your PDF appears to be password-protected. Please upload an unprotected version.";
        } else if (errorMsg.includes('corrupted') || errorMsg.includes('malformed')) {
          userFriendlyMessage = "Your PDF file appears to be corrupted. Please try uploading a different file.";
        }
        
        toast({
          title: "Analysis Failed", 
          description: userFriendlyMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Resume analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'We couldn\'t analyze your resume. Please try again with a different PDF file.';
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
              Upload a resume to get AI-powered analysis with enhanced GPT-4o-mini processing of your skills and experience.
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
          AI Resume Analysis (Enhanced GPT-4o-mini)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 size={24} className="animate-spin mr-2" />
            <span>Analyzing your resume with enhanced GPT-4o-mini processing...</span>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Diagnostics Section */}
        {diagnostics && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <FileText size={16} />
              Processing Diagnostics
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              {diagnostics.extraction_method && (
                <div className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-500" />
                  Method: {diagnostics.extraction_method}
                </div>
              )}
              {diagnostics.pdfSize && (
                <div>Size: {(diagnostics.pdfSize / 1024 / 1024).toFixed(2)}MB</div>
              )}
              {diagnostics.pdfVersion && (
                <div>PDF Version: {diagnostics.pdfVersion}</div>
              )}
              {diagnostics.extractionAttempts && (
                <div className="col-span-2">
                  <span>Attempts: {diagnostics.extractionAttempts.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
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
