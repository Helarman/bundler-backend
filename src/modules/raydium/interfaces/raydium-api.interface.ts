export interface RaydiumApiResponse<T = any> {
  id: string;
  success: boolean;
  data?: T;
  msg?: string;
}