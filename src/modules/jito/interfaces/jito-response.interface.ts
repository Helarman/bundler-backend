export interface JitoResponse<T = any> {
  result?: T;
  error?: {
    message: string;
    [key: string]: any;
  };
}