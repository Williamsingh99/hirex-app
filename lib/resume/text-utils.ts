export function cleanResumeText(text: string): string {
  if (!text) return '';

  return text
    // 1. Strip pagination: "Page X of Y" or "Page X"
    .replace(/\bPage\s+\d+\s+of\s+\d+\b/gi, '')
    .replace(/\bPage\s+\d+\b/gi, '')

    // 2. Normalize excessive whitespace and newlines
    .replace(/[\r\n]{3,}/g, '\n\n') // Max 2 consecutive newlines
    .replace(/[ \t]+/g, ' ')        // Collapse horizontal whitespace

    // 3. Strip common PDF artifacts and non-printable characters
    .replace(/[^\x20-\x7E\n\r\t]/g, '')

    .trim();
}
