
import { supabase } from '../integrations/supabase/client';

export interface AIAssistantRequest {
  userInput: string;
  resumeText?: string;
  userType: 'employee' | 'recruiter';
  userName?: string;
}

export interface AIAssistantResponse {
  success: boolean;
  response?: string;
  error?: string;
}

export const getAIAssistantResponse = async (
  request: AIAssistantRequest
): Promise<AIAssistantResponse> => {
  try {
    console.log('🤖 Sending request to AI assistant...');
    
    const { data, error } = await supabase.functions.invoke('ai-assistant', {
      body: request
    });

    if (error) {
      console.error('❌ AI assistant error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get AI response'
      };
    }

    if (!data?.response) {
      return {
        success: false,
        error: 'No response from AI'
      };
    }

    console.log('✅ AI assistant response received');
    return {
      success: true,
      response: data.response
    };

  } catch (error) {
    console.error('❌ AI assistant service error:', error);
    return {
      success: false,
      error: 'Failed to connect to AI service'
    };
  }
};
