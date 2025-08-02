import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JetonService } from '../jeton/jeton.service';
import { StaggerOperation } from './interfaces/stagger-operation.interface';
import { StaggerConfig } from './interfaces/stagger-config.interface';
import { StaggerStats } from './interfaces/stagger-stats.interface';

@Injectable()
export class StaggerService implements OnModuleInit {
  private readonly logger = new Logger(StaggerService.name);
  private operations: Map<string, StaggerOperation> = new Map();
  private runningOperations: Set<string> = new Set();
  private executionQueue: string[] = [];
  
  private config: StaggerConfig = {
    maxConcurrentOperations: 5,
    defaultDelay: 2000,
    minDelay: 500,
    maxDelay: 30000,
    retryDelay: 5000,
    maxRetries: 3,
    enablePriorityQueuing: true,
    enableAutoRetry: true
  };

  constructor(
    private readonly jetonService: JetonService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  onModuleInit() {
    this.startExecutionLoop();
    this.logger.log('Stagger Service initialized', {
      maxConcurrentOperations: this.config.maxConcurrentOperations,
      enablePriorityQueuing: this.config.enablePriorityQueuing
    });
  }

  addOperation(
    type: StaggerOperation['type'],
    parameters: any,
    options: {
      delay?: number;
      priority?: StaggerOperation['priority'];
      maxRetries?: number;
      executeAt?: Date;
    } = {}
  ): string {
    const id = this.generateOperationId();
    const now = new Date();
    const scheduledAt = options.executeAt || new Date(now.getTime() + (options.delay || this.config.defaultDelay));
    
    const operation: StaggerOperation = {
      id,
      type,
      parameters,
      delay: options.delay || this.config.defaultDelay,
      priority: options.priority || 'medium',
      status: 'pending',
      createdAt: now,
      scheduledAt,
      retryCount: 0,
      maxRetries: options.maxRetries || this.config.maxRetries
    };

    this.operations.set(id, operation);
    this.addToQueue(id);

    this.logger.log('Stagger operation added', {
      id,
      type,
      priority: operation.priority,
      scheduledAt: scheduledAt.toISOString(),
      delay: operation.delay
    });

    this.eventEmitter.emit('operation.added', operation);
    return id;
  }

  addBatchOperations(
    operations: Array<{
      type: StaggerOperation['type'];
      parameters: any;
      delay?: number;
      priority?: StaggerOperation['priority'];
    }>,
    options: {
      staggerDelay?: number;
      priority?: StaggerOperation['priority'];
    } = {}
  ): string[] {
    const ids: string[] = [];
    const baseDelay = options.staggerDelay || this.config.defaultDelay;
    
    operations.forEach((op, index) => {
      const delay = baseDelay + (index * 1000);
      const id = this.addOperation(op.type, op.parameters, {
        delay,
        priority: op.priority || options.priority
      });
      ids.push(id);
    });

    this.logger.log('Batch stagger operations added', {
      count: operations.length,
      ids: ids.slice(0, 3).concat(ids.length > 3 ? ['...'] : [])
    });

    return ids;
  }

  cancelOperation(id: string): boolean {
    const operation = this.operations.get(id);
    if (!operation || operation.status === 'running') {
      return false;
    }

    operation.status = 'cancelled';
    operation.completedAt = new Date();
    
    const queueIndex = this.executionQueue.indexOf(id);
    if (queueIndex > -1) {
      this.executionQueue.splice(queueIndex, 1);
    }

    this.logger.log('Operation cancelled', { id });
    this.eventEmitter.emit('operation.cancelled', operation);
    return true;
  }

  getOperation(id: string): StaggerOperation | undefined {
    return this.operations.get(id);
  }

  getOperations(filter?: {
    status?: StaggerOperation['status'];
    type?: StaggerOperation['type'];
    priority?: StaggerOperation['priority'];
  }): StaggerOperation[] {
    let operations = Array.from(this.operations.values());
    
    if (filter) {
      if (filter.status) {
        operations = operations.filter(op => op.status === filter.status);
      }
      if (filter.type) {
        operations = operations.filter(op => op.type === filter.type);
      }
      if (filter.priority) {
        operations = operations.filter(op => op.priority === filter.priority);
      }
    }

    return operations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getStats(): StaggerStats {
    const operations = Array.from(this.operations.values());
    const completedOps = operations.filter(op => op.status === 'completed');
    const executionTimes = completedOps
      .filter(op => op.executedAt && op.completedAt)
      .map(op => op.completedAt!.getTime() - op.executedAt!.getTime());

    return {
      totalOperations: operations.length,
      pendingOperations: operations.filter(op => op.status === 'pending').length,
      runningOperations: operations.filter(op => op.status === 'running').length,
      completedOperations: completedOps.length,
      failedOperations: operations.filter(op => op.status === 'failed').length,
      cancelledOperations: operations.filter(op => op.status === 'cancelled').length,
      averageExecutionTime: executionTimes.length > 0 
        ? executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length 
        : 0,
      successRate: operations.length > 0 
        ? (completedOps.length / operations.length) * 100 
        : 0
    };
  }

  updateConfig(newConfig: Partial<StaggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.logger.log('Stagger configuration updated', newConfig);
    this.eventEmitter.emit('config.updated', this.config);
  }
    public cleanup(olderThanHours: number = 24): number {
    const cutoffTime = new Date(Date.now() - (olderThanHours * 60 * 60 * 1000));
    const toDelete: string[] = [];

    this.operations.forEach((operation, id) => {
        if (
        (operation.status === 'completed' || operation.status === 'failed' || operation.status === 'cancelled') &&
        operation.completedAt &&
        operation.completedAt < cutoffTime
        ) {
        toDelete.push(id);
        }
    });

    toDelete.forEach(id => this.operations.delete(id));
    
    this.logger.log('Cleaned up old operations', { 
        deleted: toDelete.length,
        olderThanHours 
    });

    return toDelete.length;
    }

  private addToQueue(id: string): void {
    if (this.config.enablePriorityQueuing) {
      const operation = this.operations.get(id)!;
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      
      let insertIndex = this.executionQueue.length;
      for (let i = 0; i < this.executionQueue.length; i++) {
        const queuedOp = this.operations.get(this.executionQueue[i])!;
        if (priorityOrder[operation.priority] < priorityOrder[queuedOp.priority]) {
          insertIndex = i;
          break;
        }
      }
      
      this.executionQueue.splice(insertIndex, 0, id);
    } else {
      this.executionQueue.push(id);
    }
  }

  private startExecutionLoop(): void {
    setInterval(() => {
      this.processQueue();
    }, 1000);
  }

  private async processQueue(): Promise<void> {
    if (this.runningOperations.size >= this.config.maxConcurrentOperations) {
      return;
    }

    const now = new Date();
    const availableSlots = this.config.maxConcurrentOperations - this.runningOperations.size;
    const toExecute: string[] = [];

    for (let i = 0; i < this.executionQueue.length && toExecute.length < availableSlots; i++) {
      const id = this.executionQueue[i];
      const operation = this.operations.get(id);
      
      if (!operation || operation.status !== 'pending') {
        this.executionQueue.splice(i, 1);
        i--;
        continue;
      }

      if (operation.scheduledAt <= now) {
        toExecute.push(id);
        this.executionQueue.splice(i, 1);
        i--;
      }
    }

    toExecute.forEach(id => {
      this.executeOperation(id);
    });
  }

  private async executeOperation(id: string): Promise<void> {
    const operation = this.operations.get(id);
    if (!operation) return;

    this.runningOperations.add(id);
    operation.status = 'running';
    operation.executedAt = new Date();

    this.logger.log('Executing stagger operation', {
      id,
      type: operation.type,
      priority: operation.priority
    });

    this.eventEmitter.emit('operation.started', operation);

    try {
      let result;
      
      switch (operation.type) {
        case 'buy':
          result = await this.executeBuyOperation(operation.parameters);
          break;
        case 'sell':
          result = await this.executeSellOperation(operation.parameters);
          break;
        case 'transfer':
          result = await this.executeTransferOperation(operation.parameters);
          break;
        case 'distribute':
          result = await this.executeDistributeOperation(operation.parameters);
          break;
        case 'consolidate':
          result = await this.executeConsolidateOperation(operation.parameters);
          break;
        default:
          throw new Error(`Unknown operation type: ${operation.type}`);
      }

      operation.status = 'completed';
      operation.result = result;
      operation.completedAt = new Date();

      this.logger.log('Stagger operation completed', {
        id,
        type: operation.type,
        executionTime: operation.completedAt.getTime() - operation.executedAt!.getTime()
      });

      this.eventEmitter.emit('operation.completed', operation);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      operation.error = errorMessage;
      operation.retryCount++;

      if (this.config.enableAutoRetry && operation.retryCount < operation.maxRetries) {
        operation.status = 'pending';
        operation.scheduledAt = new Date(Date.now() + this.config.retryDelay);
        this.addToQueue(id);
        
        this.logger.warn('Stagger operation failed, scheduling retry', {
          id,
          error: errorMessage,
          retryCount: operation.retryCount,
          maxRetries: operation.maxRetries
        });

        this.eventEmitter.emit('operation.retry', operation);
      } else {
        operation.status = 'failed';
        operation.completedAt = new Date();
        
        this.logger.error('Stagger operation failed permanently', {
          id,
          error: errorMessage,
          retryCount: operation.retryCount
        });

        this.eventEmitter.emit('operation.failed', operation);
      }
    } finally {
      this.runningOperations.delete(id);
    }
  }

  private async executeBuyOperation(params: any): Promise<any> {
    return await this.jetonService.buyTokens(params.walletAddresses, params.tokenConfig, params.customAmounts);
  }

  private async executeSellOperation(params: any): Promise<any> {
    return await this.jetonService.sellTokens(params.walletAddresses, params.tokenConfig, params.customPercentages);
  }

  private async executeTransferOperation(params: any): Promise<any> {
    return await this.jetonService.transferTokens(params.senderPublicKey, params.receiver, params.tokenAddress, params.amount);
  }

  private async executeDistributeOperation(params: any): Promise<any> {
    return await this.jetonService.distributeSOL(params.wallets, params.amount);
  }

  private async executeConsolidateOperation(params: any): Promise<any> {
    return await this.jetonService.consolidateSOL(params.wallets, params.targetWallet, params.amount);
  }

  private generateOperationId(): string {
    return `stagger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}