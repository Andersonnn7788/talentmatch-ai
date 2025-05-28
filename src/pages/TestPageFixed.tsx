import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { checkDatabaseSetup, printSetupReport } from '../utils/databaseSetupCheck';
import ResumeUpload from '../components/ResumeUpload';

export default function TestPage() {
  const [setupResults, setSetupResults] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [hasRunCheck, setHasRunCheck] = useState(false);

  const runSetupCheck = async () => {
    setIsChecking(true);
    setHasRunCheck(true);
    try {
      const results = await checkDatabaseSetup();
      setSetupResults(results);
      printSetupReport(results);
      
      // Show upload component if everything is working
      const allGood = results.every(r => r.status === 'success');
      setShowUpload(allGood);
      
      if (allGood) {
        console.log('🎉 All systems ready! Resume upload should work perfectly.');
      }
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
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">🧪 Resume Upload Test Center</h1>
        <p className="text-lg text-gray-600">
          Verify your Supabase configuration and test resume upload functionality
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🎉 Configuration Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertDescription className="text-blue-600">
              ✅ <strong>Supabase Policies Added!</strong> Ready to verify your configuration.
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={runSetupCheck} 
            disabled={isChecking}
            className="mb-4"
            size="lg"
          >
            {isChecking ? 'Verifying Configuration...' : 'Verify Supabase Setup'}
          </Button>

          {hasRunCheck && setupResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg mb-3">Configuration Status:</h3>
              {setupResults.map((result, index) => (
                <Alert key={index}>
                  <AlertDescription>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getStatusIcon(result.status)}</span>
                      <span className="font-medium">{result.step}:</span>
                      <span className={getStatusColor(result.status)}>
                        {result.message}
                      </span>
                    </div>
                    {result.sqlToRun && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800">
                          Click to see required SQL
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-x-auto border">
                          {result.sqlToRun}
                        </pre>
                      </details>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
              
              {setupResults.every(r => r.status === 'success') && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800 font-medium">
                    🎉 Perfect! All configuration checks passed. Resume upload is ready to test!
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {showUpload && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🚀 Live Resume Upload Test</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertDescription>
                <strong>Test Instructions:</strong>
                <br />• Upload a PDF, DOC, or DOCX file (max 5MB)
                <br />• File will be stored in Supabase Storage under "documents/resumes/"
                <br />• Check the browser console for detailed logs
                <br />• Verify the file appears in your Supabase dashboard
              </AlertDescription>
            </Alert>
            
            <ResumeUpload 
              onUploadSuccess={(fileUrl, filePath) => {
                console.log('✅ Upload successful:', { fileUrl, filePath });
                alert(`🎉 Upload successful!\n\nFile URL: ${fileUrl}\nFile Path: ${filePath}\n\nCheck your Supabase Storage to see the file!`);
              }}
              onDeleteSuccess={() => {
                console.log('✅ Delete successful');
                alert('🗑️ File deleted successfully!');
              }}
            />
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>📋 Quick Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p><strong>✅ Expected:</strong> All checks show green checkmarks</p>
            <p><strong>📁 File Storage:</strong> documents/resumes/ folder in Supabase</p>
            <p><strong>🔍 Debugging:</strong> Check browser console for detailed logs</p>
            <p><strong>📊 Dashboard:</strong> Verify files in Supabase Storage</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
