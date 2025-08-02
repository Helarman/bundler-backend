import { Controller, Post, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { MixerService } from './mixer.service';
import { ConfigValidationResponseDto, MixerConfigDto } from './dto/config.dto';
import { BatchMixRequestDto, BatchMixResponseDto, MixResponseDto, SingleMixRequestDto } from './dto/mixer.dto';
import { MixerStatsResponseDto } from './dto/stats.dto';

@Controller('mixer')
export class MixerController {
  constructor(private readonly mixerService: MixerService) {}

  @Post('single')
  async singleMix(@Body() body: SingleMixRequestDto): Promise<MixResponseDto> {
    try {
      if (body.config) {
        const configValidation = this.mixerService.validateMixerConfig(body.config);
        if (!configValidation.valid) {
          throw new HttpException({
            success: false,
            error: configValidation.error,
            code: 'INVALID_CONFIG'
          }, HttpStatus.BAD_REQUEST);
        }
      }

      const result = await this.mixerService.mixSOLSingle(body.sender, body.recipient, body.config);

      if (!result.success) {
        throw new HttpException({
          success: false,
          error: result.error || 'Mixing operation failed',
          code: 'MIXING_ERROR'
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return {
        success: true,
        totalMixed: result.totalMixed,
        stepsExecuted: result.steps.length,
        mixingRounds: result.steps[result.steps.length - 1]?.round || 0,
        steps: result.steps.map(step => ({
          round: step.round,
          amount: step.amount,
          delay: step.delay
        }))
      };
    } catch (error) {
      throw new HttpException({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('batch')
  async batchMix(@Body() body: BatchMixRequestDto): Promise<BatchMixResponseDto> {
    try {
      if (body.config) {
        const configValidation = this.mixerService.validateMixerConfig(body.config);
        if (!configValidation.valid) {
          throw new HttpException({
            success: false,
            error: configValidation.error,
            code: 'INVALID_CONFIG'
          }, HttpStatus.BAD_REQUEST);
        }
      }

      const results = await this.mixerService.mixSOLBatch(body.sender, body.recipients, body.config);

      const successfulMixes = results.filter(r => r.success);
      const failedMixes = results.filter(r => !r.success);
      const totalMixed = successfulMixes.reduce((sum, r) => sum + r.totalMixed, 0);

      return {
        success: true,
        totalMixed,
        successfulMixes: successfulMixes.length,
        failedMixes: failedMixes.length,
        totalRecipients: body.recipients.length,
        results: results.map((result, index) => ({
          recipientIndex: index,
          success: result.success,
          totalMixed: result.totalMixed,
          stepsExecuted: result.steps.length,
          error: result.error
        }))
      };
    } catch (error) {
      throw new HttpException({
        success: false,
        error:  'Internal server error',
        code: 'INTERNAL_ERROR'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('stats')
  async getStats(): Promise<MixerStatsResponseDto> {
    return this.mixerService.getMixerStats();
  }

  @Post('config/validate')
  async validateConfig(@Body() body: MixerConfigDto): Promise<ConfigValidationResponseDto> {
    const validation = this.mixerService.validateMixerConfig(body);
    return {
      valid: validation.valid,
      error: validation.error,
      config: body
    };
  }
}