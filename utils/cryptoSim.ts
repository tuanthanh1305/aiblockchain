
import { DEMO_SEED_WORDS } from '../types';

export const generateRandomHexString = (length: number, includePrefix: boolean = true): string => {
  let result = '';
  const characters = 'abcdef0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return includePrefix ? `0x${result}` : result;
};

export const generateFakeAddress = (): string => {
  // Standard Ethereum-like address format
  return `0x${generateRandomHexString(40, false)}`;
};

export const generateFakePrivateKey = (): string => {
  // Standard 64-character hex string for private keys
  return `0x${generateRandomHexString(64, false)}`;
};

export const generateFakeSeedPhrase = (wordCount?: number): string[] => {
  // Common seed phrase lengths are 12 or 24 words.
  // For demo, let's make it variable, defaulting to 12 if not specified.
  const count = wordCount || 12; // (Math.random() < 0.5 ? 12 : 24); 
  const seedPhrase: string[] = [];
  const availableWords = [...DEMO_SEED_WORDS]; // Create a copy to avoid depletion if count > availableWords.length

  if (count > availableWords.length) {
      console.warn("Requested seed phrase word count exceeds available unique demo words. Duplicates may occur.");
  }
  
  for (let i = 0; i < count; i++) {
    if (availableWords.length === 0 && count > DEMO_SEED_WORDS.length) { // Refill if we absolutely need more words and allow duplicates
        availableWords.push(...DEMO_SEED_WORDS);
    }
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    seedPhrase.push(availableWords[randomIndex]);
    if (count <= DEMO_SEED_WORDS.length) { // Only remove if we want unique words and have enough
        availableWords.splice(randomIndex, 1);
    }
  }
  return seedPhrase;
};

// Simplified "hash" function for visual simulation. Not cryptographically secure.
export const generateFakeBlockHash = (data: string, length: number = 64): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  // Convert to hex and pad to simulate a real hash, then take a slice of it
  const hexHash = Math.abs(hash).toString(16).padStart(8, '0');
  // Repeat and mix to get desired length for visual effect
  let fullHash = hexHash;
  while (fullHash.length < length) {
    fullHash += generateRandomHexString(Math.min(length - fullHash.length, 8), false); // Add random hex to reach length
  }
  return `0x${fullHash.slice(0, length)}`;
};

// New function for SeedPhraseDemo
export const generateSimpleKeyFromWords = (words: string[]): string => {
  if (words.length === 0) return '0x' + '0'.repeat(64);
  const combined = words.join('');
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 31 + combined.charCodeAt(i)) | 0; // simple string hash
  }
  // Make it look like a private key (64 hex chars)
  let hexString = Math.abs(hash).toString(16);
  while (hexString.length < 16) { // Pad if too short
    hexString = '0' + hexString;
  }
  hexString = hexString.repeat(Math.ceil(64 / hexString.length)).slice(0, 64);
  return `0x${hexString}`;
};

// --- New utility functions for transaction details ---
export const generateFakeGasPrice = (): number => {
  // Simulate gas price, e.g., between 20 and 100 Gwei
  // For simplicity, we'll just use a number here. In reality, it's a BigNumber.
  return Math.floor(Math.random() * 80) + 20;
};

export const generateFakeGasUsed = (): number => {
  // Simulate gas used, e.g., 21000 for a standard transfer, more for contract interactions
  return 21000 + Math.floor(Math.random() * 5000); // Base + some variation
};

export const generateFakeNonce = (currentNonce: number = 0): number => {
  // In a real scenario, this would be fetched from the blockchain for the sender's address
  return currentNonce + 1; // Simplified: just increment.
};

// --- SHA-256 for Blockchain Demo View ---
export async function sha256(message: string): Promise<string> {
  try {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (e) {
    console.error("SHA-256 calculation failed. Ensure you are in a secure context (HTTPS) for crypto.subtle or provide a polyfill for testing environments.", e);
    // Fallback for non-secure contexts or testing environments (NOT FOR PRODUCTION Crypto)
    // This is a simple, non-secure hash for VISUAL DEMO fallback ONLY if crypto.subtle fails.
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
        const char = message.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    // Make it look like a SHA256 hash (64 hex chars)
    let hexString = Math.abs(hash).toString(16).padStart(8, '0');
    hexString = hexString.repeat(Math.ceil(64 / hexString.length)).slice(0, 64);
    return hexString;
  }
}