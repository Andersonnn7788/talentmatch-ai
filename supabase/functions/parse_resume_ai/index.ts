
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

// Utility function for exponential backoff with jitter
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Check if it's a rate limit error
      const isRateLimit = error instanceof Error && 
        (error.message.includes('rate_limit') || error.message.includes('429'));
      
      if (isRateLimit || attempt < maxRetries) {
        // Exponential backoff with jitter
        const delayMs = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        console.log(`⏳ Attempt ${attempt + 1} failed, retrying in ${delayMs}ms...`);
        await delay(delayMs);
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
}

// Comprehensive PDF text extraction with multiple fallback methods
async function extractPDFText(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    console.log('🔍 Starting comprehensive PDF text extraction...');
    
    const uint8Array = new Uint8Array(arrayBuffer);
    console.log('📄 PDF size:', uint8Array.length, 'bytes');
    
    // Convert to string for pattern matching
    const pdfString = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);
    
    let extractedText = '';
    const textChunks: string[] = [];
    
    // Method 1: Look for text objects with comprehensive pattern matching
    console.log('🔍 Method 1: Extracting from text objects...');
    const textObjectPattern = /BT\s*([\s\S]*?)\s*ET/g;
    const textObjects = [...pdfString.matchAll(textObjectPattern)];
    
    console.log('📝 Found', textObjects.length, 'text objects');
    
    for (const textObj of textObjects) {
      const content = textObj[1];
      
      // Extract text from various PDF text operators with better decoding
      const textPatterns = [
        /\(([^)]*)\)\s*Tj/g,
        /\(([^)]*)\)\s*TJ/g,
        /\[(.*?)\]\s*TJ/g,
        /<([0-9a-fA-F\s]+)>\s*Tj/g,
        /\(([^)]*)\)\s*'/g,
        /\(([^)]*)\)\s*"/g
      ];
      
      for (const pattern of textPatterns) {
        const matches = [...content.matchAll(pattern)];
        for (const match of matches) {
          let text = match[1];
          
          if (pattern.source.includes('<')) {
            // Handle hex-encoded text
            text = text.replace(/\s/g, '');
            let decoded = '';
            for (let i = 0; i < text.length; i += 2) {
              const hex = text.substr(i, 2);
              if (hex.length === 2) {
                const charCode = parseInt(hex, 16);
                if (charCode >= 32 && charCode <= 126) {
                  decoded += String.fromCharCode(charCode);
                }
              }
            }
            text = decoded;
          } else {
            // Clean escape sequences and decode common PDF text encoding
            text = text
              .replace(/\\n/g, '\n')
              .replace(/\\r/g, '\n')
              .replace(/\\t/g, '\t')
              .replace(/\\(.)/g, '$1')
              .replace(/\\\//g, '/')
              .replace(/\\b/g, '')
              .replace(/\\f/g, '')
              .trim();
          }
          
          if (text.length > 1 && /[a-zA-Z0-9]/.test(text)) {
            textChunks.push(text);
          }
        }
      }
    }
    
    // Method 2: Enhanced direct pattern extraction for resume content
    console.log('🔍 Method 2: Enhanced pattern extraction...');
    const resumePatterns = [
      // Contact information
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
      /(\+?\d{1,4}[\s\-]?\(?\d{1,4}\)?[\s\-]?\d{1,4}[\s\-]?\d{1,9})/g,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/g,
      
      // Resume sections and content
      /(EXPERIENCE|EDUCATION|SKILLS|SUMMARY|OBJECTIVE|CONTACT|PROJECTS|CERTIFICATIONS|LANGUAGES|WORK\s+HISTORY|EMPLOYMENT|QUALIFICATIONS)/gi,
      
      // Job titles and roles
      /(Software\s+Engineer|Developer|Data\s+Scientist|Product\s+Manager|Business\s+Analyst|Project\s+Manager|Marketing\s+Manager|Sales\s+Representative|Designer|Consultant|Administrator|Technician|Coordinator|Specialist|Director|Senior|Junior|Lead|Principal)/gi,
      
      // Companies and organizations
      /(Inc\.|LLC|Corp\.|Corporation|Company|Ltd\.|Limited|University|College|Institute)/gi,
      
      // Skills and technologies
      /(JavaScript|Python|Java|React|Node\.js|SQL|HTML|CSS|AWS|Docker|Kubernetes|Git|Angular|Vue|TypeScript|MongoDB|PostgreSQL|Machine\s+Learning|Data\s+Analysis|Project\s+Management|Microsoft\s+Office|Excel|PowerPoint|Photoshop|Figma)/gi,
      
      // Education keywords
      /(Bachelor|Master|PhD|Degree|Diploma|Certificate|Certification|GPA|Grade|University|College|School)/gi,
      
      // Dates and years
      /(\b(?:19|20)\d{2}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b)/gi,
      
      // Common resume phrases
      /(years?\s+of\s+experience|responsible\s+for|managed|developed|implemented|designed|created|led|coordinated|collaborated|achieved|improved|increased|decreased|reduced)/gi
    ];
    
    for (const pattern of resumePatterns) {
      const matches = [...pdfString.matchAll(pattern)];
      for (const match of matches) {
        const text = match[0];
        if (text && text.length > 2 && /[a-zA-Z]/.test(text)) {
          textChunks.push(text.trim());
        }
      }
    }
    
    // Method 3: Stream content with better text reconstruction
    console.log('🔍 Method 3: Stream content extraction...');
    const streamPattern = /stream\s*([\s\S]*?)\s*endstream/g;
    const streams = [...pdfString.matchAll(streamPattern)];
    
    for (const stream of streams) {
      const streamContent = stream[1];
      
      // Look for readable text sequences with better filtering
      const readableTextPattern = /\b[A-Za-z][A-Za-z0-9\s\.,;:!?\-@()#%&+=/]{3,}\b/g;
      const readableMatches = streamContent.match(readableTextPattern) || [];
      
      for (const match of readableMatches) {
        const cleaned = match
          .replace(/[^\w\s\.,;:!?\-@()#%&+=/]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (cleaned.length > 3 && /[a-zA-Z]/.test(cleaned) && !cleaned.match(/^[0-9\s]+$/)) {
          textChunks.push(cleaned);
        }
      }
    }
    
    // Method 4: Fallback with improved ASCII extraction
    if (textChunks.length < 10) {
      console.log('🔄 Method 4: Enhanced fallback extraction...');
      
      // Try to find text between common PDF delimiters
      const delimiterPatterns = [
        /\((.*?)\)/g,
        /\[(.*?)\]/g,
        /\<(.*?)\>/g
      ];
      
      for (const pattern of delimiterPatterns) {
        const matches = [...pdfString.matchAll(pattern)];
        for (const match of matches) {
          const text = match[1];
          if (text && text.length > 2 && /[a-zA-Z]/.test(text) && text.length < 200) {
            const cleaned = text
              .replace(/[^\w\s\.,;:!?\-@()#%&+=/]/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
            
            if (cleaned.length > 3) {
              textChunks.push(cleaned);
            }
          }
        }
      }
    }
    
    // Clean and combine extracted text with better deduplication
    const uniqueChunks = [...new Set(textChunks)]
      .filter(chunk => {
        // Filter out obvious PDF artifacts and ensure meaningful content
        return chunk && 
               chunk.length > 2 && 
               chunk.length < 500 &&
               /[a-zA-Z]/.test(chunk) &&
               !chunk.match(/^(obj|endobj|stream|endstream|xref|trailer|Type|Font|Length|Filter|Width|Height|FlateDecode|DeviceRGB|BT|ET|Tf|Td|Tj|TJ)$/i) &&
               !chunk.match(/^[0-9\s\.]+$/) &&
               !chunk.match(/^[^\w\s]+$/);
      });
    
    extractedText = uniqueChunks
      .join(' ')
      .replace(/\s+/g, ' ')
      .replace(/(.)\1{4,}/g, '$1$1') // Remove excessive repeated characters
      .trim();
    
    console.log('✅ PDF text extraction completed');
    console.log('📊 Extracted text length:', extractedText.length);
    console.log('📄 Unique text chunks found:', uniqueChunks.length);
    
    if (extractedText.length > 100) {
      console.log('📄 Text preview:', extractedText.substring(0, 500) + '...');
      
      // Additional validation for meaningful content
      const wordCount = extractedText.split(/\s+/).length;
      const letterCount = (extractedText.match(/[a-zA-Z]/g) || []).length;
      const letterRatio = letterCount / extractedText.length;
      
      console.log('📊 Text quality metrics - Words:', wordCount, 'Letter ratio:', letterRatio.toFixed(2));
      
      if (wordCount > 10 && letterRatio > 0.3) {
        return extractedText;
      } else {
        throw new Error('Extracted text appears to be corrupted or contains insufficient meaningful content');
      }
    } else {
      throw new Error('Could not extract sufficient readable text from PDF. The file may be image-based, heavily formatted, corrupted, or encrypted.');
    }
    
  } catch (error) {
    console.error('❌ PDF extraction error:', error);
    throw new Error('Failed to extract readable text from PDF: ' + error.message);
  }
}

// Clean and validate text before sending to OpenAI
function cleanAndValidateText(text: string): string {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid text input');
  }
  
  // Remove or replace problematic characters
  let cleanedText = text
    // Remove control characters except newlines, tabs, and carriage returns
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ')
    // Replace multiple whitespace with single space
    .replace(/\s+/g, ' ')
    // Remove excessively repeated characters (more than 4 in a row)
    .replace(/(.)\1{4,}/g, '$1$1$1')
    // Normalize quotes and dashes
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[–—]/g, '-')
    // Remove any remaining non-printable characters
    .replace(/[^\x20-\x7E\n\r\t]/g, '')
    .trim();
  
  // Validate minimum length
  if (cleanedText.length < 50) {
    throw new Error('Text too short for meaningful analysis');
  }
  
  // Validate it contains readable content
  const wordCount = cleanedText.split(/\s+/).length;
  const letterCount = (cleanedText.match(/[a-zA-Z]/g) || []).length;
  const letterRatio = letterCount / cleanedText.length;
  
  if (wordCount < 10 || letterRatio < 0.4) {
    throw new Error('Text does not contain sufficient readable content');
  }
  
  console.log('✅ Text validation passed - Words:', wordCount, 'Letter ratio:', letterRatio.toFixed(2));
  return cleanedText;
}

