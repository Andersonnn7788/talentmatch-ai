
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

// Significantly improved PDF text extraction function
async function extractPDFText(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    console.log('🔍 Starting comprehensive PDF text extraction...');
    
    const uint8Array = new Uint8Array(arrayBuffer);
    console.log('📄 PDF size:', uint8Array.length, 'bytes');
    
    // Convert to string for pattern matching
    const pdfString = new TextDecoder('latin1').decode(uint8Array);
    
    let extractedText = '';
    const textChunks: string[] = [];
    
    // Method 1: Extract from stream objects with comprehensive text detection
    console.log('🔍 Method 1: Extracting from stream objects...');
    const streamRegex = /stream\s*([\s\S]*?)\s*endstream/g;
    const streams = [...pdfString.matchAll(streamRegex)];
    
    console.log('🔍 Found', streams.length, 'streams in PDF');
    
    for (const stream of streams) {
      const streamContent = stream[1];
      
      // Decode FlateDecode compressed streams if possible
      try {
        // Look for text patterns in streams with various text operators
        const textPatterns = [
          // Standard text showing operators
          /\(((?:[^\\()]|\\.)*?)\)\s*Tj/g,
          /\(((?:[^\\()]|\\.)*?)\)\s*TJ/g,
          // Array text showing
          /\[((?:[^\[\]]|\[[^\]]*\])*?)\]\s*TJ/g,
          // Text with positioning
          /\(([^)]{2,})\)\s*[0-9\s\.\-]*\s*T[jd]/g,
          // Multi-line text blocks
          /BT\s+([\s\S]*?)\s+ET/g,
          // Hex encoded text
          /<([0-9a-fA-F\s]+)>\s*T[jd]/g
        ];
        
        for (const pattern of textPatterns) {
          const matches = [...streamContent.matchAll(pattern)];
          for (const match of matches) {
            let text = match[1];
            if (text && text.length > 0) {
              
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
                    } else if (charCode === 10 || charCode === 13) {
                      decoded += ' ';
                    }
                  }
                }
                text = decoded;
              } else {
                // Handle array notation [(...) (...)]
                if (text.includes('[') && text.includes(']')) {
                  text = text.replace(/\[|\]/g, '');
                }
                
                // Clean escape sequences and formatting
                text = text
                  .replace(/\\n/g, ' ')
                  .replace(/\\r/g, ' ')
                  .replace(/\\t/g, ' ')
                  .replace(/\\([\\()])/g, '$1')
                  .replace(/\\\\/g, '\\')
                  .trim();
              }
              
              if (text.length > 1 && /[a-zA-Z0-9]/.test(text)) {
                textChunks.push(text);
              }
            }
          }
        }
      } catch (e) {
        console.log('⚠️ Error processing stream:', e.message);
      }
    }
    
    // Method 2: Extract from text objects with better parsing
    console.log('🔍 Method 2: Extracting from text objects...');
    const textObjectRegex = /BT\s*([\s\S]*?)\s*ET/g;
    const textObjects = [...pdfString.matchAll(textObjectRegex)];
    
    console.log('📝 Found', textObjects.length, 'text objects');
    
    for (const textObj of textObjects) {
      const content = textObj[1];
      
      // Multiple patterns for text extraction
      const patterns = [
        /\(([^)]+)\)\s*Tj/g,
        /\(([^)]+)\)\s*TJ/g,
        /\[(.*?)\]\s*TJ/g,
        /<([0-9a-fA-F\s]+)>\s*Tj/g,
        /\/F\d+\s+\d+\s+Tf\s*\(([^)]+)\)/g
      ];
      
      for (const pattern of patterns) {
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
                } else if (charCode === 10 || charCode === 13) {
                  decoded += ' ';
                }
              }
            }
            text = decoded;
          } else {
            // Handle standard text
            text = text
              .replace(/\\[nrt]/g, ' ')
              .replace(/\\(.)/g, '$1')
              .trim();
          }
          
          if (text.length > 1 && /[a-zA-Z0-9]/.test(text)) {
            textChunks.push(text);
          }
        }
      }
    }
    
    // Method 3: Advanced ASCII string extraction with better filtering
    if (textChunks.length < 10) {
      console.log('🔄 Method 3: Using enhanced ASCII string extraction...');
      
      // Find sequences of readable characters with word boundaries
      const asciiRegex = /[a-zA-Z][a-zA-Z0-9\s\.,;:!?\-@()#%&+=/]{3,}/g;
      const asciiMatches = pdfString.match(asciiRegex) || [];
      
      for (const match of asciiMatches) {
        const cleaned = match.trim();
        // Filter out PDF structure elements
        if (cleaned.length > 2 && 
            /[a-zA-Z]/.test(cleaned) && 
            !cleaned.match(/^(obj|endobj|stream|endstream|xref|trailer|startxref|%%EOF|%PDF)/) &&
            !cleaned.match(/^(Type|Font|Length|Filter|Width|Height)$/) &&
            !cleaned.includes('FlateDecode') &&
            !cleaned.includes('DeviceRGB') &&
            cleaned.length < 200) { // Avoid very long strings that might be encoded data
          textChunks.push(cleaned);
        }
      }
    }
    
    // Method 4: Look for specific text patterns that indicate resume content
    console.log('🔍 Method 4: Looking for resume-specific patterns...');
    const resumePatterns = [
      /(?:Name|Contact|Email|Phone|Address|Objective|Experience|Education|Skills|Languages)[\s:]+([^\n\r]{3,50})/gi,
      /([A-Z][a-z]+\s+[A-Z][a-z]+)/g, // Names
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, // Email
      /(\+?\d{1,4}[\s\-]?\(?\d{1,4}\)?[\s\-]?\d{1,4}[\s\-]?\d{1,9})/g, // Phone
      /(Bachelor|Master|PhD|Degree|University|College|School)[\s\w]*/gi,
      /(Manager|Engineer|Analyst|Developer|Specialist|Assistant|Director|Coordinator)[\s\w]*/gi
    ];
    
    for (const pattern of resumePatterns) {
      const matches = [...pdfString.matchAll(pattern)];
      for (const match of matches) {
        const text = match[1] || match[0];
        if (text && text.length > 2 && /[a-zA-Z]/.test(text)) {
          textChunks.push(text.trim());
        }
      }
    }
    
    // Combine and clean all extracted text
    extractedText = textChunks
      .filter(chunk => chunk && chunk.length > 1)
      .join(' ')
      .replace(/\s+/g, ' ')
      .replace(/(.)\1{4,}/g, '$1') // Remove excessive repeated characters
      .replace(/[^\w\s\.,;:!?\-@()#%&+=/]/g, ' ') // Clean special characters
      .trim();
    
    console.log('✅ PDF text extraction completed');
    console.log('📊 Extracted text length:', extractedText.length);
    console.log('📄 Text chunks found:', textChunks.length);
    
    if (extractedText.length > 30) {
      console.log('📄 Text preview:', extractedText.substring(0, 500) + '...');
      return extractedText;
    } else {
      // Final fallback: Extract any readable sequences
      console.log('⚠️ Minimal extraction, trying final fallback...');
      
      const fallbackText = pdfString
        .replace(/[^\x20-\x7E\n\r]/g, ' ')
        .replace(/\s+/g, ' ')
        .split(' ')
        .filter(word => word.length > 2 && /[a-zA-Z]/.test(word))
        .join(' ')
        .trim();
      
      if (fallbackText.length > 30) {
        console.log('✅ Fallback extraction successful:', fallbackText.length, 'characters');
        return fallbackText;
      }
      
      throw new Error('Could not extract sufficient readable text from PDF. The file may be image-based, heavily formatted, or encrypted.');
    }
    
  } catch (error) {
    console.error('❌ PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF: ' + error.message);
  }
}

async function analyzeResumeWithGPT4oMini(resumeText: string, fileName: string): Promise<ResumeAnalysisResult> {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  console.log('🤖 Starting GPT-4o-mini analysis for resume:', fileName);
  console.log('📊 Resume text length:', resumeText.length);
  console.log('📄 Resume text preview:', resumeText.substring(0, 500) + '...');
  
  // Validate that we have meaningful text
  if (resumeText.length < 30) {
    throw new Error('Insufficient text extracted from resume for analysis');
  }
  
  // Clean and prepare the text for analysis
  const cleanedText = resumeText
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\.,;:!?\-@()#%&+=/]/g, ' ')
    .trim();
  
  // Limit text length for API constraints
  const words = cleanedText.split(/\s+/);
  const maxWords = 2500; // Leave room for the prompt
  const trimmedText = words.slice(0, maxWords).join(' ');
  
  console.log('📊 Sending text to GPT-4o-mini - Original words:', words.length, 'Trimmed words:', trimmedText.split(/\s+/).length);

  const prompt = `You are an expert AI Career Advisor for the "TalentMatch.AI" platform analyzing a candidate's resume.

RESUME CONTENT:
"${trimmedText}"

Please analyze this resume and provide a comprehensive assessment. Return your analysis ONLY in valid JSON format with this exact structure:

{
  "profileSummary": "A 2-3 sentence professional summary based on the resume content",
  "highlightedSkills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"],
  "experienceLevel": "Junior|Mid|Senior",
  "careerFocus": "Primary career focus/industry based on resume content",
  "suggestedJobs": [
    {
      "title": "Job Title 1",
      "reason": "Why this job matches the candidate based on their experience",
      "keySkills": ["required skill 1", "required skill 2", "required skill 3"]
    },
    {
      "title": "Job Title 2", 
      "reason": "Why this job matches the candidate based on their experience",
      "keySkills": ["required skill 1", "required skill 2", "required skill 3"]
    },
    {
      "title": "Job Title 3",
      "reason": "Why this job matches the candidate based on their experience", 
      "keySkills": ["required skill 1", "required skill 2", "required skill 3"]
    }
  ]
}

ANALYSIS RULES:
1. Base ALL analysis on the actual resume content provided above
2. Extract 6-8 specific skills that are explicitly mentioned or clearly implied in the resume
3. Suggest 3-4 relevant job positions that match the candidate's background
4. Determine experience level based on years mentioned, job titles, or level of responsibilities described
5. Identify the primary career focus/industry from the resume content
6. Return ONLY valid JSON - no additional text, explanations, or formatting
7. Ensure all strings are properly escaped for JSON format
8. If the resume content is unclear, make reasonable inferences based on available information`;

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
            content: 'You are an expert resume analyst and career advisor. Analyze resumes accurately and provide structured JSON responses based only on the content provided. Focus on extracting real skills, experience, and career information from the resume text.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
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
    console.log('📝 Raw analysis response:', analysisText);
    
    // Parse the JSON response
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('❌ JSON parsing error:', parseError);
      console.log('📄 Raw response that failed to parse:', analysisText);
      throw new Error('Failed to parse AI analysis response as JSON');
    }
    
    // Validate and structure the response
    const result: ResumeAnalysisResult = {
      profileSummary: parsedAnalysis.profileSummary || 'Professional with diverse experience and demonstrated skills.',
      highlightedSkills: Array.isArray(parsedAnalysis.highlightedSkills) ? 
        parsedAnalysis.highlightedSkills.slice(0, 8) : 
        ['Communication', 'Problem Solving', 'Technical Skills', 'Project Management'],
      experienceLevel: ['Junior', 'Mid', 'Senior'].includes(parsedAnalysis.experienceLevel) ? 
        parsedAnalysis.experienceLevel : 'Mid',
      careerFocus: parsedAnalysis.careerFocus || 'Professional services and technology',
      suggestedJobs: Array.isArray(parsedAnalysis.suggestedJobs) ? 
        parsedAnalysis.suggestedJobs.slice(0, 4) : [
          {
            title: 'Professional Specialist',
            reason: 'Based on skills and experience demonstrated in resume',
            keySkills: ['Communication', 'Analysis', 'Problem Solving']
          }
        ],
      extractedText: trimmedText
    };
    
    console.log('✅ Structured analysis completed successfully');
    console.log('📊 Analysis summary:', {
      profileSummaryLength: result.profileSummary.length,
      skillsCount: result.highlightedSkills.length,
      jobSuggestionsCount: result.suggestedJobs.length,
      experienceLevel: result.experienceLevel,
      careerFocus: result.careerFocus
    });
    
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
    console.log('📄 Extracted text quality check - readable characters:', /[a-zA-Z]/.test(extractedText));

    if (!extractedText || extractedText.length < 30) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Could not extract sufficient readable text from the PDF. Please ensure the file contains readable text and is not image-based or corrupted.' 
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
