
import { supabase } from '../integrations/supabase/client';

export interface TestParseResumeRequest {
  user_id: string;
  file_name: string;
}

export interface TestParseResumeResponse {
  success: boolean;
  analysis_id?: string;
  analysis?: string;
  extracted_text_length?: number;
  extraction_method?: string;
  diagnostics?: {
    pdfSize?: number;
    pdfVersion?: string;
    hasText?: boolean;
    hasImages?: boolean;
    isEncrypted?: boolean;
    extractionAttempts?: string[];
    fileSize?: number;
    hasTextObjects?: boolean;
    hasValidStructure?: boolean;
    successfulMethod?: string;
    textLength?: number;
    wordCount?: number;
  };
  error?: string;
}

export const testParseResume = async (
  request: TestParseResumeRequest
): Promise<TestParseResumeResponse> => {
  try {
    console.log('🧪 Testing resume parser with:', request);
    
    const { data, error } = await supabase.functions.invoke('parse_resume_ai', {
      body: request
    });

    if (error) {
      console.error('❌ Parse resume test error:', error);
      return {
        success: false,
        error: error.message || 'Failed to parse resume'
      };
    }

    console.log('✅ Parse resume test completed:', data);
    return {
      success: true,
      ...data
    };

  } catch (error) {
    console.error('❌ Parse resume test service error:', error);
    return {
      success: false,
      error: 'Failed to connect to parser service'
    };
  }
};
