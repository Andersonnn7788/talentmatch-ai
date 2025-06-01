import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { checkDatabaseSetup, printSetupReport } from '../utils/databaseSetupCheck';
import ResumeUpload from '../components/ResumeUpload';
import ResumeParserTest from '../components/ResumeParserTest';

export default function TestPage() {
  const [setupResults, setSetupResults] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const runSetupCheck = async () => {
    setIsChecking(true);
    try {
      const results = await checkDatabaseSetup();
      setSetupResults(results);
      printSetupReport(results);
      
      // Show upload component if everything is working
      const allGood = results.every(r => r.status === 'success');
      setShowUpload(allGood);
    } catch (error) {
      console.error('Setup check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'missing': return '⚠️';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'missing': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Database Setup & Testing</h1>
          <p className="text-gray-600 mt-2">Verify Supabase configuration and test functionality</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🎉 Supabase Configuration Complete!</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertDescription className="text-green-600">
                ✅ You've successfully added the necessary policies in Supabase! 
                Now let's verify everything is working correctly.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={runSetupCheck} 
              disabled={isChecking}
              className="mb-4"
            >
              {isChecking ? 'Checking Configuration...' : 'Verify Supabase Setup'}
            </Button>

            {setupResults.length > 0 && (
              <div className="space-y-3">
                {setupResults.map((result, index) => (
                  <Alert key={index}>
                    <AlertDescription>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getStatusIcon(result.status)}</span>
                        <span className="font-medium">{result.step}:</span>
                        <span className={getStatusColor(result.status)}>
                          {result.message}
                        </span>
                      </div>
                      {result.sqlToRun && (
                        <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-x-auto">
                          {result.sqlToRun}
                        </pre>
                      )}
                    </AlertDescription>
                  </Alert>
                ))}
                
                {setupResults.every(r => r.status === 'success') && (
                  <Alert>
                    <AlertDescription className="text-green-600 font-medium">
                      🎉 All setup steps completed! Resume upload should work perfectly.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resume Parser Test */}
        <div className="flex justify-center">
          <ResumeParserTest />
        </div>

        {showUpload && (
          <Card>
            <CardHeader>
              <CardTitle>Test Resume Upload</CardTitle>
            </CardHeader>
            <CardContent>            <ResumeUpload 
              onUploadSuccess={(fileUrl, filePath) => {
                console.log('Upload successful:', { fileUrl, filePath });
                alert(`Upload successful! File URL: ${fileUrl}`);
              }}
              onDeleteSuccess={() => {
                console.log('Delete successful');
                alert('File deleted successfully!');
              }}
            />
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>📋 What Should Work Now</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span>Database schema updated with resume fields</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span>Storage bucket "documents" created and configured</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span>Storage policies added for secure file operations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600">🧪</span>
              <span>Ready to test resume upload functionality</span>
            </div>
            
            <Alert className="mt-4">
              <AlertDescription>
                <strong>Next Steps:</strong>
                <br />1. Click "Verify Supabase Setup" above to confirm all configurations
                <br />2. If all checks pass, test resume upload using the component below
                <br />3. Try uploading a PDF, DOC, or DOCX file (max 5MB)
                <br />4. Check your Supabase Storage to see the uploaded file
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
