-- Manual Database Migration Script
-- Run this in Supabase SQL Editor to set up resume upload functionality

-- 1. Add resume fields to profiles table if they don't exist
DO $$ 
BEGIN
    -- Check and add resume_url column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'resume_url'
    ) THEN
        ALTER TABLE profiles ADD COLUMN resume_url TEXT;
        RAISE NOTICE 'Added resume_url column to profiles table';
    ELSE
        RAISE NOTICE 'resume_url column already exists';
    END IF;
    
    -- Check and add resume_file_path column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'resume_file_path'
    ) THEN
        ALTER TABLE profiles ADD COLUMN resume_file_path TEXT;
        RAISE NOTICE 'Added resume_file_path column to profiles table';
    ELSE
        RAISE NOTICE 'resume_file_path column already exists';
    END IF;
END $$;

-- 2. Create storage bucket for documents (run this if bucket doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents', 
    'documents', 
    true, 
    52428800, -- 50MB limit
    ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 3. Set up RLS policies for the documents bucket
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can view resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their resumes" ON storage.objects;

-- Create new policies
CREATE POLICY "Users can upload resumes" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'documents' 
    AND (storage.foldername(name))[1] = 'resumes'
    AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can view resumes" ON storage.objects
FOR SELECT USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = 'resumes'
);

CREATE POLICY "Users can update their resumes" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = 'resumes'
    AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete their resumes" ON storage.objects
FOR DELETE USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = 'resumes'
    AND auth.uid() IS NOT NULL
);

-- 4. Verify the setup
SELECT 'Database schema check:' as step;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('resume_url', 'resume_file_path');

SELECT 'Storage bucket check:' as step;
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'documents';
