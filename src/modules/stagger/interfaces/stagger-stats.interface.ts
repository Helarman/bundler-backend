export interface StaggerStats {
  totalOperations: number;
  pendingOperations: number;
  runningOperations: number;
  completedOperations: number;
  failedOperations: number;
  cancelledOperations: number;
  averageExecutionTime: number;
  successRate: number;
}