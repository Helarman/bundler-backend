import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { Cache } from 'cache-manager';
import { RaydiumMainInfo } from './interfaces/main-info.interface';
import { RaydiumApiResponse } from './interfaces/raydium-api.interface';
import { RaydiumMintInfo } from './interfaces/mint-info.interface';
import { RaydiumPriceData } from './interfaces/price-data.interface';
import { RaydiumPoolInfo } from './interfaces/pool-info.interface';
import { RaydiumLiquidityHistory } from './interfaces/liquidity-history.interface';
import { RaydiumMintList } from './interfaces/mint-list.interface';
import { RaydiumTokenAnalysis } from './interfaces/token-analysis.interface';

@Injectable()
export class RaydiumService {
  private readonly logger = new Logger(RaydiumService.name);
  private baseURL = 'https://api-v3.raydium.io';

  constructor(
    private readonly httpService: HttpService,
    private readonly cacheManager: Cache
  ) {
    this.logger.log('Raydium Service initialized', { baseURL: this.baseURL });
  }

  async getMainInfo(): Promise<RaydiumMainInfo> {
    const cacheKey = 'main_info';
    const cached = await this.cacheManager.get<RaydiumMainInfo>(cacheKey);
    if (cached) return cached;

    try {
      const response = await firstValueFrom(
        this.httpService.get<RaydiumApiResponse<RaydiumMainInfo>>(`${this.baseURL}/main/info`)
      );
      
      if (!response.data.success) {
        throw new Error(response.data.msg || 'Failed to get main info');
      }

      const data = response.data.data!;
      await this.cacheManager.set(cacheKey, data, 5 * 60 * 1000); // 5 minutes
      
      this.logger.log('Retrieved Raydium main info', {
        tvl: data.tvl,
        volume24: data.volume24
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to get Raydium main info:', error);
      throw error;
    }
  }

  async getMintInfo(mintAddresses: string[]): Promise<RaydiumMintInfo[]> {
    const cacheKey = `mint_info_${mintAddresses.join('_')}`;
    const cached = await this.cacheManager.get<RaydiumMintInfo[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await firstValueFrom(
        this.httpService.get<RaydiumApiResponse<RaydiumMintInfo[]>>(`${this.baseURL}/mint/ids`, {
          params: { mints: mintAddresses.join(',') }
        })
      );

      if (!response.data.success) {
        throw new Error(response.data.msg || 'Failed to get mint info');
      }

      const data = response.data.data!;
      await this.cacheManager.set(cacheKey, data, 10 * 60 * 1000); // 10 minutes

      this.logger.log('Retrieved Raydium mint info', {
        count: data.length,
        mints: mintAddresses.slice(0, 3)
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to get Raydium mint info:', error);
      throw error;
    }
  }

  async getTokenPrices(mintAddresses: string[]): Promise<RaydiumPriceData> {
    const cacheKey = `prices_${mintAddresses.join('_')}`;
    const cached = await this.cacheManager.get<RaydiumPriceData>(cacheKey);
    if (cached) return cached;

    try {
      const response = await firstValueFrom(
        this.httpService.get<RaydiumApiResponse<RaydiumPriceData>>(`${this.baseURL}/mint/price`, {
          params: { mints: mintAddresses.join(',') }
        })
      );

      if (!response.data.success) {
        throw new Error(response.data.msg || 'Failed to get token prices');
      }

      const data = response.data.data!;
      await this.cacheManager.set(cacheKey, data, 30 * 1000); // 30 seconds for prices

      this.logger.log('Retrieved Raydium token prices', {
        count: Object.keys(data).length,
        mints: mintAddresses.slice(0, 3)
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to get Raydium token prices:', error);
      throw error;
    }
  }

  async getPoolsByMint(
    mint1: string,
    mint2?: string,
    poolType: 'all' | 'concentrated' | 'standard' = 'all',
    pageSize: number = 100
  ): Promise<RaydiumPoolInfo[]> {
    const cacheKey = `pools_${mint1}_${mint2 || 'none'}_${poolType}`;
    const cached = await this.cacheManager.get<RaydiumPoolInfo[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await firstValueFrom(
        this.httpService.get<RaydiumApiResponse<RaydiumPoolInfo[]>>(`${this.baseURL}/pools/info/mint`, {
          params: {
            mint1,
            mint2,
            poolType,
            poolSortField: 'liquidity',
            sortType: 'desc',
            pageSize,
            page: 1
          }
        })
      );

      if (!response.data.success) {
        throw new Error(response.data.msg || 'Failed to get pools info');
      }

      const data = response.data.data!;
      await this.cacheManager.set(cacheKey, data, 2 * 60 * 1000); // 2 minutes

      this.logger.log('Retrieved Raydium pools info', {
        count: data.length,
        mint1,
        mint2,
        poolType
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to get Raydium pools info:', error);
      throw error;
    }
  }

  async getPoolsInfo(poolIds: string[]): Promise<RaydiumPoolInfo[]> {
    const cacheKey = `pools_info_${poolIds.join('_')}`;
    const cached = await this.cacheManager.get<RaydiumPoolInfo[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await firstValueFrom(
        this.httpService.get<RaydiumApiResponse<RaydiumPoolInfo[]>>(`${this.baseURL}/pools/info/ids`, {
          params: { ids: poolIds.join(',') }
        })
      );

      if (!response.data.success) {
        throw new Error(response.data.msg || 'Failed to get pools info');
      }

      const data = response.data.data!;
      await this.cacheManager.set(cacheKey, data, 2 * 60 * 1000); // 2 minutes

      this.logger.log('Retrieved Raydium pools info by IDs', {
        count: data.length,
        poolIds: poolIds.slice(0, 3)
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to get Raydium pools info by IDs:', error);
      throw error;
    }
  }

  async getPoolKeys(poolIds: string[]): Promise<any[]> {
    const cacheKey = `pool_keys_${poolIds.join('_')}`;
    const cached = await this.cacheManager.get<any[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await firstValueFrom(
        this.httpService.get<RaydiumApiResponse<any[]>>(`${this.baseURL}/pools/key/ids`, {
          params: { ids: poolIds.join(',') }
        })
      );

      if (!response.data.success) {
        throw new Error(response.data.msg || 'Failed to get pool keys');
      }

      const data = response.data.data!;
      await this.cacheManager.set(cacheKey, data, 10 * 60 * 1000); // 10 minutes

      this.logger.log('Retrieved Raydium pool keys', {
        count: data.length,
        poolIds: poolIds.slice(0, 3)
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to get Raydium pool keys:', error);
      throw error;
    }
  }

  async getPoolLiquidityHistory(poolId: string): Promise<RaydiumLiquidityHistory> {
    const cacheKey = `liquidity_history_${poolId}`;
    const cached = await this.cacheManager.get<RaydiumLiquidityHistory>(cacheKey);
    if (cached) return cached;

    try {
      const response = await firstValueFrom(
        this.httpService.get<RaydiumApiResponse<RaydiumLiquidityHistory>>(`${this.baseURL}/pools/line/liquidity`, {
          params: { id: poolId }
        })
      );

      if (!response.data.success) {
        throw new Error(response.data.msg || 'Failed to get liquidity history');
      }

      const data = response.data.data!;
      await this.cacheManager.set(cacheKey, data, 5 * 60 * 1000); // 5 minutes

      this.logger.log('Retrieved Raydium liquidity history', {
        poolId,
        count: data.count
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to get Raydium liquidity history:', error);
      throw error;
    }
  }

  async getDefaultMintList(): Promise<RaydiumMintList> {
    const cacheKey = 'default_mint_list';
    const cached = await this.cacheManager.get<RaydiumMintList>(cacheKey);
    if (cached) return cached;

    try {
      const response = await firstValueFrom(
        this.httpService.get<RaydiumApiResponse<RaydiumMintList>>(`${this.baseURL}/mint/list`)
      );

      if (!response.data.success) {
        throw new Error(response.data.msg || 'Failed to get mint list');
      }

      const data = response.data.data!;
      await this.cacheManager.set(cacheKey, data, 60 * 60 * 1000); // 1 hour

      this.logger.log('Retrieved Raydium default mint list', {
        mintCount: data.mintList.length,
        blockListCount: data.blockList.length
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to get Raydium mint list:', error);
      throw error;
    }
  }

  async findBestPool(mintA: string, mintB: string): Promise<RaydiumPoolInfo | null> {
    try {
      const pools = await this.getPoolsByMint(mintA, mintB, 'all');
      
      if (pools.length === 0) {
        return null;
      }

      pools.sort((a, b) => b.liquidity - a.liquidity);
      
      const bestPool = pools[0];
      
      this.logger.log('Found best Raydium pool', {
        poolId: bestPool.id,
        liquidity: bestPool.liquidity,
        volume24h: bestPool.volume24h,
        type: bestPool.type
      });

      return bestPool;
    } catch (error) {
      this.logger.error('Failed to find best Raydium pool:', error);
      return null;
    }
  }

 async getTokenAnalysis(mintAddress: string): Promise<RaydiumTokenAnalysis> {
  try {
    const [mintInfos, prices, pools] = await Promise.all([
      this.getMintInfo([mintAddress]).catch(() => []),
      this.getTokenPrices([mintAddress]).catch(() => ({} as RaydiumPriceData)),
      this.getPoolsByMint(mintAddress).catch(() => [])
    ]);

    const mintInfo = mintInfos.length > 0 ? mintInfos[0] : null;
    const price = prices[mintAddress] || null;
    
    if (pools.some(pool => typeof pool.liquidity !== 'number' || typeof pool.volume24h !== 'number')) {
    this.logger.warn('Invalid pool data structure', { mintAddress });
    }

    const validPools = pools.filter(pool => 
    typeof pool.liquidity === 'number' && 
    typeof pool.volume24h === 'number'
    );

    const totalLiquidity = validPools.reduce((sum: number, pool: RaydiumPoolInfo) => sum + pool.liquidity, 0);
    const totalVolume24h = validPools.reduce((sum: number, pool: RaydiumPoolInfo) => sum + pool.volume24h, 0);

    this.logger.log('Retrieved Raydium token analysis', {
      mintAddress,
      hasInfo: !!mintInfo,
      hasPrice: !!price,
      poolCount: pools.length,
      totalLiquidity,
      totalVolume24h
    });

    return {
      mintInfo,
      price,
      pools,
      totalLiquidity,
      totalVolume24h
    };
  } catch (error) {
    this.logger.error('Failed to get Raydium token analysis:', error);
    throw error;
  }
}

  async clearCache(pattern?: string): Promise<void> {
  try {
    if (typeof (this.cacheManager.stores as any)?.keys === 'function') {
      if (pattern) {
        const keys = await (this.cacheManager.stores as any).keys(`${pattern}*`);
        await Promise.all(keys.map((key: string) => this.cacheManager.del(key)));
      } else {
        // Полная очистка кэша
        const keys = await (this.cacheManager.stores as any).keys('*');
        await Promise.all(keys.map((key: string) => this.cacheManager.del(key)));
      }
    } 
    else {
      this.logger.warn('Cache store does not support keys pattern matching - using fallback');
      
      const knownKeys = [
        'main_info',
        'default_mint_list',
      ];
      
      if (pattern) {
        const filteredKeys = knownKeys.filter(key => key.includes(pattern));
        await Promise.all(filteredKeys.map(key => this.cacheManager.del(key)));
      } else {
        await Promise.all(knownKeys.map(key => this.cacheManager.del(key)));
      }
    }
    
    this.logger.log('Cache cleared successfully', { pattern });
  } catch (error) {
    this.logger.error('Failed to clear cache:', error);
    throw error;
  }
}
}