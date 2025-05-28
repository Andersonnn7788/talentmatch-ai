import { supabase } from '../integrations/supabase/client';

export interface ResumeUploadResult {
  success: boolean;
  fileUrl?: string;
  filePath?: string;
  error?: string;
}

export const uploadResumeToSupabase = async (
  file: File,
  userId: string
): Promise<ResumeUploadResult> => {
  try {
    console.log('🔄 Starting resume upload for user:', userId);
    console.log('📄 File details:', { name: file.name, size: file.size, type: file.type });

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      console.error('❌ Invalid file type:', file.type);
      return {
        success: false,
        error: 'Please upload a PDF or Word document (.pdf, .doc, .docx)'
      };
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      console.error('❌ File too large:', file.size, 'bytes');
      return {
        success: false,
        error: 'File size must be less than 5MB'
      };
    }

    // Create unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `resume_${userId}_${timestamp}.${fileExtension}`;
    const filePath = `resumes/${fileName}`;

    console.log('📁 Upload path:', filePath);

    // Upload file to Supabase Storage
    console.log('⬆️ Uploading file to storage...');
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ Upload error details:', error);
      
      // Provide more specific error messages
      if (error.message.includes('Bucket not found')) {
        return {
          success: false,
          error: 'Document storage not found. Please contact support to set up the storage bucket.'
        };
      } else if (error.message.includes('duplicate')) {
        // Try with upsert if duplicate
        console.log('🔄 File exists, trying to replace...');
        const { data: replaceData, error: replaceError } = await supabase.storage
          .from('documents')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (replaceError) {
          console.error('❌ Replace upload error:', replaceError);
          return {
            success: false,
            error: 'Failed to replace existing file. Please try again.'
          };
        }
      } else if (error.message.includes('policy')) {
        return {
          success: false,
          error: 'Permission denied. Please contact support to configure storage policies.'
        };
      } else {
        return {
          success: false,
          error: `Upload failed: ${error.message}`
        };
      }
    }

    console.log('✅ File uploaded successfully:', data?.path);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    console.log('🔗 Public URL generated:', publicUrl);

    // Test database schema before updating profile
    try {
      const { data: schemaTest, error: schemaError } = await supabase
        .from('profiles')
        .select('resume_url, resume_file_path')
        .eq('id', userId)
        .limit(1);
      
      if (schemaError && schemaError.message.includes('column') && schemaError.message.includes('does not exist')) {
        console.error('❌ Database schema error - missing resume columns:', schemaError);
        return {
          success: false,
          error: 'Database not configured for resume uploads. Please contact support to run the migration.'
        };
      }
    } catch (schemaError) {
      console.error('❌ Schema test failed:', schemaError);
    }

    // Update user profile with resume URL
    console.log('💾 Updating user profile...');
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        resume_url: publicUrl,
        resume_file_path: filePath,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (profileError) {
      console.error('❌ Profile update error:', profileError);
      // Even if profile update fails, the file was uploaded successfully
      console.warn('⚠️ File uploaded but profile update failed');
      
      if (profileError.message.includes('column') && profileError.message.includes('does not exist')) {
        return {
          success: false,
          error: 'Database schema missing resume fields. Please contact support.'
        };
      }
      
      return {
        success: false,
        error: `Profile update failed: ${profileError.message}`
      };
    }

    console.log('✅ Resume upload completed successfully');
    return {
      success: true,
      fileUrl: publicUrl,
      filePath: filePath
    };

  } catch (error) {
    console.error('❌ Resume upload error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    };
  }
};

export const deleteResumeFromSupabase = async (
  filePath: string,
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Delete file from storage
    const { error: deleteError } = await supabase.storage
      .from('documents')
      .remove([filePath]);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return {
        success: false,
        error: 'Failed to delete file'
      };
    }

    // Update user profile to remove resume URL
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        resume_url: null,
        resume_file_path: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (profileError) {
      console.error('Profile update error:', profileError);
    }

    return { success: true };

  } catch (error) {
    console.error('Resume delete error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
};
