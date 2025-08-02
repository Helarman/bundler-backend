import { Controller, Post, Body, Get, Param, Delete, Query } from '@nestjs/common';
import { StaggerService } from './stagger.service';
import { AddOperationDto } from './dto/add-operation.dto';
import { BatchOperationsDto } from './dto/batch-operations.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { CleanupDto } from './dto/cleanup.dto';

@Controller('stagger')
export class StaggerController {
  constructor(private readonly staggerService: StaggerService) {}

  @Post('add')
  async addOperation(@Body() dto: AddOperationDto) {
    const { type, parameters, delay, priority, maxRetries, executeAt } = dto;

    const operationId = this.staggerService.addOperation(type, parameters, {
      delay,
      priority,
      maxRetries,
      executeAt: executeAt ? new Date(executeAt) : undefined
    });

    return {
      success: true,
      data: {
        operationId,
        type,
        priority: priority || 'medium',
        delay: delay || 2000,
        scheduledAt: executeAt || new Date(Date.now() + (delay || 2000))
      },
      message: 'Operation added to stagger queue'
    };
  }

  @Post('batch')
  async addBatchOperations(@Body() dto: BatchOperationsDto) {
    const { operations, staggerDelay, priority } = dto;

    const operationIds = this.staggerService.addBatchOperations(operations, {
      staggerDelay,
      priority
    });

    return {
      success: true,
      data: {
        operationIds,
        count: operations.length,
        staggerDelay: staggerDelay || 2000,
        priority: priority || 'medium'
      },
      message: `${operations.length} operations added to stagger queue`
    };
  }

  @Delete('cancel/:id')
  async cancelOperation(@Param('id') id: string) {
    const cancelled = this.staggerService.cancelOperation(id);
    
    if (!cancelled) {
      return {
        success: false,
        error: 'Operation not found or cannot be cancelled',
        code: 'OPERATION_NOT_FOUND'
      };
    }

    return {
      success: true,
      data: { operationId: id },
      message: 'Operation cancelled successfully'
    };
  }

  @Get('status/:id')
  async getOperationStatus(@Param('id') id: string) {
    const operation = this.staggerService.getOperation(id);
    
    if (!operation) {
      return {
        success: false,
        error: 'Operation not found',
        code: 'OPERATION_NOT_FOUND'
      };
    }

    return {
      success: true,
      data: {
        id: operation.id,
        type: operation.type,
        status: operation.status,
        priority: operation.priority,
        createdAt: operation.createdAt,
        scheduledAt: operation.scheduledAt,
        executedAt: operation.executedAt,
        completedAt: operation.completedAt,
        retryCount: operation.retryCount,
        maxRetries: operation.maxRetries,
        error: operation.error,
        result: operation.result
      },
      message: 'Operation status retrieved'
    };
  }

  @Get('operations')
  async getOperations(
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('priority') priority?: string,
    @Query('limit') limit: string = '50',
    @Query('offset') offset: string = '0'
  ) {
    const operations = this.staggerService.getOperations({
      status: status as any,
      type: type as any,
      priority: priority as any
    });

    const paginatedOps = operations.slice(
      parseInt(offset), 
      parseInt(offset) + parseInt(limit)
    );

    return {
      success: true,
      data: {
        operations: paginatedOps.map(op => ({
          id: op.id,
          type: op.type,
          status: op.status,
          priority: op.priority,
          createdAt: op.createdAt,
          scheduledAt: op.scheduledAt,
          executedAt: op.executedAt,
          completedAt: op.completedAt,
          retryCount: op.retryCount,
          error: op.error
        })),
        total: operations.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      },
      message: 'Operations retrieved successfully'
    };
  }

  @Get('stats')
  async getStats() {
    const stats = this.staggerService.getStats();
    return {
      success: true,
      data: stats,
      message: 'Stagger statistics retrieved successfully'
    };
  }

  @Post('config')
  async updateConfig(@Body() dto: UpdateConfigDto) {
    this.staggerService.updateConfig(dto);
    return {
      success: true,
      data: dto,
      message: 'Configuration updated successfully'
    };
  }

  @Post('cleanup')
  async cleanup(@Body() dto: CleanupDto) {
    const deleted = this.staggerService.cleanup(dto.olderThanHours);
    return {
      success: true,
      data: { 
        deleted,
        olderThanHours: dto.olderThanHours
      },
      message: `Cleaned up ${deleted} old operations`
    };
  }
}