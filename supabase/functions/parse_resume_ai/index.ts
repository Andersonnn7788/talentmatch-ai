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
  extractionMethod: string;
  diagnostics: {
    pdfSize: number;
    pdfVersion: string;
    hasText: boolean;
    hasImages: boolean;
    isEncrypted: boolean;
    extractionAttempts: string[];
  };
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
      
      const isRateLimit = error instanceof Error && 
        (error.message.includes('rate_limit') || error.message.includes('429'));
      
      if (isRateLimit || attempt < maxRetries) {
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

// Comprehensive PDF validation and diagnostics
async function validateAndAnalyzePDF(arrayBuffer: ArrayBuffer): Promise<{
  isValid: boolean;
  diagnostics: any;
  error?: string;
}> {
  try {
    const uint8Array = new Uint8Array(arrayBuffer);
    console.log('🔍 Starting PDF validation and analysis...');
    
    // Check if file is actually a PDF
    const pdfHeader = new TextDecoder().decode(uint8Array.slice(0, 8));
    if (!pdfHeader.startsWith('%PDF-')) {
      return {
        isValid: false,
        diagnostics: { fileType: 'Not a PDF file' },
        error: 'File is not a valid PDF. Please upload a PDF file.'
      };
    }
    
    // Extract PDF version
    const versionMatch = pdfHeader.match(/%PDF-(\d\.\d)/);
    const pdfVersion = versionMatch ? versionMatch[1] : 'Unknown';
    
    // Check for encryption
    const pdfString = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);
    const isEncrypted = pdfString.includes('/Encrypt') || pdfString.includes('/Filter/Standard');
    
    // Check for text content indicators
    const hasTextObjects = pdfString.includes('/Type/Font') || pdfString.includes('BT') || pdfString.includes('Tj');
    const hasImages = pdfString.includes('/Type/XObject') || pdfString.includes('/Subtype/Image');
    
    // Check for common PDF structures
    const hasValidStructure = pdfString.includes('xref') && pdfString.includes('trailer');
    
    const diagnostics = {
      fileSize: uint8Array.length,
      pdfVersion,
      isEncrypted,
      hasTextObjects,
      hasImages,
      hasValidStructure,
      contentPreview: pdfString.substring(0, 500)
    };
    
    console.log('📊 PDF Analysis Results:', diagnostics);
    
    if (isEncrypted) {
      return {
        isValid: false,
        diagnostics,
        error: 'PDF is password-protected or encrypted. Please upload an unprotected PDF.'
      };
    }
    
    if (!hasValidStructure) {
      return {
        isValid: false,
        diagnostics,
        error: 'PDF file appears to be corrupted or malformed.'
      };
    }
    
    return {
      isValid: true,
      diagnostics
    };
    
  } catch (error) {
    console.error('❌ PDF validation error:', error);
    return {
      isValid: false,
      diagnostics: { error: error.message },
      error: 'Failed to validate PDF file structure.'
    };
  }
}

