# TalentMatch AI Configuration Guide

## 🔧 Configuration Steps Required

### 1. Supabase Database Configuration

You need to manually configure your Supabase database to enable resume upload functionality.

#### Step 1: Access Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (rezbwjeatqupurpkodlu)
3. Navigate to the SQL Editor

#### Step 2: Add Resume Fields to Profiles Table
Copy and run this SQL in the Supabase SQL Editor:

```sql
-- Add resume fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS resume_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS resume_file_path TEXT;
```

#### Step 3: Create Storage Bucket
1. In Supabase Dashboard, go to **Storage**
2. Click **"Create a new bucket"**
3. Bucket name: `documents`
4. Set as **Public bucket**: ✅ (checked)
5. File size limit: 50MB (default is fine)
6. Allowed MIME types: 
   - `application/pdf`
   - `application/msword` 
   - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
7. Click **"Create bucket"**

#### Step 4: Set Up Storage Security Policies
After creating the bucket, go to **Storage > documents bucket > Policies** and add these policies:

```sql
-- Policy 1: Allow users to upload resumes
CREATE POLICY "Users can upload resumes" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = 'resumes'
  AND auth.uid() IS NOT NULL
);

-- Policy 2: Allow users to view resumes
CREATE POLICY "Users can view resumes" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = 'resumes'
);

-- Policy 3: Allow users to update their resumes
CREATE POLICY "Users can update their resumes" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = 'resumes'
  AND auth.uid() IS NOT NULL
);

-- Policy 4: Allow users to delete their resumes
CREATE POLICY "Users can delete their resumes" ON storage.objects
FOR DELETE USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = 'resumes'
  AND auth.uid() IS NOT NULL
);
```

### 2. Test the Configuration

#### Automated Testing
1. Open: http://localhost:8083/test
2. Click **"Run Setup Check"**
3. Review results - all should show ✅ green checkmarks
4. If any issues, follow the provided SQL instructions

#### Manual Testing
1. Log into your application
2. Go to Employee Profile page
3. Try uploading a resume file (PDF, DOC, or DOCX)
4. Verify file appears in Supabase Storage

### 3. Environment Verification

Make sure your `.env.local` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=https://rezbwjeatqupurpkodlu.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 📝 Configuration Checklist

- [ ] Database schema updated (resume_url, resume_file_path columns added)
- [ ] Storage bucket "documents" created as public
- [ ] Storage policies configured for CRUD operations
- [ ] Test page shows all green checkmarks
- [ ] Resume upload works from Employee Profile
- [ ] Files appear in Supabase Storage under documents/resumes/

## 🔍 Troubleshooting

### Common Issues:

1. **"Storage bucket not found"**
   - Create the "documents" bucket in Supabase Storage
   - Make sure it's set as public

2. **"Permission denied" errors**
   - Add the storage policies using the SQL provided above
   - Ensure user is authenticated

3. **"Column does not exist" errors**
   - Run the ALTER TABLE commands to add resume fields

4. **File upload fails**
   - Check file size (max 5MB)
   - Verify file type (PDF, DOC, DOCX only)
   - Ensure user is logged in

## 🎯 Next Steps After Configuration

Once configuration is complete:
1. Resume upload will work on Employee Profile pages
2. Job search can include resume uploads
3. Recruiters can view candidate resumes
4. All error handling is already implemented

The application is ready for production use once these configuration steps are completed!
