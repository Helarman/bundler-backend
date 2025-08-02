import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RaydiumSdkService } from './raydium-sdk.service';
import { SwapParamsDto } from './dto/swap-params.dto';
import { SwapResultDto } from './dto/swap-result.dto';
import { PoolInfoDto } from './dto/pool-info.dto';
import { CreateCpmmPoolDto } from './dto/create-cpmm-pool.dto';
import { CreateClmmPoolDto } from './dto/create-clmm-pool.dto';
import { CreateAmmPoolDto } from './dto/create-amm-pool.dto';

@Controller('raydium-sdk')
export class RaydiumSdkController {
  constructor(private readonly raydiumService: RaydiumSdkService) {}

  @Post('swap/route')
  async routeSwap(@Body() params: SwapParamsDto): Promise<SwapResultDto> {
    try {
      return await this.raydiumService.routeSwap(params);
    } catch (error) {
      throw new HttpException(
     'Route swap failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('swap/cpmm')
  async cpmmSwap(@Body() params: SwapParamsDto & { poolId: string }): Promise<SwapResultDto> {
    try {
      if (!params.poolId) {
        throw new HttpException('poolId is required for CPMM swap', HttpStatus.BAD_REQUEST);
      }
      return await this.raydiumService.cpmmSwap(params);
    } catch (error) {
      throw new HttpException(
     'CPMM swap failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('swap/clmm')
  async clmmSwap(@Body() params: SwapParamsDto & { poolId: string }): Promise<SwapResultDto> {
    try {
      if (!params.poolId) {
        throw new HttpException('poolId is required for CLMM swap', HttpStatus.BAD_REQUEST);
      }
      return await this.raydiumService.clmmSwap(params);
    } catch (error) {
      throw new HttpException(
     'CLMM swap failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('pools')
  async getPools(
    @Query('mintA') mintA: string,
    @Query('mintB') mintB: string
  ): Promise<{ pools: PoolInfoDto[]; count: number }> {
    try {
      const pools = await this.raydiumService.getPoolsForPair(mintA, mintB);
      return { pools, count: pools.length };
    } catch (error) {
      throw new HttpException(
     'Failed to get pools',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('cache/clear')
  async clearCache(): Promise<{ success: boolean; message: string }> {
    try {
      this.raydiumService.clearCache();
      return { success: true, message: 'Cache cleared successfully' };
    } catch (error) {
      throw new HttpException(
     'Failed to clear cache',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('status')
  async getStatus() {
    return {
      success: true,
      data: {
        status: 'ready',
        cluster: process.env.NODE_ENV === 'development' ? 'devnet' : 'mainnet',
        rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
        features: [
          'route-swap',
          'cpmm-swap',
          'clmm-swap',
          'pool-discovery',
          'pool-creation-cpmm',
          'pool-creation-clmm',
          'pool-creation-amm',
          'config-management',
          'cache-management'
        ]
      }
    };
  }

  @Post('pools/create/cpmm')
  async createCpmmPool(@Body() params: CreateCpmmPoolDto) {
    try {
      return await this.raydiumService.createCpmmPool(params);
    } catch (error) {
      throw new HttpException(
     'CPMM pool creation failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('pools/create/clmm')
  async createClmmPool(@Body() params: CreateClmmPoolDto) {
    try {
      return await this.raydiumService.createClmmPool(params);
    } catch (error) {
      throw new HttpException(
     'CLMM pool creation failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('pools/create/amm')
  async createAmmPool(@Body() params: CreateAmmPoolDto) {
    try {
      return await this.raydiumService.createAmmPool(params);
    } catch (error) {
      throw new HttpException(
     'AMM pool creation failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('configs/cpmm')
  async getCpmmConfigs() {
    try {
      const configs = await this.raydiumService.getCpmmFeeConfigs();
      return { configs, count: configs.length };
    } catch (error) {
      throw new HttpException(
     'Failed to get CPMM configs',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('configs/clmm')
  async getClmmConfigs() {
    try {
      const configs = await this.raydiumService.getClmmConfigs();
      return { configs, count: configs.length };
    } catch (error) {
      throw new HttpException(
     'Failed to get CLMM configs',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}