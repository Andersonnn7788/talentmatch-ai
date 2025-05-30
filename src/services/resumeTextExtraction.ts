
import { supabase } from '../integrations/supabase/client';

export interface ResumeTextResult {
  success: boolean;
  text?: string;
  error?: string;
}

export const extractResumeText = async (resumeUrl: string): Promise<ResumeTextResult> => {
  try {
    console.log('📄 Extracting text from resume:', resumeUrl);
    
    // Call the OCR edge function to extract text from the resume
    const { data, error } = await supabase.functions.invoke('extract-resume-text', {
      body: {
        resumeUrl: resumeUrl
      }
    });

    if (error) {
      console.error('❌ OCR extraction error:', error);
      return {
        success: false,
        error: error.message || 'Failed to extract text from resume'
      };
    }

    if (!data?.text) {
      return {
        success: false,
        error: 'No text extracted from resume'
      };
    }

    console.log('✅ Resume text extracted successfully');
    return {
      success: true,
      text: data.text
    };
    
  } catch (error) {
    console.error('❌ Resume text extraction error:', error);
    return {
      success: false,
      error: 'Failed to extract text from resume'
    };
  }
};
