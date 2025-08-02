import { Injectable, Logger } from '@nestjs/common';
import { Keypair } from '@solana/web3.js';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UtilitiesService {
  private readonly logger = new Logger(UtilitiesService.name);
  private readonly uploadDir = path.join(__dirname, '../../../uploads');

  constructor() {
    this.ensureUploadDirectoryExists();
  }

  private ensureUploadDirectoryExists() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  generateMintAddress() {
    this.logger.log('Generate mint request received');
    try {
      const mintKeypair = Keypair.generate();
      const mintAddress = mintKeypair.publicKey.toBase58();
      this.logger.log(`Mint address generated: ${mintAddress}`);
      
      return {
        success: true,
        pubkey: mintAddress,
        message: 'Mint address generated successfully'
      };
    } catch (error) {
      this.logger.error('Error generating mint address:', error);
      throw new Error('Failed to generate mint address');
    }
  }

  handleFileUpload(file: Express.Multer.File) {
    this.logger.log('Image upload request received');
    
    if (!file) {
      throw new Error('No image file provided');
    }

    const fileUrl = `/uploads/${file.filename}`;
    
    this.logger.log('Image uploaded successfully', { 
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      url: fileUrl
    });

    return {
      success: true,
      url: fileUrl,
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      message: 'Image uploaded successfully'
    };
  }

  checkHealth() {
    return {
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        solana: 'connected',
        jito: 'available'
      }
    };
  }
}