import { 
  Controller, 
  Get, 
  Query, 
  Param, 
  Delete, 
  ParseArrayPipe, 
  ParseIntPipe,
  DefaultValuePipe
} from '@nestjs/common';
import { RaydiumService } from './raydium.service';
import { GetTokenAnalysisDto } from './dto/get-token-analysis.dto';
import { GetPoolsByMintDto } from './dto/get-pools-by-mint.dto';
import { FindBestPoolDto } from './dto/find-best-pool.dto';
import { GetPoolLiquidityDto } from './dto/get-pool-liquidity.dto';
import { ClearCacheDto } from './dto/clear-cache.dto';


@Controller('raydium')
export class RaydiumController {
  constructor(private readonly raydiumService: RaydiumService) {}

  @Get('info')
  async getMainInfo() {
    const info = await this.raydiumService.getMainInfo();
    return {
      success: true,
      data: info,
      timestamp: new Date().toISOString()
    };
  }

  @Get('tokens/:mintAddress')
  async getTokenAnalysis(@Param() dto: GetTokenAnalysisDto) {
    const analysis = await this.raydiumService.getTokenAnalysis(dto.mintAddress);
    return {
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    };
  }

  @Get('prices')
  async getTokenPrices(
    @Query('mints', new ParseArrayPipe({ items: String, separator: ',' })) 
    mints: string[]
  ) {
    const prices = await this.raydiumService.getTokenPrices(mints);
    return {
      success: true,
      data: prices,
      timestamp: new Date().toISOString()
    };
  }

  @Get('pools/search')
  async searchPools(@Query() dto: GetPoolsByMintDto) {
    const pools = await this.raydiumService.getPoolsByMint(
      dto.mint1, 
      dto.mint2, 
      dto.poolType, 
      dto.pageSize
    );
    
    return {
      success: true,
      data: pools,
      count: pools.length,
      timestamp: new Date().toISOString()
    };
  }

  @Get('pools/best')
  async findBestPool(@Query() dto: FindBestPoolDto) {
    const bestPool = await this.raydiumService.findBestPool(dto.mintA, dto.mintB);
    
    if (!bestPool) {
      return {
        success: false,
        error: 'No pools found for this token pair',
        timestamp: new Date().toISOString()
      };
    }
    
    return {
      success: true,
      data: bestPool,
      timestamp: new Date().toISOString()
    };
  }

  @Get('pools/:poolId/liquidity')
  async getPoolLiquidityHistory(@Param() dto: GetPoolLiquidityDto) {
    const history = await this.raydiumService.getPoolLiquidityHistory(dto.poolId);
    return {
      success: true,
      data: history,
      timestamp: new Date().toISOString()
    };
  }

  @Get('pools/info')
  async getPoolsInfo(
    @Query('ids', new ParseArrayPipe({ items: String, separator: ',' })) 
    ids: string[]
  ) {
    const pools = await this.raydiumService.getPoolsInfo(ids);
    return {
      success: true,
      data: pools,
      count: pools.length,
      timestamp: new Date().toISOString()
    };
  }

  @Get('pools/keys')
  async getPoolKeys(
    @Query('ids', new ParseArrayPipe({ items: String, separator: ',' })) 
    ids: string[]
  ) {
    const keys = await this.raydiumService.getPoolKeys(ids);
    return {
      success: true,
      data: keys,
      count: keys.length,
      timestamp: new Date().toISOString()
    };
  }

  @Get('tokens/list')
  async getDefaultMintList() {
    const mintList = await this.raydiumService.getDefaultMintList();
    return {
      success: true,
      data: mintList,
      timestamp: new Date().toISOString()
    };
  }

  @Get('tokens/info')
  async getTokenInfo(
    @Query('mints', new ParseArrayPipe({ items: String, separator: ',' })) 
    mints: string[]
  ) {
    const tokens = await this.raydiumService.getMintInfo(mints);
    return {
      success: true,
      data: tokens,
      count: tokens.length,
      timestamp: new Date().toISOString()
    };
  }

  @Delete('cache')
  async clearCache(@Query() dto: ClearCacheDto) {
    await this.raydiumService.clearCache(dto.pattern);
    return {
      success: true,
      message: 'Cache cleared successfully',
      pattern: dto.pattern || 'all',
      timestamp: new Date().toISOString()
    };
  }
}