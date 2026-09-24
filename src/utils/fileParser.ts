import mammoth from 'mammoth';

export interface ParseResult {
  text: string;
  fileName: string;
  fileType: string;
  success: boolean;
  error?: string;
}

/**
 * Parse uploaded contract files into clean text
 * Supports: .txt, .docx, .pdf, .rtf, .html
 */
export async function parseContractFile(file: File): Promise<ParseResult> {
  const fileName = file.name;
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  const fileType = file.type || '';

  try {
    let text = '';

    // Handle different file types
    if (extension === 'txt' || fileType === 'text/plain') {
      text = await readAsText(file);
    } else if (extension === 'docx' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      text = await parseDocx(file);
    } else if (extension === 'pdf' || fileType === 'application/pdf') {
      text = await parsePdf(file);
    } else if (extension === 'html' || extension === 'htm' || fileType === 'text/html') {
      text = await parseHtml(file);
    } else if (extension === 'rtf' || fileType === 'application/rtf') {
      text = await readAsText(file);
      // RTF will have formatting codes, but readable text is still extractable
      text = cleanRtfText(text);
    } else if (extension === 'md' || fileType === 'text/markdown') {
      text = await readAsText(file);
    } else if (extension === 'csv' || fileType === 'text/csv') {
      text = await readAsText(file);
    } else {
      // Try reading as text as a fallback
      text = await readAsText(file);
      // Check if it looks like binary content
      if (looksLikeBinary(text)) {
        return {
          text: '',
          fileName,
          fileType: extension,
          success: false,
          error: `File format .${extension} is not supported. Please upload .txt, .docx, .pdf, .html, or .rtf files.`
        };
      }
    }

    // Clean up the extracted text
    text = cleanExtractedText(text);

    if (!text.trim()) {
      return {
        text: '',
        fileName,
        fileType: extension,
        success: false,
        error: 'No readable text could be extracted from this file. The file may be image-based or encrypted.'
      };
    }

    return {
      text,
      fileName,
      fileType: extension,
      success: true
    };
  } catch (error) {
    return {
      text: '',
      fileName,
      fileType: extension,
      success: false,
      error: `Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Read file as plain text
 */
function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string || '');
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Parse .docx files using mammoth
 */
async function parseDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/**
 * Parse PDF files using pdfjs-dist
 */
async function parsePdf(file: File): Promise<string> {
  // Dynamic import of pdfjs-dist
  const pdfjsLib = await import('pdfjs-dist');
  
  // Import worker URL using Vite's ?url suffix
  // This tells Vite to return the URL of the asset instead of its content
  const workerUrl = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).href;
  
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  });
  
  const pdf = await loadingTask.promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n\n';
  }
  
  return fullText;
}

/**
 * Parse HTML files and extract text content
 */
async function parseHtml(file: File): Promise<string> {
  const html = await readAsText(file);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.textContent || doc.body.innerText || '';
}

/**
 * Clean RTF formatting codes to extract readable text
 */
function cleanRtfText(text: string): string {
  // Remove RTF control words and groups
  let cleaned = text
    .replace(/\\[a-z]+\d*\s?/gi, ' ')
    .replace(/[{}]/g, '')
    .replace(/\\\*/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
  
  return cleaned;
}

/**
 * Clean extracted text from any format
 */
function cleanExtractedText(text: string): string {
  return text
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove excessive whitespace
    .replace(/[ \t]+/g, ' ')
    // Remove multiple blank lines (keep max 2)
    .replace(/\n{3,}/g, '\n\n')
    // Remove null bytes and other control characters (except newline and tab)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}

/**
 * Check if text looks like binary content
 */
function looksLikeBinary(text: string): boolean {
  // Check for high ratio of non-printable characters
  const nonPrintable = text.split('').filter(c => {
    const code = c.charCodeAt(0);
    return code < 32 && code !== 10 && code !== 13 && code !== 9;
  }).length;
  
  const ratio = nonPrintable / Math.max(text.length, 1);
  return ratio > 0.1; // More than 10% non-printable chars = likely binary
}

/**
 * Get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get supported file types for display
 */
export function getSupportedFileTypes(): string {
  return '.txt,.docx,.pdf,.html,.htm,.rtf,.md,.csv';
}

/**
 * Get accept attribute for file input
 */
export function getFileAcceptTypes(): string {
  return '.txt,.docx,.pdf,.html,.htm,.rtf,.md,.csv,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,text/plain,text/html,application/rtf';
}
