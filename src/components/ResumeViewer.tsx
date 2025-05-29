
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Download, ExternalLink, Eye, FileText, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface ResumeViewerProps {
  resumeUrl: string;
  fileName?: string;
  compact?: boolean;
}

const ResumeViewer: React.FC<ResumeViewerProps> = ({ 
  resumeUrl, 
  fileName = 'resume.pdf', 
  compact = false 
}) => {
  const [viewerError, setViewerError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDownload = async () => {
    try {
      console.log('📥 Starting download for:', resumeUrl);
      
      // Create a temporary anchor element for download
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = fileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('✅ Download initiated successfully');
    } catch (error) {
      console.error('❌ Download failed:', error);
      setViewerError('Download failed. Please try again or contact support.');
    }
  };

  const handleExternalView = () => {
    try {
      console.log('🔗 Opening external view for:', resumeUrl);
      window.open(resumeUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('❌ External view failed:', error);
      setViewerError('Unable to open in new tab. Please try downloading the file.');
    }
  };

  const handleDialogView = () => {
    setViewerError(null);
    setIsDialogOpen(true);
  };

  const isImage = Boolean(fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/));
  const isPDF = fileName.toLowerCase().endsWith('.pdf');

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="flex items-center gap-1">
          <FileText size={12} />
          Resume uploaded
        </Badge>
        
        <Button
          size="sm"
          variant="outline"
          onClick={handleDialogView}
          className="h-8 w-8 p-0"
          title="View resume"
        >
          <Eye size={14} />
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={handleDownload}
          className="h-8 w-8 p-0"
          title="Download resume"
        >
          <Download size={14} />
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={handleExternalView}
          className="h-8 w-8 p-0"
          title="Open in new tab"
        >
          <ExternalLink size={14} />
        </Button>

        <ResumeViewerDialog 
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          resumeUrl={resumeUrl}
          fileName={fileName}
          viewerError={viewerError}
          setViewerError={setViewerError}
          isPDF={isPDF}
          isImage={isImage}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Eye size={16} />
            View Resume
          </Button>
        </DialogTrigger>
        
        <ResumeViewerDialog 
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          resumeUrl={resumeUrl}
          fileName={fileName}
          viewerError={viewerError}
          setViewerError={setViewerError}
          isPDF={isPDF}
          isImage={isImage}
        />
      </Dialog>
      
      <Button
        variant="outline"
        onClick={handleDownload}
        className="flex items-center gap-2"
      >
        <Download size={16} />
        Download
      </Button>
      
      <Button
        variant="outline"
        onClick={handleExternalView}
        className="flex items-center gap-2"
      >
        <ExternalLink size={16} />
        Open in New Tab
      </Button>
    </div>
  );
};

interface ResumeViewerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  resumeUrl: string;
  fileName: string;
  viewerError: string | null;
  setViewerError: (error: string | null) => void;
  isPDF: boolean;
  isImage: boolean;
}

const ResumeViewerDialog: React.FC<ResumeViewerDialogProps> = ({
  isOpen,
  onOpenChange,
  resumeUrl,
  fileName,
  viewerError,
  setViewerError,
  isPDF,
  isImage
}) => {
  const [loadError, setLoadError] = useState(false);

  const handleIframeError = () => {
    console.warn('⚠️ PDF iframe failed to load');
    setLoadError(true);
    setViewerError('PDF preview not available. Please download the file or open in a new tab.');
  };

  const handleImageError = () => {
    console.warn('⚠️ Image failed to load');
    setLoadError(true);
    setViewerError('Image preview not available. Please download the file.');
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileText size={20} />
          {fileName}
        </DialogTitle>
      </DialogHeader>
      
      <div className="flex-1 min-h-0 p-4">
        {viewerError && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{viewerError}</AlertDescription>
          </Alert>
        )}
        
        {!loadError && isPDF && (
          <div className="w-full h-full min-h-[600px] border rounded">
            <iframe
              src={`${resumeUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              className="w-full h-full"
              title="Resume Preview"
              onError={handleIframeError}
              onLoad={() => {
                console.log('✅ PDF loaded successfully in iframe');
                setLoadError(false);
                setViewerError(null);
              }}
            />
          </div>
        )}
        
        {!loadError && isImage && (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={resumeUrl}
              alt="Resume"
              className="max-w-full max-h-full object-contain"
              onError={handleImageError}
              onLoad={() => {
                console.log('✅ Image loaded successfully');
                setLoadError(false);
                setViewerError(null);
              }}
            />
          </div>
        )}
        
        {(loadError || (!isPDF && !isImage)) && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded border-2 border-dashed">
            <FileText size={48} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {!isPDF && !isImage ? 'Preview not available' : 'Preview failed to load'}
            </h3>
            <p className="text-gray-500 text-center mb-4">
              {!isPDF && !isImage 
                ? 'This file type cannot be previewed in the browser.'
                : 'The file preview could not be displayed.'
              }
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = resumeUrl;
                  link.download = fileName;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Download File
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(resumeUrl, '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink size={16} />
                Open in New Tab
              </Button>
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  );
};

export default ResumeViewer;
