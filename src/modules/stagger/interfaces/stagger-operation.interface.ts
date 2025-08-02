export interface StaggerOperation {
  id: string;
  type: 'buy' | 'sell' | 'transfer' | 'distribute' | 'consolidate';
  parameters: any;
  delay: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  createdAt: Date;
  scheduledAt: Date;
  executedAt?: Date;
  completedAt?: Date;
  result?: any;
  error?: string;
  retryCount: number;
  maxRetries: number;
}