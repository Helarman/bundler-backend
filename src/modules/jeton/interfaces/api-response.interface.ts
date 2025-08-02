export interface ApiResponse<T> {
  success: boolean;
  result?: T;
  error?: string;
}

export interface BundleResult {
  [key: string]: any;
}