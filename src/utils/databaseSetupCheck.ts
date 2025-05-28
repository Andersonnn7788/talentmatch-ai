// Database setup verification script for resume upload functionality
import { supabase } from '../integrations/supabase/client';

interface SetupCheckResult {
  step: string;
  status: 'success' | 'error' | 'missing';
  message: string;
  sqlToRun?: string;
}

export async function checkDatabaseSetup(): Promise<SetupCheckResult[]> {
  const results: SetupCheckResult[] = [];

  // Check 1: Database connection
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    if (error) {
      results.push({
        step: 'Database Connection',
        status: 'error',
        message: `Connection failed: ${error.message}`
      });
      return results; // If we can't connect, stop here
    }
    results.push({
      step: 'Database Connection',
      status: 'success',
      message: 'Successfully connected to Supabase'
    });
  } catch (error) {
    results.push({
      step: 'Database Connection',
      status: 'error',
      message: `Connection error: ${error}`
    });
    return results;
  }

  // Check 2: Profiles table structure
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('resume_url, resume_file_path')
      .limit(1);
    
    if (error && error.message.includes('column') && error.message.includes('does not exist')) {
      results.push({
        step: 'Database Schema',
        status: 'missing',
        message: 'Resume fields missing from profiles table',
        sqlToRun: `
-- Add resume fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS resume_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS resume_file_path TEXT;`
      });
    } else if (error) {
      results.push({
        step: 'Database Schema',
        status: 'error',
        message: `Schema check failed: ${error.message}`
      });
    } else {
      results.push({
        step: 'Database Schema',
        status: 'success',
        message: 'Resume fields exist in profiles table'
      });
    }
  } catch (error) {
    results.push({
      step: 'Database Schema',
      status: 'error',
      message: `Schema check error: ${error}`
    });
  }

  // Check 3: Storage bucket 'documents'
  try {
    // Attempt to list files in the root of the 'documents' bucket.
    const { error: listError } = await supabase.storage
      .from('documents')
      .list('', { limit: 1, offset: 0 });

    if (listError) {
      const isBucketNotFoundError =
        (listError.message && listError.message.toLowerCase().includes('bucket not found')) ||
        (listError.stack && listError.stack.toLowerCase().includes('bucketnotfound'));

      if (isBucketNotFoundError) {
        results.push({
          step: "Storage Bucket 'documents'",
          status: 'missing',
          message: "The 'documents' bucket was not found. Please create it.",
          sqlToRun: `\\r\\n-- Create documents bucket (run in Supabase SQL Editor)\\r\\nINSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)\\r\\nVALUES (\\r\\n  'documents', \\r\\n  'documents', \\r\\n  true,  -- Set to true if bucket contents are generally public; RLS policies will still apply to objects.\\r\\n  52428800, -- 50MB limit\\r\\n  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']\\r\\n);`
        });
      } else {
        results.push({
          step: "Storage Bucket 'documents' Access",
          status: 'error',
          message: `Failed to access 'documents' bucket: ${listError.message}. Check RLS policies for bucket listing or network issues.`
        });
      }
    } else {
      results.push({
        step: "Storage Bucket 'documents'",
        status: 'success',
        message: "'documents' bucket exists and is accessible."
      });
    }
  } catch (error: any) {
    results.push({
      step: "Storage Bucket 'documents'",
      status: 'error',
      message: `Error during 'documents' bucket check: ${error.message || String(error)}`
    });
  }

  // Check 4: Test file upload to storage
  if (results.find(r => r.step === "Storage Bucket 'documents'" && r.status === 'success')) {
    try {
      // Try to list files in resumes folder (this will test permissions)
      const { data, error } = await supabase.storage
        .from('documents')
        .list('resumes', { limit: 1 });

      if (error) {
        results.push({
          step: 'Storage Permissions',
          status: 'missing',
          message: 'Storage policies not configured',
          sqlToRun: `
-- Storage policies (run in Supabase dashboard)
CREATE POLICY "Users can upload resumes" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = 'resumes');

CREATE POLICY "Users can view resumes" ON storage.objects
FOR SELECT USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = 'resumes');`
        });
      } else {
        results.push({
          step: 'Storage Permissions',
          status: 'success',
          message: 'Storage policies working correctly'
        });
      }
    } catch (error) {
      results.push({
        step: 'Storage Permissions',
        status: 'error',
        message: `Permissions check error: ${error}`
      });
    }
  }

  return results;
}

export function printSetupReport(results: SetupCheckResult[]) {
  console.log('\n=== RESUME UPLOAD SETUP CHECK ===\n');
  
  results.forEach(result => {
    const statusIcon = result.status === 'success' ? '✅' : 
                      result.status === 'missing' ? '⚠️' : '❌';
    
    console.log(`${statusIcon} ${result.step}: ${result.message}`);
    
    if (result.sqlToRun) {
      console.log(`   SQL to run:${result.sqlToRun}\n`);
    }
  });

  const missingSteps = results.filter(r => r.status === 'missing' || r.status === 'error');
  if (missingSteps.length === 0) {
    console.log('🎉 All setup steps completed! Resume upload should work.');
  } else {
    console.log(`\n📋 ${missingSteps.length} steps need attention before resume upload will work.`);
  }
}
