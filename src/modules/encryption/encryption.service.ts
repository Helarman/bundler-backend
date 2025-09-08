import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  scryptSync,
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "crypto";

@Injectable()
export class EncryptionService {
  constructor(private readonly configService: ConfigService) {}

  private algorithm = "aes-256-cbc";

  private key(): Buffer {
    const envKey = this.configService.get<string>("ENCRYPTION_KEY");
    if (!envKey){ 
      throw Error('No key in env');
    }
    
    return scryptSync(envKey, "salt", 32);
  }

  private iv(): Buffer {
    return randomBytes(16);
  }

  public encrypt(value: string): string {
    const iv = this.iv();
    const utf8Value = Buffer.from(value, "utf-8");
    const cipher = createCipheriv(this.algorithm, this.key(), iv);

    return Buffer.concat([
      iv,
      cipher.update(utf8Value),
      cipher.final(),
    ]).toString("base64");
  }

 public decrypt(value: string): string {
  try {
    console.log
    const isHex = /^[0-9a-fA-F]+$/.test(value);
    
    let buffer: Buffer;
    if (isHex) {
      buffer = Buffer.from(value, 'hex');
    } else {
      buffer = Buffer.from(value, 'base64');
    }
    
    if (buffer.length < 16) throw new Error('Invalid encrypted data');
    
    const iv = buffer.subarray(0, 16);
    const encrypted = buffer.subarray(16);
    const decipher = createDecipheriv(this.algorithm, this.key(), iv);
    
    return Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]).toString('utf-8');
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred';
    
    console.error('Decryption failed:', {
      input: value?.substring(0, 50) + '...',
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    throw new Error(`Decryption failed: ${errorMessage}`);
  }
}
}