// Enhanced PDF text extraction with multiple methods
async function extractPDFTextWithFallbacks(arrayBuffer: ArrayBuffer): Promise<{
  text: string;
  method: string;
  diagnostics: any;
}> {
  const uint8Array = new Uint8Array(arrayBuffer);
  const pdfString = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);
  
  const extractionAttempts: string[] = [];
  let extractedText = '';
  let successfulMethod = '';
  
  console.log('🔍 Starting multi-method PDF text extraction...');
  
  // Method 1: Enhanced Text Object Extraction
  try {
    console.log('📝 Method 1: Enhanced text object extraction...');
    extractionAttempts.push('Enhanced Text Objects');
    
    const textChunks: string[] = [];
    
    // Look for text objects with comprehensive patterns
    const textObjectPatterns = [
      /BT\s*([\s\S]*?)\s*ET/g,
      /\((.*?)\)\s*Tj/g,
      /\((.*?)\)\s*TJ/g,
      /\[(.*?)\]\s*TJ/g,
      /<([0-9a-fA-F\s]+)>\s*Tj/g
    ];
    
    for (const pattern of textObjectPatterns) {
      const matches = [...pdfString.matchAll(pattern)];
      for (const match of matches) {
        let text = match[1] || match[0];
        
        // Handle hex-encoded text
        if (pattern.source.includes('<')) {
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
        }
        
        // Clean and validate text
        text = text
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\n')
          .replace(/\\t/g, '\t')
          .replace(/\\(.)/g, '$1')
          .trim();
        
        if (text.length > 2 && /[a-zA-Z]/.test(text)) {
          textChunks.push(text);
        }
      }
    }
    
    if (textChunks.length > 0) {
      extractedText = textChunks.join(' ').replace(/\s+/g, ' ').trim();
      successfulMethod = 'Enhanced Text Objects';
      console.log(`✅ Method 1 success: ${extractedText.length} characters`);
    }
  } catch (error) {
    console.warn('⚠️ Method 1 failed:', error.message);
  }
  
  // Method 2: Stream Content Extraction
  if (!extractedText || extractedText.length < 100) {
    try {
      console.log('📝 Method 2: Stream content extraction...');
      extractionAttempts.push('Stream Content');
      
      const streamPattern = /stream\s*([\s\S]*?)\s*endstream/g;
      const streams = [...pdfString.matchAll(streamPattern)];
      const textChunks: string[] = [];
      
      for (const stream of streams) {
        const streamContent = stream[1];
        
        // Look for readable text in streams
        const readableText = streamContent.match(/\b[A-Za-z][A-Za-z0-9\s\.,;:!?\-@()#%&+=/]{3,}\b/g) || [];
        
        for (const match of readableText) {
          const cleaned = match.replace(/[^\w\s\.,;:!?\-@()#%&+=/]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          
          if (cleaned.length > 3 && /[a-zA-Z]/.test(cleaned)) {
            textChunks.push(cleaned);
          }
        }
      }
      
      if (textChunks.length > 0) {
        const streamText = [...new Set(textChunks)].join(' ').replace(/\s+/g, ' ').trim();
        if (streamText.length > extractedText.length) {
          extractedText = streamText;
          successfulMethod = 'Stream Content';
          console.log(`✅ Method 2 success: ${extractedText.length} characters`);
        }
      }
    } catch (error) {
      console.warn('⚠️ Method 2 failed:', error.message);
    }
  }
  
  // Method 3: Pattern-Based Resume Content Extraction
  if (!extractedText || extractedText.length < 100) {
    try {
      console.log('📝 Method 3: Pattern-based resume extraction...');
      extractionAttempts.push('Pattern-Based Resume Content');
      
      const resumePatterns = [
        // Contact information
        /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
        /(\+?\d{1,4}[\s\-]?\(?\d{1,4}\)?[\s\-]?\d{1,4}[\s\-]?\d{1,9})/g,
        
        // Names and professional titles
        /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/g,
        
        // Resume sections
        /(EXPERIENCE|EDUCATION|SKILLS|SUMMARY|OBJECTIVE|CONTACT|PROJECTS|CERTIFICATIONS|WORK\s+HISTORY|EMPLOYMENT|QUALIFICATIONS|PROFILE)/gi,
        
        // Professional terms
        /(Software\s+Engineer|Developer|Data\s+Scientist|Product\s+Manager|Business\s+Analyst|Project\s+Manager|Marketing|Sales|Designer|Consultant|Administrator|Specialist|Director|Manager|Lead|Senior|Junior|Principal)/gi,
        
        // Skills and technologies
        /(JavaScript|Python|Java|React|Node\.js|SQL|HTML|CSS|AWS|Docker|Git|Angular|Vue|TypeScript|MongoDB|PostgreSQL|Excel|PowerPoint|Photoshop|Figma)/gi,
        
        // Education keywords
        /(Bachelor|Master|PhD|Degree|University|College|School|Certificate|Certification)/gi,
        
        // Experience terms
        /(years?\s+of\s+experience|responsible\s+for|managed|developed|implemented|designed|created|led|coordinated|achieved|improved)/gi
      ];
      
      const patternChunks: string[] = [];
      for (const pattern of resumePatterns) {
        const matches = [...pdfString.matchAll(pattern)];
        for (const match of matches) {
          const text = match[0];
          if (text && text.length > 2 && /[a-zA-Z]/.test(text)) {
            patternChunks.push(text.trim());
          }
        }
      }
      
      if (patternChunks.length > 0) {
        const patternText = [...new Set(patternChunks)].join(' ').replace(/\s+/g, ' ').trim();
        if (patternText.length > extractedText.length) {
          extractedText = patternText;
          successfulMethod = 'Pattern-Based Resume Content';
          console.log(`✅ Method 3 success: ${extractedText.length} characters`);
        }
      }
    } catch (error) {
      console.warn('⚠️ Method 3 failed:', error.message);
    }
  }
  
  // Method 4: Raw Text Extraction with Improved Filtering
  if (!extractedText || extractedText.length < 100) {
    try {
      console.log('📝 Method 4: Raw text extraction with filtering...');
      extractionAttempts.push('Raw Text with Filtering');
      
      // Extract all readable ASCII text
      const rawText = pdfString.replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Filter out PDF artifacts and keep meaningful content
      const words = rawText.split(/\s+/);
      const meaningfulWords = words.filter(word => {
        return word.length > 1 && 
               word.length < 50 && 
               /[a-zA-Z]/.test(word) &&
               !word.match(/^(obj|endobj|stream|endstream|xref|trailer|Type|Font|Length|Filter|Width|Height|DeviceRGB|BT|ET|Tf|Td|Tj|TJ)$/i);
      });
      
      if (meaningfulWords.length > 20) {
        const filteredText = meaningfulWords.join(' ').substring(0, 5000);
        if (filteredText.length > extractedText.length) {
          extractedText = filteredText;
          successfulMethod = 'Raw Text with Filtering';
          console.log(`✅ Method 4 success: ${extractedText.length} characters`);
        }
      }
    } catch (error) {
      console.warn('⚠️ Method 4 failed:', error.message);
    }
  }
  
  // Final validation and cleaning
  if (extractedText) {
    // Clean up the extracted text
    extractedText = extractedText
      .replace(/(.)\1{4,}/g, '$1$1') // Remove excessive repeated characters
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ') // Remove non-printable characters
      .replace(/\s+/g, ' ')
      .trim();
    
    // Validate text quality
    const wordCount = extractedText.split(/\s+/).length;
    const letterCount = (extractedText.match(/[a-zA-Z]/g) || []).length;
    const letterRatio = letterCount / extractedText.length;
    
    console.log('📊 Text quality metrics:', { wordCount, letterRatio: letterRatio.toFixed(2) });
    
    if (wordCount < 10 || letterRatio < 0.3) {
      throw new Error('Extracted text quality is too low for meaningful analysis');
    }
  }
  
  const diagnostics = {
    extractionAttempts,
    successfulMethod,
    textLength: extractedText.length,
    wordCount: extractedText ? extractedText.split(/\s+/).length : 0
  };
  
  if (!extractedText || extractedText.length < 50) {
    throw new Error('Could not extract sufficient readable text from PDF using any method');
  }
  
  console.log('✅ PDF text extraction completed successfully');
  console.log('📊 Final result:', diagnostics);
  
  return {
    text: extractedText,
    method: successfulMethod,
    diagnostics
  };
}

// Clean and validate text for OpenAI
function cleanAndValidateText(text: string): string {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid text input');
  }
  
  let cleanedText = text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/(.)\1{4,}/g, '$1$1$1')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/[^\x20-\x7E\n\r\t]/g, '')
    .trim();
  
  if (cleanedText.length < 50) {
    throw new Error('Text too short for meaningful analysis');
  }
  
  const wordCount = cleanedText.split(/\s+/).length;
  const letterCount = (cleanedText.match(/[a-zA-Z]/g) || []).length;
  const letterRatio = letterCount / cleanedText.length;
  
  if (wordCount < 10 || letterRatio < 0.4) {
    throw new Error('Text does not contain sufficient readable content');
  }
  
  console.log('✅ Text validation passed - Words:', wordCount, 'Letter ratio:', letterRatio.toFixed(2));
  return cleanedText;
}

