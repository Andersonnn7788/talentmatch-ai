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

interface JobSuggestion {
  title: string;
  reason: string;
  keySkills: string[];
}

interface ResumeAnalysisResult {
  profileSummary: string;
  highlightedSkills: string[];
  experienceLevel: string;
  careerFocus: string;
  suggestedJobs: JobSuggestion[];
  extractedText: string;
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Enhanced PDF text extraction function
async function extractPDFText(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    console.log('🔍 Starting enhanced PDF text extraction...');
    
    const uint8Array = new Uint8Array(arrayBuffer);
    const pdfString = new TextDecoder('latin1').decode(uint8Array);
    
    console.log('📄 PDF size:', uint8Array.length, 'bytes');
    
    let extractedText = '';
    
    // Method 1: Extract text from BT/ET text objects
    const textObjectRegex = /BT\s*([\s\S]*?)\s*ET/g;
    const textObjects = [...pdfString.matchAll(textObjectRegex)];
    
    if (textObjects.length > 0) {
      console.log('📝 Found', textObjects.length, 'text objects');
      
      for (const textObj of textObjects) {
        const content = textObj[1];
        
        // Extract text from Tj operators: (text) Tj
        const tjMatches = [...content.matchAll(/\(([^)]*)\)\s*Tj/g)];
        for (const match of tjMatches) {
          const text = match[1].replace(/\\[nrt]/g, ' ').trim();
          if (text.length > 1 && /[a-zA-Z]/.test(text)) {
            extractedText += text + ' ';
          }
        }
        
        // Extract text from TJ operators: [(text)] TJ
        const tjArrayMatches = [...content.matchAll(/\[(.*?)\]\s*TJ/g)];
        for (const match of tjArrayMatches) {
          const arrayContent = match[1];
          const textParts = [...arrayContent.matchAll(/\(([^)]*)\)/g)];
          for (const part of textParts) {
            const text = part[1].replace(/\\[nrt]/g, ' ').trim();
            if (text.length > 1 && /[a-zA-Z]/.test(text)) {
              extractedText += text + ' ';
            }
          }
        }
      }
    }
    
    // Method 2: Look for parentheses-enclosed text throughout the PDF
    if (extractedText.length < 100) {
      console.log('🔄 Using alternative extraction method...');
      
      const textMatches = [...pdfString.matchAll(/\(([^)]{3,})\)/g)];
      console.log('📝 Found', textMatches.length, 'text patterns');
      
      for (const match of textMatches) {
        let text = match[1]
          .replace(/\\[nrt]/g, ' ')
          .replace(/\\(.)/g, '$1')
          .trim();
        
        // Filter out non-text content
        if (text.length > 2 && 
            text.length < 500 && 
            /[a-zA-Z]/.test(text) && 
            !/^[\d\s\.\-\(\)]+$/.test(text) &&
            !text.includes('obj') &&
            !text.includes('endobj')) {
          extractedText += text + ' ';
        }
      }
    }
    
    // Method 3: Extract readable ASCII text from the entire PDF
    if (extractedText.length < 100) {
      console.log('🔄 Using ASCII extraction method...');
      
      // Look for sequences of readable characters
      const readableText = pdfString.match(/[A-Za-z][A-Za-z\s,.-:;]{10,}/g);
      if (readableText) {
        extractedText = readableText
          .filter(text => 
            text.length > 10 && 
            text.length < 200 &&
            !text.includes('obj') &&
            !text.includes('stream')
          )
          .join(' ');
      }
    }
    
    // Clean up the extracted text
    extractedText = extractedText
      .replace(/\s+/g, ' ')
      .replace(/[^\x20-\x7E\n]/g, '')
      .replace(/(.)\1{3,}/g, '$1')
      .trim();
    
    console.log('✅ PDF text extraction completed');
    console.log('📊 Extracted text length:', extractedText.length);
    
    if (extractedText.length > 50) {
      console.log('📄 Text preview:', extractedText.substring(0, 300) + '...');
    } else {
      console.log('⚠️ Very little text extracted');
    }
    
    return extractedText;
  } catch (error) {
    console.error('❌ PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF. Please ensure the file is a valid PDF with readable text.');
  }
}

