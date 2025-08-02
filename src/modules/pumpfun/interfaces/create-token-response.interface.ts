export interface CreateTokenResponse {
  success: boolean;
  transactions?: string[];
  mintAddress?: string;
  message?: string;
  error?: string;
}