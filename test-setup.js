import { supabase } from './src/integrations/supabase/client.js';

// Test script to verify resume upload setup
async function testResumeUploadSetup() {
  console.log('🔍 Testing Resume Upload Setup...\n');

  // Test 1: Check if profiles table has resume fields
  console.log('1. Checking database schema...');
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, resume_url, resume_file_path')
      .limit(1);

    if (error) {
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        console.log('❌ Resume fields missing from profiles table');
        console.log('   → Run the SQL migration in Supabase Dashboard');
      } else {
        console.log('❌ Database error:', error.message);
      }
    } else {
      console.log('✅ Resume fields exist in profiles table');
    }
  } catch (err) {
    console.log('❌ Database connection error:', err.message);
  }

  // Test 2: Check storage bucket
  console.log('\n2. Checking storage bucket...');
  try {
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
      console.log('❌ Storage error:', error.message);
    } else {
      const documentsBucket = data.find(bucket => bucket.name === 'documents');
      if (documentsBucket) {
        console.log('✅ Documents bucket exists');
        console.log(`   → Public: ${documentsBucket.public}`);
      } else {
        console.log('❌ Documents bucket not found');
        console.log('   → Create "documents" bucket in Supabase Dashboard');
        console.log('   Available buckets:', data.map(b => b.name).join(', '));
      }
    }
  } catch (err) {
    console.log('❌ Storage connection error:', err.message);
  }

  // Test 3: Check storage permissions
  console.log('\n3. Checking storage permissions...');
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .list('resumes', { limit: 1 });

    if (error) {
      if (error.message.includes('bucket') && error.message.includes('not found')) {
        console.log('❌ Documents bucket not found or not accessible');
      } else {
        console.log('❌ Storage permission error:', error.message);
      }
    } else {
      console.log('✅ Storage bucket accessible');
    }
  } catch (err) {
    console.log('❌ Storage permission error:', err.message);
  }

  console.log('\n📋 Setup Summary:');
  console.log('1. Database schema: Check profiles table has resume_url and resume_file_path columns');
  console.log('2. Storage bucket: Create "documents" bucket (public)');
  console.log('3. Storage policies: Set up RLS policies for file access');
  console.log('\nSee RESUME_SETUP_INSTRUCTIONS.md for detailed steps');
}

// Run the test
testResumeUploadSetup();