// Chunk text if it's too large for the API
function chunkText(text: string, maxChunkSize: number = 12000): string[] {
  if (text.length <= maxChunkSize) {
    return [text];
  }
  
  const chunks: string[] = [];
  const sentences = text.split(/[.!?]+\s+/);
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? '. ' : '') + sentence;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

async function analyzeResumeWithGPT4oMini(resumeText: string, fileName: string): Promise<ResumeAnalysisResult> {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  console.log('🤖 Starting GPT-4o-mini analysis for resume:', fileName);
  console.log('📊 Resume text length:', resumeText.length);
  
  // Clean and validate the text
  const cleanedText = cleanAndValidateText(resumeText);
  console.log('📊 Cleaned text length:', cleanedText.length);
  
  // Chunk text if necessary
  const textChunks = chunkText(cleanedText, 12000);
  console.log('📊 Text chunks:', textChunks.length);
  
  // Use the first chunk or combine if small enough
  const textForAnalysis = textChunks.length === 1 ? textChunks[0] : 
    textChunks.slice(0, 2).join(' ').substring(0, 12000);
  
  console.log('📊 Text for analysis length:', textForAnalysis.length);
  console.log('📄 Preview:', textForAnalysis.substring(0, 200) + '...');

  const prompt = `You are an expert AI Career Advisor and Resume Analyst. Analyze this resume content thoroughly and provide a comprehensive assessment.

RESUME CONTENT:
"${textForAnalysis}"

ANALYSIS REQUIREMENTS:
1. Provide a detailed 2-3 sentence professional summary based ONLY on the actual resume content
2. Extract 6-8 specific technical and soft skills that are actually mentioned or clearly demonstrated in the resume
3. Determine experience level (Junior/Mid/Senior) based on years of experience, job titles, and responsibilities shown
4. Identify the primary career focus/industry from the actual work history and skills
5. Suggest 3-4 highly relevant job positions that match the candidate's actual experience and skills

CRITICAL INSTRUCTIONS:
- Base ALL analysis ONLY on the actual resume content provided
- Extract real skills and technologies mentioned in the resume
- Make realistic job suggestions based on actual experience level
- Ensure experience level matches the career progression shown
- Provide specific reasons for job suggestions based on candidate's background

Return your analysis in this EXACT JSON format (no additional text):

{
  "profileSummary": "A detailed professional summary based on actual resume content and experience",
  "highlightedSkills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7", "skill8"],
  "experienceLevel": "Junior|Mid|Senior",
  "careerFocus": "Primary career focus based on actual resume content",
  "suggestedJobs": [
    {
      "title": "Job Title 1",
      "reason": "Specific reason based on candidate's actual experience and skills",
      "keySkills": ["skill1", "skill2", "skill3"]
    },
    {
      "title": "Job Title 2", 
      "reason": "Specific reason based on candidate's actual experience and skills",
      "keySkills": ["skill1", "skill2", "skill3"]
    },
    {
      "title": "Job Title 3",
      "reason": "Specific reason based on candidate's actual experience and skills", 
      "keySkills": ["skill1", "skill2", "skill3"]
    }
  ]
}`;

  const makeOpenAIRequest = async (): Promise<ResumeAnalysisResult> => {
    console.log('📡 Making request to OpenAI GPT-4o-mini...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    try {
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
              content: 'You are an expert resume analyst and career advisor. Analyze resumes accurately and provide structured JSON responses based only on the actual content provided. Always return valid JSON format without any additional text or formatting.' 
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 3000, // Increased for more detailed responses
          response_format: { type: "json_object" }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ OpenAI API error:', response.status, response.statusText, errorText);
        
        if (response.status === 429) {
          throw new Error('Rate limit exceeded - will retry');
        } else if (response.status === 401) {
          throw new Error('Invalid OpenAI API key');
        } else if (response.status === 400) {
          throw new Error('Invalid request to OpenAI API');
        } else {
          throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response structure from OpenAI API');
      }
      
      const analysisText = data.choices[0].message.content;
      
      console.log('✅ GPT-4o-mini response received');
      console.log('📝 Raw analysis response length:', analysisText.length);
      console.log('📄 Response preview:', analysisText.substring(0, 300) + '...');
      
      // Parse and validate the JSON response
      let parsedAnalysis;
      try {
        parsedAnalysis = JSON.parse(analysisText);
      } catch (parseError) {
        console.error('❌ JSON parsing error:', parseError);
        console.error('📄 Raw response:', analysisText);
        throw new Error('Failed to parse AI analysis response as valid JSON');
      }
      
      // Validate required fields
      if (!parsedAnalysis.profileSummary || 
          !Array.isArray(parsedAnalysis.highlightedSkills) ||
          !parsedAnalysis.experienceLevel ||
          !parsedAnalysis.careerFocus) {
        console.error('❌ Incomplete analysis:', parsedAnalysis);
        throw new Error('AI analysis returned incomplete data - missing required fields');
      }
      
      // Validate experience level
      if (!['Junior', 'Mid', 'Senior'].includes(parsedAnalysis.experienceLevel)) {
        console.warn('⚠️ Invalid experience level, defaulting to Mid');
        parsedAnalysis.experienceLevel = 'Mid';
      }
      
      // Ensure we have skills
      if (parsedAnalysis.highlightedSkills.length === 0) {
        console.warn('⚠️ No skills found, adding defaults');
        parsedAnalysis.highlightedSkills = ['Communication', 'Problem Solving', 'Teamwork', 'Adaptability'];
      }
      
      // Ensure we have job suggestions
      if (!Array.isArray(parsedAnalysis.suggestedJobs)) {
        parsedAnalysis.suggestedJobs = [];
      }
      
      // Structure the final response
      const result: ResumeAnalysisResult = {
        profileSummary: parsedAnalysis.profileSummary,
        highlightedSkills: parsedAnalysis.highlightedSkills.slice(0, 8),
        experienceLevel: parsedAnalysis.experienceLevel,
        careerFocus: parsedAnalysis.careerFocus,
        suggestedJobs: parsedAnalysis.suggestedJobs.slice(0, 4).map(job => ({
          title: job.title || 'Professional Role',
          reason: job.reason || 'Based on skills and experience demonstrated in resume',
          keySkills: Array.isArray(job.keySkills) ? job.keySkills.slice(0, 5) : ['Communication', 'Analysis', 'Problem Solving']
        })),
        extractedText: textForAnalysis
      };
      
      console.log('✅ Analysis validation completed successfully');
      console.log('📊 Final result - Skills:', result.highlightedSkills.length, 'Jobs:', result.suggestedJobs.length);
      
      return result;
      
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('OpenAI API request timed out');
      }
      throw error;
    }
  };

  // Use retry logic for the OpenAI request
  return await retryWithBackoff(makeOpenAIRequest, 3, 2000);
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

    // Download file from Supabase Storage with retry logic
    const downloadFile = async () => {
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('documents')
        .download(cleanFilePath);

      if (downloadError) {
        console.error('❌ File download error:', downloadError);
        throw new Error(`Failed to download file: ${downloadError.message}. File path: ${cleanFilePath}`);
      }

      return fileData;
    };

    const fileData = await retryWithBackoff(downloadFile, 2, 1000);
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
    console.log('📄 Extracted text quality check - readable characters:', /[a-zA-Z]/.test(extractedText));

    if (!extractedText || extractedText.length < 100) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Could not extract sufficient readable text from the PDF. Please ensure the file contains readable text and is not image-based, corrupted, or heavily formatted.' 
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
    
    const saveToDatabase = async () => {
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
        throw new Error(`Failed to save analysis: ${insertError.message}`);
      }

      return insertData;
    };

    const insertData = await retryWithBackoff(saveToDatabase, 2, 1000);
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
    
    // Determine appropriate status code based on error type
    let statusCode = 500;
    let errorMessage = 'Failed to analyze resume';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes('API key')) {
        statusCode = 401;
      } else if (error.message.includes('rate_limit') || error.message.includes('429')) {
        statusCode = 429;
      } else if (error.message.includes('timeout')) {
        statusCode = 408;
      } else if (error.message.includes('File not found') || error.message.includes('download')) {
        statusCode = 404;
      } else if (error.message.includes('Invalid') || error.message.includes('required')) {
        statusCode = 400;
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      }),
      {
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
