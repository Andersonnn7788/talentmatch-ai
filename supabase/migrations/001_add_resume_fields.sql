-- Add resume fields to profiles table
ALTER TABLE profiles 
ADD COLUMN resume_url TEXT,
ADD COLUMN resume_file_path TEXT;

-- Create storage bucket for documents if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the documents bucket
CREATE POLICY "Users can upload their own documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  OR (storage.foldername(name))[1] = 'resumes'
);

CREATE POLICY "Users can view their own documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
  OR (storage.foldername(name))[1] = 'resumes'
);

CREATE POLICY "Users can update their own documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
  OR (storage.foldername(name))[1] = 'resumes'
);

CREATE POLICY "Users can delete their own documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
  OR (storage.foldername(name))[1] = 'resumes'
);
