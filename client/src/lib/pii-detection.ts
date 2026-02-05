export interface PIIWarning {
  type: 'email' | 'phone' | 'ssn' | 'credit_card';
  pattern: string;
}

const patterns = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /(\+?1?[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
  ssn: /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g,
  credit_card: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
};

export function detectPII(text: string): PIIWarning[] {
  const warnings: PIIWarning[] = [];
  
  for (const [type, pattern] of Object.entries(patterns)) {
    const matches = text.match(pattern);
    if (matches) {
      for (const match of matches) {
        warnings.push({
          type: type as PIIWarning['type'],
          pattern: match,
        });
      }
    }
  }
  
  return warnings;
}

export function hasPotentialPII(text: string): boolean {
  return detectPII(text).length > 0;
}
