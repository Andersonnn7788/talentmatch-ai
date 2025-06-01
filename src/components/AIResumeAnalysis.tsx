
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Brain, User, Target, Award, Cpu } from 'lucide-react';
import { testParseResume } from '../services/testResumeParser';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

interface ResumeAnalysisData {
  summary: string;
  keySkills: string[];
  experienceLevel: string;
  careerFocus: string;
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
      console.log('🧠 Starting AI resume analysis for:', filePath);
      
      // Use the filePath (which includes the full storage path) instead of just fileName
      const response = await testParseResume({
        user_id: user.id,
        file_name: filePath // This is actually the full file path in storage
      });

      if (response.success && response.analysis) {
        // Parse the analysis response to extract structured data
        const analysisText = response.analysis;
        
        // Extract structured data from the analysis text
        // This is a simple parsing approach - in production you might want more robust parsing
        const lines = analysisText.split('\n').filter(line => line.trim());
        
        let summary = '';
        let keySkills: string[] = [];
        let experienceLevel = 'Mid';
        let careerFocus = '';
        
        // Parse the analysis text to extract the different sections
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].toLowerCase();
          
          if (line.includes('summary') || line.includes('overview')) {
            // Take the next few lines as summary
            summary = lines.slice(i + 1, i + 3).join(' ').trim();
          } else if (line.includes('skills') || line.includes('technologies')) {
            // Extract skills from the next line
            const skillsLine = lines[i + 1] || '';
            keySkills = skillsLine.split(/[,•\-\n]/)
              .map(skill => skill.trim().replace(/^[•\-\*]\s*/, ''))
              .filter(skill => skill && skill.length > 1)
              .slice(0, 8); // Limit to 8 skills
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

        // Fallback parsing if structured extraction didn't work well
        if (!summary && analysisText.length > 50) {
          summary = analysisText.substring(0, 200) + '...';
        }
        
        if (keySkills.length === 0) {
          // Try to extract common tech skills from the entire text
          const techSkills = ['React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'Java', 'AWS', 'Docker', 'SQL', 'PostgreSQL', 'MongoDB', 'Angular', 'Vue.js', 'Express', 'Spring', 'Django', 'Flask', 'Kubernetes', 'Git', 'REST API'];
          keySkills = techSkills.filter(skill => 
            analysisText.toLowerCase().includes(skill.toLowerCase())
          ).slice(0, 6);
        }

        const parsedAnalysis: ResumeAnalysisData = {
          summary: summary || 'Professional with experience in software development and technology.',
          keySkills: keySkills.length > 0 ? keySkills : ['Software Development', 'Problem Solving'],
          experienceLevel,
          careerFocus: careerFocus || 'Software development and technology solutions.'
        };

        setAnalysis(parsedAnalysis);
        onAnalysisComplete?.(parsedAnalysis);

        toast({
          title: "Resume Analysis Complete!",
          description: `AI analysis completed successfully with ${parsedAnalysis.keySkills.length} key skills identified.`,
        });

      } else {
        setError(response.error || 'Failed to analyze resume');
        toast({
          title: "Analysis Failed",
          description: response.error || "Failed to analyze resume. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Resume analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      toast({
        title: "Analysis Error",
        description: "An unexpected error occurred during analysis.",
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
              Upload a resume to get AI-powered analysis of your skills and experience.
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
          AI Resume Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 size={24} className="animate-spin mr-2" />
            <span>Analyzing your resume with AI...</span>
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
                {analysis.summary}
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

            {/* Key Skills */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-blue-500" />
                <h3 className="font-semibold text-blue-700">Key Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.keySkills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIResumeAnalysis;
