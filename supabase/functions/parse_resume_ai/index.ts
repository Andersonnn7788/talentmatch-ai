
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  user_id: string;
  file_name: string;
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Simple PDF text extraction function
async function extractPDFText(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    // Convert ArrayBuffer to Uint8Array
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Simple text extraction - look for text objects in PDF
    const text = new TextDecoder().decode(uint8Array);
    
    // Extract text between BT and ET markers (basic PDF text extraction)
    const textMatches = text.match(/BT\s*(.*?)\s*ET/gs);
    if (textMatches) {
      let extractedText = '';
      for (const match of textMatches) {
        // Remove PDF commands and extract readable text
        const cleanText = match
          .replace(/BT|ET/g, '')
          .replace(/\/\w+\s+\d+\s+Tf/g, '')
          .replace(/\d+\s+\d+\s+Td/g, '')
          .replace(/\d+\.\d+\s+\d+\.\d+\s+\d+\.\d+\s+rg/g, '')
          .replace(/\(([^)]+)\)\s*Tj/g, '$1 ')
          .replace(/\[([^\]]+)\]\s*TJ/g, '$1 ')
          .trim();
        extractedText += cleanText + ' ';
      }
      return extractedText.trim();
    }
    
    // Fallback: search for common resume keywords and surrounding text
    const fallbackText = text.match(/[A-Za-z\s]{20,}/g)?.join(' ') || '';
    return fallbackText.substring(0, 2000);
  } catch (error) {
    console.error('PDF extraction error:', error);
    return 'Unable to extract text from PDF. Please ensure the file is a valid PDF document.';
  }
}

// Simple DOCX text extraction function
async function extractDOCXText(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    // Convert to text - this is a simple approach
    const text = new TextDecoder().decode(arrayBuffer);
    
    // Look for readable text patterns in DOCX
    const textMatches = text.match(/[A-Za-z][A-Za-z\s,.-]{10,}/g);
    if (textMatches) {
      return textMatches.join(' ').substring(0, 2000);
    }
    
    return 'Unable to extract text from DOCX. Please ensure the file is a valid Word document.';
  } catch (error) {
    console.error('DOCX extraction error:', error);
    return 'Unable to extract text from DOCX. Please ensure the file is a valid Word document.';
  }
}

async function analyzeWithOpenAI(resumeText: string): Promise<string> {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  // Trim to 1000 words max
  const words = resumeText.split(/\s+/);
  const trimmedText = words.slice(0, 1000).join(' ');

  const prompt = `Summarize this resume briefly.

Key skills

Most recent or current job title

Years of experience

Any certifications or major achievements

Be concise, clean, and use bullet points if needed.

Resume text:
${trimmedText}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a professional resume analyst. Provide clear, concise summaries with bullet points.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody: RequestBody = await req.json();
    console.log('📥 Request body:', JSON.stringify(requestBody, null, 2));

    const { user_id, file_name } = requestBody;

    if (!user_id || !file_name) {
      console.error('❌ Missing required fields:', { user_id: !!user_id, file_name: !!file_name });
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'user_id and file_name are required' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`🔄 Processing resume: ${file_name} for user: ${user_id}`);

    // Clean the file path - remove any duplicate 'resumes/' prefix
    let cleanFilePath = file_name;
    if (cleanFilePath.startsWith('resumes/resumes/')) {
      cleanFilePath = cleanFilePath.replace('resumes/resumes/', 'resumes/');
    }
    if (!cleanFilePath.startsWith('resumes/')) {
      cleanFilePath = `resumes/${cleanFilePath}`;
    }

    console.log(`📁 Cleaned file path: ${cleanFilePath}`);

    // Download file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(cleanFilePath);

    if (downloadError) {
      console.error('❌ File download error:', downloadError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Failed to download file: ${downloadError.message}. File path: ${cleanFilePath}` 
        }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ File downloaded successfully, size:', fileData.size);

    // Convert file to ArrayBuffer
    const arrayBuffer = await fileData.arrayBuffer();

    // Detect file type and extract text
    let extractedText = '';
    const fileName = cleanFilePath.toLowerCase();

    if (fileName.endsWith('.pdf')) {
      console.log('📄 Extracting text from PDF...');
      extractedText = await extractPDFText(arrayBuffer);
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      console.log('📝 Extracting text from DOCX...');
      extractedText = await extractDOCXText(arrayBuffer);
    } else {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Unsupported file type. Only PDF and DOCX files are supported.' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Log extracted text (truncated)
    const truncatedText = extractedText.length > 200 
      ? extractedText.substring(0, 200) + '...' 
      : extractedText;
    console.log('📝 Extracted text preview:', truncatedText);

    if (!extractedText || extractedText.length < 50) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Could not extract meaningful text from the file. Please ensure the file contains readable text.' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Analyze with OpenAI
    console.log('🤖 Sending to OpenAI for analysis...');
    const analysis = await analyzeWithOpenAI(extractedText);
    console.log('✅ OpenAI analysis completed');

    // Save to database
    const { data: insertData, error: insertError } = await supabase
      .from('resume_analysis')
      .insert({
        user_id,
        file_name: cleanFilePath,
        analysis,
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Database insert error:', insertError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Failed to save analysis: ${insertError.message}` 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ Analysis saved to database with ID:', insertData.id);

    return new Response(
      JSON.stringify({
        success: true,
        analysis_id: insertData.id,
        analysis: analysis,
        extracted_text_length: extractedText.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Parse resume error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Failed to parse resume'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
