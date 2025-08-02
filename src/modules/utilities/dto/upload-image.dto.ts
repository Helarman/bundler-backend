export class UploadImageResponseDto {
  success: boolean;
  url: string;
  filename: string;
  originalname: string;
  size: number;
  message: string;
}

export class GenerateMintResponseDto {
  success: boolean;
  pubkey: string;
  message: string;
}

export class HealthCheckResponseDto {
  success: boolean;
  status: string;
  timestamp: string;
  services: {
    solana: string;
    jito: string;
  };
}