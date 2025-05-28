-- Setup script for Supabase storage and resume functionality

-- First, create the storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Add resume fields to the profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS resume_url TEXT,
ADD COLUMN IF NOT EXISTS resume_file_path TEXT;

-- Set up Row Level Security (RLS) policies for the documents bucket

-- Policy for users to insert their own documents
CREATE POLICY "Users can upload documents" ON storage.objects
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = 'resumes'
);

-- Policy for users to view documents (public read for resumes)
CREATE POLICY "Public can view resumes" ON storage.objects
FOR SELECT 
TO public
USING (bucket_id = 'documents');

-- Policy for users to update their own documents
CREATE POLICY "Users can update their documents" ON storage.objects
FOR UPDATE 
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = 'resumes'
  AND auth.uid() IS NOT NULL
);

-- Policy for users to delete their own documents
CREATE POLICY "Users can delete their documents" ON storage.objects
FOR DELETE 
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = 'resumes'
  AND auth.uid() IS NOT NULL
);

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
