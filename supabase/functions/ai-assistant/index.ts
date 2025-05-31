
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userInput, resumeText, userType, userName } = await req.json();

    if (!userInput) {
      return new Response(
        JSON.stringify({ error: 'User input is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('🤖 Processing AI assistant request for:', userName, 'Type:', userType);

    // Create the system prompt based on user type
    let systemPrompt = '';
    
    if (userType === 'employee') {
      systemPrompt = `You are a concise career assistant for a job-matching platform.

Respond to the user's question in brief, direct, and professional sentences.
Use clear structure and formatting with short lines.
Keep each sentence short (maximum 1 line).
Avoid long paragraphs.
Format responses as clean, organized points when possible.

Resume:
${resumeText || 'No resume provided yet'}

User Question:
${userInput}

Your goal is to help the user make better career decisions. Be brief, supportive, and helpful.`;
    } else {
      systemPrompt = `You are a concise recruiting assistant for a job-matching platform.

Respond to the user's question in brief, direct, and professional sentences.
Use clear structure and formatting with short lines.
Keep each sentence short (maximum 1 line).
Avoid long paragraphs.
Format responses as clean, organized points when possible.

User Question:
${userInput}

Your goal is to help the recruiter make better hiring decisions. Be brief, professional, and helpful.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInput }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('✅ AI assistant response generated');

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ AI assistant error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to get AI response'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
