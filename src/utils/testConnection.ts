// Simple test to check Supabase connection for resume upload
import { supabase } from '@/integrations/supabase/client';

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test 1: Check if we can connect to the database
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Database connection error:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    
    // Test 2: Check storage buckets
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('Storage error:', bucketError.message);
      return false;
    }
    
    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    if (!documentsBucket) {
      console.error('❌ Documents bucket not found');
      return false;
    }
    
    console.log('✅ Storage bucket found:', documentsBucket.name);
    return true;
    
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}

export { testSupabaseConnection };
