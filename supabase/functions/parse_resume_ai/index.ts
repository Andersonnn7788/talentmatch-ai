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

// Improved PDF text extraction function
async function extractPDFText(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    console.log('🔍 Starting improved PDF text extraction...');
    
    // Convert ArrayBuffer to Uint8Array
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to string for text search
    const pdfString = new TextDecoder('latin1').decode(uint8Array);
    
    console.log('📄 PDF size:', uint8Array.length, 'bytes');
    
    // Method 1: Look for text streams between BT and ET markers
    let extractedText = '';
    const textStreamRegex = /BT\s*([\s\S]*?)\s*ET/g;
    const textStreams = pdfString.match(textStreamRegex);
    
    if (textStreams) {
      console.log('📝 Found', textStreams.length, 'text streams');
      
      for (const stream of textStreams) {
        // Clean text stream and extract readable content
        let cleanText = stream
          .replace(/BT|ET/g, '') // Remove text object markers
          .replace(/\/[A-Za-z]+\s+\d+\.?\d*\s+Tf/g, '') // Remove font definitions
          .replace(/\d+\.?\d*\s+\d+\.?\d*\s+Td/g, '') // Remove positioning
          .replace(/\d+\.?\d*\s+\d+\.?\d*\s+\d+\.?\d*\s+rg/g, '') // Remove color
          .replace(/\d+\.?\d*\s+\d+\.?\d*\s+\d+\.?\d*\s+RG/g, '') // Remove stroke color
          .replace(/\d+\.?\d*\s+w/g, '') // Remove line width
          .replace(/[qQ]/g, '') // Remove graphics state
          .replace(/\d+\.?\d*\s+\d+\.?\d*\s+m/g, '') // Remove move operations
          .replace(/\d+\.?\d*\s+\d+\.?\d*\s+l/g, '') // Remove line operations
          .replace(/[Ss]/g, '') // Remove stroke operations
          .trim();
        
        // Extract text from Tj operators
        const tjMatches = cleanText.match(/\(([^)]*)\)\s*Tj/g);
        if (tjMatches) {
          for (const match of tjMatches) {
            const text = match.replace(/\(([^)]*)\)\s*Tj/g, '$1');
            if (text && text.length > 1) {
              extractedText += text + ' ';
            }
          }
        }
        
        // Extract text from TJ operators (array format)
        const tjArrayMatches = cleanText.match(/\[(.*?)\]\s*TJ/g);
        if (tjArrayMatches) {
          for (const match of tjArrayMatches) {
            const arrayContent = match.replace(/\[(.*?)\]\s*TJ/g, '$1');
            const textParts = arrayContent.match(/\(([^)]*)\)/g);
            if (textParts) {
              for (const part of textParts) {
                const text = part.replace(/[()]/g, '');
                if (text && text.length > 1) {
                  extractedText += text + ' ';
                }
              }
            }
          }
        }
      }
    }
    
    // Method 2: If no text streams found, look for direct text patterns
    if (!extractedText || extractedText.trim().length < 50) {
      console.log('🔄 Trying alternative extraction method...');
      
      // Look for parentheses-enclosed text which often contains readable content
      const textMatches = pdfString.match(/\(([^)]{2,})\)/g);
      if (textMatches) {
        console.log('📝 Found', textMatches.length, 'text matches');
        
        for (const match of textMatches) {
          const text = match.replace(/[()]/g, '').trim();
          // Filter out likely non-text content
          if (text && 
              text.length > 2 && 
              text.length < 200 && 
              !/^[0-9\s\.\-]+$/.test(text) && // Not just numbers
              !/^[^a-zA-Z]*$/.test(text)) { // Contains letters
            extractedText += text + ' ';
          }
        }
      }
    }
    
    // Method 3: Look for common resume keywords and surrounding text
    if (!extractedText || extractedText.trim().length < 50) {
      console.log('🔄 Trying keyword-based extraction...');
      
      const resumeKeywords = ['experience', 'education', 'skills', 'work', 'employment', 'university', 'degree', 'certificate', 'project', 'email', 'phone', 'address'];
      
      for (const keyword of resumeKeywords) {
        const keywordRegex = new RegExp(`(.{0,100}${keyword}.{0,100})`, 'gi');
        const matches = pdfString.match(keywordRegex);
        if (matches) {
          for (const match of matches) {
            // Extract readable characters
            const readable = match.replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ').trim();
            if (readable.length > 10) {
              extractedText += readable + ' ';
            }
          }
        }
      }
    }
    
    // Clean up the final extracted text
    extractedText = extractedText
      .replace(/\s+/g, ' ') // Multiple spaces to single space
      .replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable characters
      .replace(/(.)\1{4,}/g, '$1') // Remove repeated characters
      .trim();
    
    console.log('✅ PDF text extraction completed');
    console.log('📊 Extracted text length:', extractedText.length);
    console.log('📄 Text preview:', extractedText.substring(0, 300) + '...');
    
    return extractedText;
  } catch (error) {
    console.error('❌ PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF. Please ensure the file is a valid PDF with readable text.');
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

  console.log('🤖 Preparing text for OpenAI analysis...');
  
  // Clean and prepare the text for analysis
  const cleanedText = resumeText
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\.,;:!?\-@()]/g, '')
    .trim();
  
  // Limit to reasonable length for API
  const words = cleanedText.split(/\s+/);
  const trimmedText = words.slice(0, 1500).join(' ');
  
  console.log('📊 Sending', words.length, 'words to OpenAI (trimmed to', trimmedText.split(/\s+/).length, 'words)');

  const prompt = `Analyze this resume and provide a structured summary. The resume text may contain some formatting artifacts, so focus on extracting meaningful information.

Please provide:

1. PROFILE SUMMARY (2-3 sentences about the person's background and expertise)
2. KEY SKILLS (list 5-8 technical/professional skills)
3. EXPERIENCE LEVEL (Junior/Mid/Senior based on years of experience mentioned)
4. CAREER FOCUS (primary field or role type they're targeting)

Resume text:
${trimmedText}

Please format your response clearly with these exact section headers so I can parse it properly.`;

  try {
    console.log('📡 Making request to OpenAI...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional resume analyst. Provide clear, structured analysis focusing on extracting meaningful information even from poorly formatted text. Always provide all requested sections.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;
    
    console.log('✅ OpenAI analysis completed');
    console.log('📝 Analysis preview:', analysis.substring(0, 200) + '...');
    
    return analysis;
  } catch (error) {
    console.error('❌ OpenAI analysis error:', error);
    throw new Error(`Failed to analyze resume with AI: ${error.message}`);
  }
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

    console.log('📝 Final extracted text length:', extractedText.length);

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