async function analyzeResumeWithGPT4oMini(resumeText: string, fileName: string): Promise<ResumeAnalysisResult> {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  console.log('🤖 Starting GPT-4o-mini analysis for resume:', fileName);
  
  // Validate that we have meaningful text
  if (resumeText.length < 50) {
    throw new Error('Insufficient text extracted from resume for analysis');
  }
  
  // Clean and prepare the text
  const cleanedText = resumeText
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\.,;:!?\-@()#%&]/g, '')
    .trim();
  
  // Limit to API constraints but keep meaningful content
  const words = cleanedText.split(/\s+/);
  const trimmedText = words.slice(0, 3000).join(' ');
  
  console.log('📊 Sending', words.length, 'words to GPT-4o-mini (trimmed to', trimmedText.split(/\s+/).length, 'words)');

  const prompt = `You are an expert AI Career Advisor for the "TalentMatch.AI" platform. 

Analyze this resume text and provide a comprehensive analysis. The resume content is:

"${trimmedText}"

Return your analysis ONLY in valid JSON format with this exact structure:

{
  "profileSummary": "2-3 sentence professional summary based on the resume content",
  "highlightedSkills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"],
  "experienceLevel": "Junior|Mid|Senior",
  "careerFocus": "primary career focus/industry based on resume",
  "suggestedJobs": [
    {
      "title": "Job Title",
      "reason": "Why this job matches the candidate",
      "keySkills": ["required skill 1", "required skill 2", "required skill 3"]
    }
  ]
}

IMPORTANT RULES:
1. Base ALL analysis on the actual resume content provided
2. Extract 6-8 specific skills mentioned in the resume for highlightedSkills
3. Suggest 3-4 relevant job positions in suggestedJobs array
4. Determine experience level based on years mentioned or job titles/responsibilities
5. Return ONLY valid JSON - no additional text or explanations
6. Ensure all strings are properly escaped for JSON format`;

  try {
    console.log('📡 Making request to OpenAI GPT-4o-mini...');
    
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
            content: 'You are an expert resume analyst and career advisor. Analyze resumes accurately and provide structured JSON responses based only on the content provided. Be specific and professional.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    
    console.log('✅ GPT-4o-mini analysis completed');
    console.log('📝 Raw analysis:', analysisText);
    
    // Parse the JSON response
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('❌ JSON parsing error:', parseError);
      console.log('📄 Raw response that failed to parse:', analysisText);
      throw new Error('Failed to parse AI analysis response as JSON');
    }
    
    // Validate the structure and provide defaults if needed
    const result: ResumeAnalysisResult = {
      profileSummary: parsedAnalysis.profileSummary || 'Professional with diverse experience and skills.',
      highlightedSkills: Array.isArray(parsedAnalysis.highlightedSkills) ? parsedAnalysis.highlightedSkills : ['Communication', 'Problem Solving', 'Technical Skills'],
      experienceLevel: ['Junior', 'Mid', 'Senior'].includes(parsedAnalysis.experienceLevel) ? parsedAnalysis.experienceLevel : 'Mid',
      careerFocus: parsedAnalysis.careerFocus || 'Technology and professional services',
      suggestedJobs: Array.isArray(parsedAnalysis.suggestedJobs) ? parsedAnalysis.suggestedJobs : [
        {
          title: 'Professional Role',
          reason: 'Based on skills and experience shown in resume',
          keySkills: ['Communication', 'Analysis', 'Problem Solving']
        }
      ],
      extractedText: trimmedText
    };
    
    console.log('✅ Structured analysis completed:', JSON.stringify(result, null, 2));
    return result;
    
  } catch (error) {
    console.error('❌ GPT-4o-mini analysis error:', error);
    throw new Error(`Failed to analyze resume with GPT-4o-mini: ${error.message}`);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody: RequestBody = await req.json();
    console.log('📥 Processing resume analysis request:', JSON.stringify(requestBody, null, 2));

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

    // Clean the file path
    let cleanFilePath = file_name;
    if (cleanFilePath.includes('resumes/resumes/')) {
      cleanFilePath = cleanFilePath.replace('resumes/resumes/', 'resumes/');
    }
    if (!cleanFilePath.startsWith('resumes/')) {
      cleanFilePath = `resumes/${cleanFilePath}`;
    }

    console.log(`📁 Using file path: ${cleanFilePath}`);

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

    // Extract text from PDF
    let extractedText = '';
    const fileName = cleanFilePath.toLowerCase();

    if (fileName.endsWith('.pdf')) {
      console.log('📄 Processing PDF file...');
      extractedText = await extractPDFText(arrayBuffer);
    } else {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Currently only PDF files are supported for resume analysis.' 
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
          error: 'Could not extract sufficient text from the PDF. Please ensure the file contains readable text and is not image-based.' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Analyze with GPT-4o-mini using the actual extracted text
    console.log('🤖 Sending extracted text to GPT-4o-mini for comprehensive analysis...');
    const analysisResult = await analyzeResumeWithGPT4oMini(extractedText, file_name);
    console.log('✅ GPT-4o-mini analysis completed successfully');

    // Save to database with structured analysis
    const analysisForStorage = JSON.stringify(analysisResult, null, 2);
    
    const { data: insertData, error: insertError } = await supabase
      .from('resume_analysis')
      .insert({
        user_id,
        file_name: cleanFilePath,
        analysis: analysisForStorage,
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
        analysis: analysisResult,
        extracted_text_length: extractedText.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Resume analysis error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Failed to analyze resume'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
