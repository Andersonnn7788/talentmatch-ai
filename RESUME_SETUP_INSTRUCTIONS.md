# Resume Upload Setup Instructions

## Current Status
✅ **Completed:**
- Resume upload service (`resumeUpload.ts`) with Supabase integration
- ResumeUpload component with drag-and-drop UI
- Database type definitions updated
- Integration into Employee Profile page
- Application running on http://localhost:8081

⚠️ **Pending Setup (Manual Steps Required):**

## Step 1: Database Schema Update
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/rezbwjeatqupurpkodlu)
2. Navigate to SQL Editor
3. Run this SQL to add resume fields to profiles table:

```sql
-- Add resume fields to profiles table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'resume_url') THEN
        ALTER TABLE profiles ADD COLUMN resume_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'resume_file_path') THEN
        ALTER TABLE profiles ADD COLUMN resume_file_path TEXT;
    END IF;
END $$;
```

## Step 2: Create Storage Bucket
1. In Supabase Dashboard, go to Storage
2. Click "Create a new bucket"
3. Name: `documents`
4. Make it **Public**
5. Click "Create bucket"

## Step 3: Set Up Storage Policies
1. After creating the bucket, go to Storage > documents bucket
2. Click on "Policies" tab
3. Add these policies by clicking "New Policy" and using the SQL editor:

### Policy 1: Upload Policy
```sql
CREATE POLICY "Users can upload resumes" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = 'resumes'
);
```

### Policy 2: View Policy  
```sql
CREATE POLICY "Users can view resumes" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = 'resumes'
);
```

### Policy 3: Update Policy
```sql
CREATE POLICY "Users can update their resumes" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = 'resumes'
);
```

### Policy 4: Delete Policy
```sql
CREATE POLICY "Users can delete their resumes" ON storage.objects
FOR DELETE USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = 'resumes'
);
```

## Step 4: Test the Functionality
1. Open http://localhost:8081
2. Sign up/Login to the application
3. Go to Employee Profile page
4. Test the resume upload component

## Features Implemented:
- ✅ File validation (PDF, DOC, DOCX only)
- ✅ Size limit (5MB max)
- ✅ Drag and drop interface
- ✅ Upload progress feedback
- ✅ File management (upload, delete, download)
- ✅ Integration with user profiles
- ✅ Error handling and user feedback
- ✅ Logout functionality (already working)

## Technical Details:
- Files stored in `documents/resumes/` folder in Supabase Storage
- File paths and URLs saved to user profiles table
- Secure upload with user authentication
- Public URLs for file access
- Automatic cleanup on file replacement

Once you complete the manual setup steps above, the resume upload functionality will be fully operational!