// Chunk text for large content
function chunkText(text: string, maxChunkSize: number = 15000): string[] {
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

async function analyzeResumeWithGPT4oMini(resumeText: string, fileName: string, diagnostics: any): Promise<ResumeAnalysisResult> {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  console.log('🤖 Starting GPT-4o-mini analysis for resume:', fileName);
  console.log('📊 Resume text length:', resumeText.length);
  
  const cleanedText = cleanAndValidateText(resumeText);
  console.log('📊 Cleaned text length:', cleanedText.length);
  
  const textChunks = chunkText(cleanedText, 15000);
  console.log('📊 Text chunks:', textChunks.length);
  
  const textForAnalysis = textChunks.length === 1 ? textChunks[0] : 
    textChunks.slice(0, 2).join(' ').substring(0, 15000);
  
  console.log('📊 Text for analysis length:', textForAnalysis.length);

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
- If the resume content is unclear or fragmented, still provide a professional analysis based on what's available

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
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 second timeout
    
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
          max_tokens: 4000,
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
      
      let parsedAnalysis;
      try {
        parsedAnalysis = JSON.parse(analysisText);
      } catch (parseError) {
        console.error('❌ JSON parsing error:', parseError);
        console.error('📄 Raw response:', analysisText);
        throw new Error('Failed to parse AI analysis response as valid JSON');
      }
      
      // Validate and clean up the analysis
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
        console.warn('⚠️ No skills found, adding defaults based on content');
        parsedAnalysis.highlightedSkills = ['Communication', 'Problem Solving', 'Teamwork', 'Adaptability'];
      }
      
      // Ensure we have job suggestions
      if (!Array.isArray(parsedAnalysis.suggestedJobs)) {
        parsedAnalysis.suggestedJobs = [];
      }
      
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
        extractedText: textForAnalysis,
        extractionMethod: diagnostics.successfulMethod || 'Unknown',
        diagnostics: {
          pdfSize: diagnostics.fileSize || 0,
          pdfVersion: diagnostics.pdfVersion || 'Unknown',
          hasText: diagnostics.hasTextObjects || false,
          hasImages: diagnostics.hasImages || false,
          isEncrypted: diagnostics.isEncrypted || false,
          extractionAttempts: diagnostics.extractionAttempts || []
        }
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

  return await retryWithBackoff(makeOpenAIRequest, 3, 2000);
}

