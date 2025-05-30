
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Sparkles, MapPin, DollarSign, Building, Eye, Loader2, Brain, User, Briefcase, Target } from 'lucide-react';
import { JobMatch, ResumeAnalysis } from '../services/aiJobMatch';

interface AIJobMatchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  matches: JobMatch[] | null;
  analysis: ResumeAnalysis | null;
  isLoading: boolean;
  error?: string;
  onViewJob: (jobId: string) => void;
}

const AIJobMatchesModal: React.FC<AIJobMatchesModalProps> = ({
  isOpen,
  onClose,
  matches,
  analysis,
  isLoading,
  error,
  onViewJob
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-blue-500" />
            Your AI Job Analysis & Matches
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-muted-foreground">AI is analyzing your resume and finding the best matches...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
                <p className="text-red-600">{error}</p>
                <Button 
                  onClick={onClose} 
                  variant="outline" 
                  className="mt-4"
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {analysis && !isLoading && (
            <div className="mb-6">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Brain className="h-5 w-5 text-blue-600" />
                    AI Resume Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="font-medium text-sm text-blue-800">Profile Summary</h4>
                          <p className="text-sm text-blue-700">{analysis.summary}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Briefcase className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="font-medium text-sm text-blue-800">Experience Level</h4>
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                            {analysis.experienceLevel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="font-medium text-sm text-blue-800">Career Focus</h4>
                          <p className="text-sm text-blue-700">{analysis.careerFocus}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="font-medium text-sm text-blue-800">Key Skills</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {analysis.keySkills.slice(0, 5).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-white/50 text-blue-700 border-blue-300">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {matches && matches.length > 0 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Your Best Matches (Powered by AI)</h3>
                <p className="text-muted-foreground">
                  Based on your resume analysis, here are the 3 most suitable job opportunities for you:
                </p>
              </div>

              <div className="grid gap-6">
                {matches.map((match, index) => (
                  <Card key={match.jobId} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              #{index + 1} Best Match
                            </Badge>
                            <Sparkles className="h-4 w-4 text-yellow-500" />
                          </div>
                          <CardTitle className="text-xl">{match.jobTitle}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {match.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {match.location}
                            </span>
                            {match.salary && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {match.salary}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                        <Button 
                          onClick={() => onViewJob(match.jobId)}
                          className="ml-4"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Job
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">Why this is a great fit:</h4>
                        <p className="text-blue-700">{match.explanation}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  Want to see more opportunities? Check out all available jobs.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    onClose();
                    // Could navigate to job listings page
                  }}>
                    View All Jobs
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIJobMatchesModal;
