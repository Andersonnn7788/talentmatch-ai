
export interface PDFValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  info: {
    size: number;
    type: string;
    hasText: boolean;
    isEncrypted: boolean;
    version?: string;
  };
}

export const validatePDFFile = async (file: File): Promise<PDFValidationResult> => {
  const result: PDFValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    info: {
      size: file.size,
      type: file.type,
      hasText: false,
      isEncrypted: false
    }
  };

  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    result.errors.push('File size exceeds 10MB limit');
    result.isValid = false;
  }

  // Check if file is empty
  if (file.size === 0) {
    result.errors.push('File is empty');
    result.isValid = false;
  }

  // Check file type
  if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
    result.errors.push('File is not a PDF');
    result.isValid = false;
  }

  try {
    // Read first few bytes to validate PDF header
    const arrayBuffer = await file.slice(0, 1024).arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const header = new TextDecoder().decode(uint8Array.slice(0, 8));
    
    if (!header.startsWith('%PDF-')) {
      result.errors.push('File does not have a valid PDF header');
      result.isValid = false;
      return result;
    }

    // Extract PDF version
    const versionMatch = header.match(/%PDF-(\d\.\d)/);
    if (versionMatch) {
      result.info.version = versionMatch[1];
    }

    // Check for encryption in the first KB
    const content = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);
    
    if (content.includes('/Encrypt') || content.includes('/Filter/Standard')) {
      result.errors.push('PDF appears to be password-protected or encrypted');
      result.info.isEncrypted = true;
      result.isValid = false;
    }

    // Check for text content indicators
    result.info.hasText = content.includes('/Type/Font') || 
                          content.includes('BT') || 
                          content.includes('Tj');

    if (!result.info.hasText) {
      result.warnings.push('PDF may not contain searchable text - OCR may be required');
    }

    // Additional validations
    if (file.size < 1024) {
      result.warnings.push('File is very small - may not contain sufficient content');
    }

    if (result.info.version && parseFloat(result.info.version) > 2.0) {
      result.warnings.push('PDF version is very new - compatibility may vary');
    }

  } catch (error) {
    result.errors.push(`Failed to validate PDF structure: ${error.message}`);
    result.isValid = false;
  }

  return result;
};

export const getPDFValidationMessage = (validation: PDFValidationResult): string => {
  if (!validation.isValid) {
    return validation.errors.join('. ');
  }
  
  if (validation.warnings.length > 0) {
    return validation.warnings.join('. ');
  }
  
  return 'PDF file looks good for processing';
};
