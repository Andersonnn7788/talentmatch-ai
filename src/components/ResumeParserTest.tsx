
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { testParseResume } from '../services/testResumeParser';
import { Loader2, FileText } from 'lucide-react';

const ResumeParserTest: React.FC = () => {
  const [userId, setUserId] = useState('12345678-1234-1234-1234-123456789012');
  const [fileName, setFileName] = useState('resume_test.pdf');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<string>('');
  const { toast } = useToast();

  const handleTest = async () => {
    if (!userId || !fileName) {
      toast({
        title: "Missing Information",
        description: "Please provide both user ID and file name",
        variant: "destructive",
      });
      return;
    }

    setTesting(true);
    setResult('');

    try {
      const response = await testParseResume({
        user_id: userId,
        file_name: fileName
      });

      if (response.success && response.analysis) {
        setResult(response.analysis);
        toast({
          title: "Resume Parsed Successfully!",
          description: `Analysis saved with ID: ${response.analysis_id}`,
        });
      } else {
        setResult(`Error: ${response.error}`);
        toast({
          title: "Parse Failed",
          description: response.error || "Failed to parse resume",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setResult(`Error: ${errorMsg}`);
      toast({
        title: "Test Failed",
        description: "Failed to test resume parser",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText size={20} />
          Resume Parser Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">User ID:</label>
          <Input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user UUID"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">File Name:</label>
          <Input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="e.g., resume_test.pdf"
          />
        </div>

        <Button 
          onClick={handleTest} 
          disabled={testing || !userId || !fileName}
          className="w-full"
        >
          {testing ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2" />
              Testing Resume Parser...
            </>
          ) : (
            'Test Resume Parser'
          )}
        </Button>

        {result && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Analysis Result:</label>
            <Textarea
              value={result}
              readOnly
              className="min-h-[200px] bg-gray-50"
            />
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          <p>📝 This will test the parse_resume_ai edge function</p>
          <p>📁 Make sure the file exists in the documents bucket under resumes/</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeParserTest;
