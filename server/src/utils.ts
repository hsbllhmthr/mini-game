import crypto from 'crypto';

/**
 * Generates a room code in the format: 3 uppercase letters + hyphen + 4 digits (e.g., GOV-4821)
 */
export function generateRoomCode(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  
  let codeLetters = '';
  for (let i = 0; i < 3; i++) {
    codeLetters += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  let codeDigits = '';
  for (let i = 0; i < 4; i++) {
    codeDigits += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  
  return `${codeLetters}-${codeDigits}`;
}

/**
 * Generates a cryptographically random 64-character hex token
 */
export function generateFacilitatorToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
