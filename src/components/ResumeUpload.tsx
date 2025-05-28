import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { uploadResumeToSupabase, deleteResumeFromSupabase } from '../services/resumeUpload';
import { Upload, File, Trash2, Download, CheckCircle } from 'lucide-react';
import ResumeViewer from './ResumeViewer';

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

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    console.log('📤 Starting file upload:', file.name);

    try {
      const result = await uploadResumeToSupabase(file, user.id);

      if (result.success && result.fileUrl && result.filePath) {
        console.log('✅ Upload successful');
        toast({
          title: "Resume uploaded successfully!",
          description: "Your resume has been uploaded and saved to your profile.",
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
        description: "An unexpected error occurred while uploading your resume.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset file input
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
          accept=".pdf,.doc,.docx"
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
            disabled={uploading}
            className="flex items-center gap-2"
          >
            <Upload size={14} />
            {uploading ? 'Uploading...' : 'Upload Resume'}
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
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />

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
                    PDF/Word document
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
              disabled={uploading}
              variant="outline"
              className="w-full"
            >
              <Upload size={16} className="mr-2" />
              {uploading ? 'Uploading...' : 'Replace Resume'}
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
                Choose a PDF or Word document (max 5MB)
              </p>
              <Button disabled={uploading}>
                {uploading ? 'Uploading...' : 'Choose File'}
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground text-center">
              Supported formats: PDF, DOC, DOCX • Maximum size: 5MB
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;
