import { describe, it, expect, beforeEach } from 'vitest';
import { encrypt, decrypt, encryptCredentials, decryptCredentials } from '../lib/encryption';

describe('Encryption', () => {
  const testText = 'This is a secret message';

  it('should encrypt and decrypt text correctly', async () => {
    const encrypted = await encrypt(testText);
    const decrypted = await decrypt(encrypted);
    
    expect(decrypted).toBe(testText);
  });

  it('should produce different encrypted output for same input', async () => {
    const encrypted1 = await encrypt(testText);
    const encrypted2 = await encrypt(testText);
    
    expect(encrypted1).not.toBe(encrypted2);
  });

  it('should throw error for invalid encrypted text', async () => {
    await expect(decrypt('invalid-format')).rejects.toThrow('Invalid encrypted text format');
  });
});

describe('Credentials Encryption', () => {
  const testCredentials = {
    username: 'test@example.com',
    password: 'super-secret-password-123',
    accessToken: 'access_token_xyz',
    refreshToken: 'refresh_token_abc',
  };

  it('should encrypt and decrypt credentials correctly', async () => {
    const encrypted = await encryptCredentials(testCredentials);
    const decrypted = await decryptCredentials(encrypted);
    
    expect(decrypted).toEqual(testCredentials);
  });

  it('should not store plain text credentials', async () => {
    const encrypted = await encryptCredentials(testCredentials);
    
    expect(encrypted).not.toContain(testCredentials.password);
    expect(encrypted).not.toContain(testCredentials.accessToken);
  });
});
