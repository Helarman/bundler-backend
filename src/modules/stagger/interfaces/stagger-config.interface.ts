export interface StaggerConfig {
  maxConcurrentOperations: number;
  defaultDelay: number;
  minDelay: number;
  maxDelay: number;
  retryDelay: number;
  maxRetries: number;
  enablePriorityQueuing: boolean;
  enableAutoRetry: boolean;
}