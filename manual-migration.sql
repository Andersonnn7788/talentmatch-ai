-- Manual migration script to run in Supabase SQL Editor
-- Step 1: Add resume fields to profiles table
DO $$ 
BEGIN
    -- Check if columns exist, if not add them
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'resume_url') THEN
        ALTER TABLE profiles ADD COLUMN resume_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'resume_file_path') THEN
        ALTER TABLE profiles ADD COLUMN resume_file_path TEXT;
    END IF;
END $$;

-- Step 2: Create storage bucket (run this in the Supabase dashboard storage section)
-- Create a new bucket called 'documents' with public access

-- Step 3: Storage policies (run after creating the bucket)
-- Allow users to upload to resumes folder
CREATE POLICY IF NOT EXISTS "Users can upload resumes" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = 'resumes'
);

-- Allow users to view files in resumes folder  
CREATE POLICY IF NOT EXISTS "Users can view resumes" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = 'resumes'
);

-- Allow users to update their own files
CREATE POLICY IF NOT EXISTS "Users can update their resumes" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = 'resumes'
);

-- Allow users to delete their own files
CREATE POLICY IF NOT EXISTS "Users can delete their resumes" ON storage.objects
FOR DELETE USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = 'resumes'
);
