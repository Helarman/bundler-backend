import { Controller, Get, Post, UploadedFile, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UtilitiesService } from './utilities.service';
import { GenerateMintResponseDto, HealthCheckResponseDto, UploadImageResponseDto } from './dto/upload-image.dto';
import { diskStorage } from 'multer';
import * as path from 'path';

export const allowedImageTypes = /jpeg|jpg|png|gif|webp/;

@Controller('utilities')
export class UtilitiesController {
  constructor(private readonly utilitiesService: UtilitiesService) {}

  @Get('generate-mint')
  async generateMint(): Promise<GenerateMintResponseDto> {
    try {
      return this.utilitiesService.generateMintAddress();
    } catch (error) {
      throw new HttpException(
        'Failed to generate mint address',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../../uploads'));
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedImageTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'), false);
      }
    }
  }))
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<UploadImageResponseDto> {
    try {
      return this.utilitiesService.handleFileUpload(file);
    } catch (error) {
      throw new HttpException('Failed to upload image',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('health')
  async checkHealth(): Promise<HealthCheckResponseDto> {
    return this.utilitiesService.checkHealth();
  }
}