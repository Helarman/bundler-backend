export interface GeneratedMintResponse {
  success: boolean;
  pubkey: string;
  message: string;
}

export interface ImageUploadResponse {
  success: boolean;
  url: string;
  filename: string;
  originalname: string;
  size: number;
  message: string;
}

export interface HealthCheckResponse {
  success: boolean;
  status: string;
  timestamp: string;
  services: {
    solana: string;
    jito: string;
  };
}