
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Sparkles, MapPin, DollarSign, Building, Eye, Loader2 } from 'lucide-react';
import { JobMatch } from '../services/aiJobMatch';

interface AIJobMatchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  matches: JobMatch[] | null;
  isLoading: boolean;
  error?: string;
  onViewJob: (jobId: string) => void;
}

const AIJobMatchesModal: React.FC<AIJobMatchesModalProps> = ({
  isOpen,
  onClose,
  matches,
  isLoading,
  error,
  onViewJob
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-blue-500" />
            Your Best Matches (Powered by AI)
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

          {matches && matches.length > 0 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
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
