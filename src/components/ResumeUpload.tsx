import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { uploadResumeToSupabase, deleteResumeFromSupabase } from '../services/resumeUpload';
import { validatePDFFile, getPDFValidationMessage } from '../services/pdfValidator';
import { Upload, File, Trash2, Download, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface ResumeUploadProps {
  currentResumeUrl?: string;
  currentResumeFilePath?: string;
  onUploadSuccess?: (fileUrl: string, filePath: string) => void;
  onDeleteSuccess?: () => void;
  compact?: boolean;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({
  currentResumeUrl,
  currentResumeFilePath,
  onUploadSuccess,
  onDeleteSuccess,
  compact = false
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setValidating(true);
    setValidationResult(null);

    try {
      // Client-side PDF validation
      console.log('🔍 Validating PDF file:', file.name);
      const validation = await validatePDFFile(file);
      setValidationResult(validation);

      if (!validation.isValid) {
        console.error('❌ PDF validation failed:', validation.errors);
        toast({
          title: "Invalid PDF file",
          description: validation.errors.join('. '),
          variant: "destructive",
        });
        setValidating(false);
        return;
      }

      if (validation.warnings.length > 0) {
        console.warn('⚠️ PDF validation warnings:', validation.warnings);
        toast({
          title: "PDF validation warnings",
          description: validation.warnings.join('. ') + ' Processing will continue.',
          variant: "default",
        });
      }

      console.log('✅ PDF validation passed:', validation.info);

      // Proceed with upload
      setUploading(true);
      console.log('📤 Starting file upload:', file.name);
      
      const result = await uploadResumeToSupabase(file, user.id);

      if (result.success && result.fileUrl && result.filePath) {
        console.log('✅ Upload successful');
        localStorage.setItem('lastUploadedResumeUrl', result.fileUrl);
        
        toast({
          title: "Resume uploaded successfully!",
          description: "Your resume has been uploaded and AI analysis will begin automatically.",
        });
        onUploadSuccess?.(result.fileUrl, result.filePath);
      } else {
        console.error('❌ Upload failed:', result.error);
        toast({
          title: "Upload failed",
          description: result.error || "Failed to upload resume. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      toast({
        title: "Upload error",
        description: "An unexpected error occurred while processing your resume.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setValidating(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!currentResumeFilePath || !user) return;

    setDeleting(true);

    try {
      const result = await deleteResumeFromSupabase(currentResumeFilePath, user.id);

      if (result.success) {
        toast({
          title: "Resume deleted",
          description: "Your resume has been removed from your profile.",
        });
        onDeleteSuccess?.();
      } else {
        toast({
          title: "Delete failed",
          description: result.error || "Failed to delete resume. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = () => {
    if (currentResumeUrl) {
      window.open(currentResumeUrl, '_blank');
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {currentResumeUrl ? (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle size={12} className="text-green-500" />
              Resume uploaded
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownload}
              className="h-8 w-8 p-0"
            >
              <Download size={14} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              disabled={deleting}
              className="h-8 w-8 p-0"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={handleFileSelect}
            disabled={uploading || validating}
            className="flex items-center gap-2"
          >
            <Upload size={14} />
            {uploading ? 'Uploading...' : validating ? 'Validating...' : 'Upload Resume'}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <File size={20} />
          Resume
        </CardTitle>
      </CardHeader>
      <CardContent>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* PDF Validation Results */}
        {validationResult && (
          <div className="mb-4">
            {validationResult.isValid ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  PDF validation passed. {getPDFValidationMessage(validationResult)}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {getPDFValidationMessage(validationResult)}
                </AlertDescription>
              </Alert>
            )}
            
            {validationResult.info && (
              <div className="mt-2 text-xs text-muted-foreground">
                <div className="flex flex-wrap gap-2">
                  <span>Size: {(validationResult.info.size / 1024 / 1024).toFixed(2)}MB</span>
                  {validationResult.info.version && <span>PDF {validationResult.info.version}</span>}
                  {validationResult.info.hasText ? (
                    <Badge variant="outline" className="text-xs">
                      <CheckCircle size={10} className="mr-1" />
                      Contains text
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      <Info size={10} className="mr-1" />
                      May need OCR
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {currentResumeUrl ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded">
                  <File size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">Resume uploaded</p>
                  <p className="text-sm text-muted-foreground">
                    PDF document
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownload}
                >
                  <Download size={16} className="mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  <Trash2 size={16} className="mr-1" />
                  {deleting ? 'Deleting...' : 'Remove'}
                </Button>
              </div>
            </div>
            
            <Button
              onClick={handleFileSelect}
              disabled={uploading || validating}
              variant="outline"
              className="w-full"
            >
              <Upload size={16} className="mr-2" />
              {uploading ? 'Uploading...' : validating ? 'Validating...' : 'Replace Resume'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={handleFileSelect}
            >
              <Upload size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">Upload your resume</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose a PDF document (max 10MB)
              </p>
              <Button disabled={uploading || validating}>
                {uploading ? 'Uploading...' : validating ? 'Validating...' : 'Choose File'}
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground text-center">
              Supported format: PDF only • Maximum size: 10MB
              <br />
              For best results, use text-based PDFs (not scanned images)
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;