serve(async (req) => {
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

    // Validate PDF
    const validation = await validateAndAnalyzePDF(arrayBuffer);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: validation.error,
          diagnostics: validation.diagnostics
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Extract text with multiple methods
    const fileName = cleanFilePath.toLowerCase();
    if (!fileName.endsWith('.pdf')) {
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

    console.log('📄 Processing PDF file with enhanced extraction...');
    const extractionResult = await extractPDFTextWithFallbacks(arrayBuffer);
    const extractedText = extractionResult.text;

    console.log('📝 Final extracted text length:', extractedText.length);
    console.log('📄 Extraction method used:', extractionResult.method);

    if (!extractedText || extractedText.length < 100) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Could not extract sufficient readable text from the PDF. The file may be image-based, heavily formatted, or corrupted.',
          diagnostics: { ...validation.diagnostics, ...extractionResult.diagnostics }
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Analyze with GPT-4o-mini
    console.log('🤖 Sending extracted text to GPT-4o-mini for comprehensive analysis...');
    const combinedDiagnostics = { ...validation.diagnostics, ...extractionResult.diagnostics };
    const analysisResult = await analyzeResumeWithGPT4oMini(extractedText, file_name, combinedDiagnostics);
    console.log('✅ GPT-4o-mini analysis completed successfully');

    // Save to database
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
        extracted_text_length: extractedText.length,
        extraction_method: extractionResult.method,
        diagnostics: combinedDiagnostics
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Resume analysis error:', error);
    
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
