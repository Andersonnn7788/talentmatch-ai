
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeUrl } = await req.json();

    if (!resumeUrl) {
      return new Response(
        JSON.stringify({ error: 'Resume URL is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('📄 Starting text extraction from:', resumeUrl);

    // Fetch the file
    const fileResponse = await fetch(resumeUrl);
    
    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.status} ${fileResponse.statusText}`);
    }

    const contentType = fileResponse.headers.get('content-type') || '';
    const fileBuffer = await fileResponse.arrayBuffer();
    const uint8Array = new Uint8Array(fileBuffer);
    
    console.log('📁 File info - Size:', uint8Array.length, 'Content-Type:', contentType);
    
    let extractedText = '';

    // Check file type and extract accordingly
    if (contentType.includes('image/') || resumeUrl.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
      console.log('🖼️ Processing as image file - using OCR simulation');
      extractedText = await extractTextFromImage(uint8Array, contentType, resumeUrl);
    } else if (contentType.includes('application/pdf') || resumeUrl.toLowerCase().includes('.pdf')) {
      console.log('📑 Processing as PDF file');
      extractedText = await extractTextFromPDF(uint8Array, resumeUrl);
    } else if (contentType.includes('text/') || resumeUrl.toLowerCase().match(/\.(txt|rtf)$/i)) {
      console.log('📝 Processing as text file');
      try {
        const decoder = new TextDecoder('utf-8');
        extractedText = decoder.decode(uint8Array);
      } catch (e) {
        console.error('Text decoding failed:', e);
        throw new Error('Failed to decode text file');
      }
    } else {
      console.log('📄 Processing as document (DOC/DOCX or unknown format)');
      extractedText = await extractTextFromDocument(uint8Array, contentType, resumeUrl);
    }

    // Validate extracted text quality
    if (!extractedText || extractedText.trim().length < 50) {
      throw new Error('Insufficient text extracted from resume. Please ensure the file contains readable text.');
    }

    // Clean up the extracted text
    extractedText = cleanExtractedText(extractedText);

    console.log('✅ Text extraction completed, final length:', extractedText.length);
    console.log('📄 Text preview:', extractedText.substring(0, 200) + '...');

    return new Response(
      JSON.stringify({ 
        text: extractedText,
        extractionMethod: getExtractionMethod(contentType, resumeUrl),
        contentType: contentType
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Text extraction error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to extract text from resume'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function extractTextFromImage(imageData: Uint8Array, contentType: string, resumeUrl: string): Promise<string> {
  console.log('🔍 Starting OCR processing for image');
  
  // For now, we'll simulate OCR by analyzing the file
  // In a real implementation, you would send the image to an OCR service
  
  try {
    // Simulate OCR processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This is where you would call the actual OCR service
    // For now, we'll return a message indicating OCR is needed
    throw new Error('OCR processing requires integration with a vision API service like Google Vision, AWS Textract, or Azure Computer Vision. Please upload a PDF or text file instead.');
    
  } catch (error) {
    throw error;
  }
}

async function extractTextFromPDF(pdfData: Uint8Array, resumeUrl: string): Promise<string> {
  console.log('📑 Starting improved PDF text extraction');
  
  try {
    // Simulate PDF processing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Convert the PDF bytes to string for basic text extraction
    const decoder = new TextDecoder('latin1');
    const pdfString = decoder.decode(pdfData);
    
    // Look for text patterns in PDF that indicate actual readable content
    const textPatterns = [
      // Common PDF text patterns
      /BT\s+.*?ET/g,  // Text objects
      /\(([^)]+)\)/g,  // Text in parentheses
      /\/F\d+\s+\d+\s+Tf[^(]*\(([^)]+)\)/g,  // Font + text
    ];
    
    let extractedText = '';
    
    // Try multiple extraction methods
    for (const pattern of textPatterns) {
      const matches = pdfString.match(pattern);
      if (matches) {
        for (const match of matches) {
          // Clean up the match and extract readable text
          let cleanMatch = match
            .replace(/BT|ET|Tf|Tj/g, '') // Remove PDF operators
            .replace(/\/F\d+\s+\d+\s+/g, '') // Remove font references
            .replace(/[()]/g, '') // Remove parentheses
            .replace(/\\\d{3}/g, ' ') // Replace octal sequences
            .replace(/\\[rn]/g, '\n') // Replace escape sequences
            .trim();
          
          // Only add text that looks like real content
          if (cleanMatch.length > 2 && /[a-zA-Z]/.test(cleanMatch)) {
            extractedText += cleanMatch + ' ';
          }
        }
      }
    }
    
    // Try alternative extraction for stream objects
    const streamMatches = pdfString.match(/stream\s+(.*?)\s+endstream/gs);
    if (streamMatches) {
      for (const stream of streamMatches) {
        // Look for readable text in streams
        const readableText = stream.match(/[A-Za-z][A-Za-z0-9\s\.,;:!?\-]{3,}/g);
        if (readableText) {
          extractedText += readableText.join(' ') + ' ';
        }
      }
    }
    
    // If we still don't have enough text, try a more aggressive approach
    if (extractedText.trim().length < 100) {
      // Look for any sequences of readable characters
      const readableMatches = pdfString.match(/[A-Za-z][A-Za-z0-9\s\.,;:!?\-@()]{10,}/g);
      if (readableMatches) {
        extractedText = readableMatches
          .filter(match => match.length > 10 && /[A-Za-z]{3,}/.test(match))
          .join(' ');
      }
    }
    
    if (extractedText.trim().length < 50) {
      throw new Error('Could not extract sufficient text from PDF. The PDF may contain images or be password protected. Please try converting to text format or use a different resume.');
    }
    
    return extractedText.trim();
    
  } catch (error) {
    throw new Error('PDF text extraction failed. Please try uploading the resume as a text file (.txt) or ensure the PDF contains selectable text.');
  }
}

async function extractTextFromDocument(docData: Uint8Array, contentType: string, resumeUrl: string): Promise<string> {
  console.log('📄 Starting document text extraction');
  
  try {
    // Simulate document processing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Try to extract text from DOCX (which is essentially a ZIP file)
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const docString = decoder.decode(docData);
    
    // Look for XML content that might contain text
    const xmlMatches = docString.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
    let extractedText = '';
    
    if (xmlMatches) {
      for (const match of xmlMatches) {
        const textContent = match.replace(/<[^>]+>/g, '');
        if (textContent.trim().length > 0) {
          extractedText += textContent + ' ';
        }
      }
    }
    
    if (extractedText.trim().length < 50) {
      throw new Error('Could not extract sufficient text from document. Please try uploading the resume as a text file (.txt) or PDF.');
    }
    
    return extractedText.trim();
    
  } catch (error) {
    throw new Error('Document text extraction failed. Please try uploading the resume as a text file (.txt) or PDF.');
  }
}

function cleanExtractedText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, '\n') // Remove empty lines
    .replace(/[^\w\s\.,;:!?\-@()]/g, '') // Remove special characters but keep common punctuation
    .trim();
}

function getExtractionMethod(contentType: string, url: string): string {
  if (contentType.includes('image/') || url.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
    return 'OCR';
  } else if (contentType.includes('application/pdf') || url.toLowerCase().includes('.pdf')) {
    return 'PDF';
  } else if (contentType.includes('text/')) {
    return 'Text';
  } else {
    return 'Document';
  }
}
