import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 16;

// Get encryption key from environment
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  console.warn('ENCRYPTION_KEY not set. Encryption will use a temporary key (NOT SECURE!)');
}

function getKey(): Buffer {
  const key = ENCRYPTION_KEY || 'temporary-insecure-key-for-dev';
  // Ensure key is exactly 32 bytes
  if (key.length < 32) {
    return Buffer.from(key.padEnd(32, '0'));
  }
  return Buffer.from(key.slice(0, 32));
}

export async function encrypt(text: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const key = await deriveKey(getKey(), salt);
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  // Combine salt + iv + authTag + encrypted data
  return `${salt.toString('hex')}:${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export async function decrypt(encryptedText: string): Promise<string> {
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 4) {
      throw new Error('Invalid encrypted text format');
    }

    const [saltHex, ivHex, authTagHex, encrypted] = parts;

    const salt = Buffer.from(saltHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const key = await deriveKey(getKey(), salt);

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error: any) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
}

async function deriveKey(password: Buffer, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey as Buffer);
    });
  });
}

// Helper functions for portal credentials
export async function encryptCredentials(credentials: {
  username?: string;
  password?: string;
  accessToken?: string;
  refreshToken?: string;
}): Promise<string> {
  return encrypt(JSON.stringify(credentials));
}

export async function decryptCredentials(encrypted: string): Promise<{
  username?: string;
  password?: string;
  accessToken?: string;
  refreshToken?: string;
}> {
  const decrypted = await decrypt(encrypted);
  return JSON.parse(decrypted);
}

// Hash API keys for storage
export function hashApiKey(apiKey: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

// Verify API key
export function verifyApiKey(plainKey: string, hashedKey: string): boolean {
  return hashApiKey(plainKey) === hashedKey;
}
