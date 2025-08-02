import { Injectable, OnModuleInit } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { 
  Raydium, 
  TxVersion, 
  TokenAmount,
  Token,
  Router,
  toFeeConfig,
  toApiV3Token,
  USDCMint,
  RAYMint,
  CurveCalculator,
  PoolUtils,
  ComputeClmmPoolInfo,
  ReturnTypeFetchMultiplePoolTickArrays,
  ApiV3PoolInfoStandardItemCpmm,
  ApiV3PoolInfoConcentratedItem,
  CpmmKeys,
  CpmmRpcData,
  ClmmKeys,
  DEVNET_PROGRAM_ID,
  CREATE_CPMM_POOL_PROGRAM,
  CREATE_CPMM_POOL_FEE_ACC,
  CLMM_PROGRAM_ID,
  AMM_V4,
  OPEN_BOOK_PROGRAM,
  FEE_DESTINATION_ID,
  getCpmmPdaAmmConfigId,
  MARKET_STATE_LAYOUT_V3
} from '@raydium-io/raydium-sdk-v2';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, NATIVE_MINT } from '@solana/spl-token';
import { BN } from 'bn.js';
import Decimal from 'decimal.js';
import { SwapParamsDto } from './dto/swap-params.dto';
import { SwapResultDto } from './dto/swap-result.dto';
import { PoolInfoDto } from './dto/pool-info.dto';
import { CreateCpmmPoolDto } from './dto/create-cpmm-pool.dto';
import { CreateClmmPoolDto } from './dto/create-clmm-pool.dto';
import { CreateAmmPoolDto } from './dto/create-amm-pool.dto';
import { CreatePoolResult, FeeConfig } from './interfaces/raydium-sdk.interface';

@Injectable()
export class RaydiumSdkService implements OnModuleInit {
  private readonly logger = new Logger(RaydiumSdkService.name);
  private raydium: Raydium | null = null;
  private connection: Connection;
  private cluster: 'mainnet' | 'devnet';
  private poolDataCache: any = null;
  private cacheExpiry: Date | null = null;

  constructor() {
    this.connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
      'confirmed'
    );
    this.cluster = process.env.NODE_ENV === 'development' ? 'devnet' : 'mainnet';
    this.logger.log(`Raydium SDK Service initialized - Cluster: ${this.cluster}, RPC: ${this.connection.rpcEndpoint}`);
  }

  async onModuleInit() {
    // Initialize with dummy keypair for pool data fetching
    const dummyKeypair = Keypair.generate();
    await this.initSDK(dummyKeypair);
  }

  private async initSDK(owner: Keypair): Promise<Raydium> {
    if (this.raydium) return this.raydium;

    try {
      this.logger.log('Initializing Raydium SDK...');
      
      this.raydium = await Raydium.load({
        owner,
        connection: this.connection,
        cluster: this.cluster,
        disableFeatureCheck: true,
        disableLoadToken: false,
        blockhashCommitment: 'finalized'
      });

      await this.raydium.fetchChainTime();
      
      this.logger.log('Raydium SDK initialized successfully');
      return this.raydium;
    } catch (error) {
      this.logger.error('Failed to initialize Raydium SDK', error);
      throw error;
    }
  }

  private async getPoolData() {
    if (this.poolDataCache && this.cacheExpiry && new Date() < this.cacheExpiry) {
      return this.poolDataCache;
    }

    if (!this.raydium) {
      throw new Error('Raydium SDK not initialized');
    }

    try {
      this.logger.log('Fetching pool data...');
      
      const poolData = await this.raydium.tradeV2.fetchRoutePoolBasicInfo();
      
      this.poolDataCache = poolData;
      this.cacheExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes cache
      
      this.logger.log(`Pool data fetched - AMM: ${poolData.ammPools.length}, CLMM: ${poolData.clmmPools.length}, CPMM: ${poolData.cpmmPools.length}`);

      return poolData;
    } catch (error) {
      this.logger.error('Failed to fetch pool data', error);
      throw error;
    }
  }

  public async routeSwap(params: SwapParamsDto): Promise<SwapResultDto> {
    try {
      const owner = Keypair.fromSecretKey(Buffer.from(params.walletPrivateKey, 'base64'));
      const raydium = await this.initSDK(owner);
      
      this.logger.log(`Route swap request - Input: ${params.inputMint}, Output: ${params.outputMint}, Amount: ${params.inputAmount}`);

      const inputMint = new PublicKey(params.inputMint);
      const outputMint = new PublicKey(params.outputMint);
      const poolData = await this.getPoolData();

      const routes = raydium.tradeV2.getAllRoute({
        inputMint,
        outputMint,
        ...poolData,
      });

      if (routes.directPath.length === 0 && Object.keys(routes.routePathDict).length === 0) {
        throw new Error('No swap routes found for this token pair');
      }

      const {
        routePathDict,
        mintInfos,
        ammPoolsRpcInfo,
        ammSimulateCache,
        clmmPoolsRpcInfo,
        computeClmmPoolInfo,
        computePoolTickData,
        computeCpmmData,
      } = await raydium.tradeV2.fetchSwapRoutesData({
        routes,
        inputMint,
        outputMint,
      });

      const swapRoutes = raydium.tradeV2.getAllRouteComputeAmountOut({
        inputTokenAmount: new TokenAmount(
          new Token({
            mint: params.inputMint,
            decimals: mintInfos[params.inputMint].decimals,
            isToken2022: mintInfos[params.inputMint].programId.equals(TOKEN_2022_PROGRAM_ID),
          }),
          params.inputAmount
        ),
        directPath: routes.directPath.map(
          p => ammSimulateCache[p.id.toBase58()] || 
          computeClmmPoolInfo[p.id.toBase58()] || 
          computeCpmmData[p.id.toBase58()]
        ),
        routePathDict,
        simulateCache: ammSimulateCache,
        tickCache: computePoolTickData,
        mintInfos: mintInfos,
        outputToken: toApiV3Token({
          ...mintInfos[params.outputMint],
          programId: mintInfos[params.outputMint].programId.toBase58(),
          address: params.outputMint,
          freezeAuthority: undefined,
          mintAuthority: undefined,
          extensions: {
            feeConfig: toFeeConfig(mintInfos[params.outputMint].feeConfig),
          },
        }),
        chainTime: Math.floor(raydium.chainTimeData?.chainTime ?? Date.now() / 1000),
        slippage: params.slippage,
        epochInfo: await raydium.connection.getEpochInfo(),
      });

      const targetRoute = swapRoutes[0];
      if (!targetRoute) {
        throw new Error('No profitable swap routes found');
      }

      this.logger.log(`Best route found - Input: ${targetRoute.amountIn.amount.toExact()}, Output: ${targetRoute.amountOut.amount.toExact()}`);

      const poolKeys = await raydium.tradeV2.computePoolToPoolKeys({
        pools: targetRoute.poolInfoList,
        ammRpcData: ammPoolsRpcInfo,
        clmmRpcData: clmmPoolsRpcInfo,
      });

      const { execute } = await raydium.tradeV2.swap({
        routeProgram: Router,
        txVersion: TxVersion.V0,
        swapInfo: targetRoute,
        swapPoolKeys: poolKeys,
        ownerInfo: {
          associatedOnly: true,
          checkCreateATAOwner: true,
        },
        computeBudgetConfig: {
          units: 600000,
          microLamports: 465915,
        },
      });

      const { txIds } = await execute({ sequentially: true });
      
      const result: SwapResultDto = {
        txId: txIds[0],
        inputAmount: targetRoute.amountIn.amount.toExact(),
        outputAmount: targetRoute.amountOut.amount.toExact(),
        minOutputAmount: targetRoute.minAmountOut.amount.toExact(),
        route: targetRoute.poolInfoList.map(p => typeof p.id === 'string' ? p.id : p.id.toBase58())
      };

      this.logger.log('Route swap completed');
      return result;

    } catch (error) {
      this.logger.error('Route swap failed', error);
      throw error;
    }
  }

  public async cpmmSwap(params: SwapParamsDto & { poolId: string }): Promise<SwapResultDto> {
    try {
      const owner = Keypair.fromSecretKey(Buffer.from(params.walletPrivateKey, 'base64'));
      const raydium = await this.initSDK(owner);
      
      this.logger.log(`CPMM swap request - Pool: ${params.poolId}, Input: ${params.inputMint}, Amount: ${params.inputAmount}`);

      let poolInfo: ApiV3PoolInfoStandardItemCpmm;
      let poolKeys: CpmmKeys | undefined;
      let rpcData: CpmmRpcData;

      if (this.cluster === 'mainnet') {
        const data = await raydium.api.fetchPoolById({ ids: params.poolId });
        poolInfo = data[0] as ApiV3PoolInfoStandardItemCpmm;
        rpcData = await raydium.cpmm.getRpcPoolInfo(poolInfo.id, true);
      } else {
        const data = await raydium.cpmm.getPoolInfoFromRpc(params.poolId);
        poolInfo = data.poolInfo;
        poolKeys = data.poolKeys;
        rpcData = data.rpcData;
      }

      const inputAmount = new BN(params.inputAmount);
      const baseIn = params.inputMint === poolInfo.mintA.address;

      const swapResult = CurveCalculator.swap(
        inputAmount,
        baseIn ? rpcData.baseReserve : rpcData.quoteReserve,
        baseIn ? rpcData.quoteReserve : rpcData.baseReserve,
        rpcData.configInfo!.tradeFeeRate
      );

      const { execute } = await raydium.cpmm.swap({
        poolInfo,
        poolKeys,
        inputAmount,
        swapResult,
        slippage: params.slippage,
        baseIn,
        computeBudgetConfig: {
          units: 600000,
          microLamports: 465915,
        },
      });

      const { txId } = await execute({ sendAndConfirm: true });

      const result: SwapResultDto = {
        txId,
        inputAmount: swapResult.sourceAmountSwapped.toString(),
        outputAmount: swapResult.destinationAmountSwapped.toString(),
        minOutputAmount: swapResult.destinationAmountSwapped.toString(),
        route: [params.poolId]
      };

      this.logger.log('CPMM swap completed');
      return result;

    } catch (error) {
      this.logger.error('CPMM swap failed', error);
      throw error;
    }
  }

  public async clmmSwap(params: SwapParamsDto & { poolId: string }): Promise<SwapResultDto> {
    try {
      const owner = Keypair.fromSecretKey(Buffer.from(params.walletPrivateKey, 'base64'));
      const raydium = await this.initSDK(owner);
      
      this.logger.log(`CLMM swap request - Pool: ${params.poolId}, Input: ${params.inputMint}, Amount: ${params.inputAmount}`);

      let poolInfo: ApiV3PoolInfoConcentratedItem;
      let poolKeys: ClmmKeys | undefined;
      let clmmPoolInfo: ComputeClmmPoolInfo;
      let tickCache: ReturnTypeFetchMultiplePoolTickArrays;

      if (this.cluster === 'mainnet') {
        const data = await raydium.api.fetchPoolById({ ids: params.poolId });
        poolInfo = data[0] as ApiV3PoolInfoConcentratedItem;

        clmmPoolInfo = await PoolUtils.fetchComputeClmmInfo({
          connection: raydium.connection,
          poolInfo,
        });
        
        tickCache = await PoolUtils.fetchMultiplePoolTickArrays({
          connection: raydium.connection,
          poolKeys: [clmmPoolInfo],
        });
      } else {
        const data = await raydium.clmm.getPoolInfoFromRpc(params.poolId);
        poolInfo = data.poolInfo;
        poolKeys = data.poolKeys;
        clmmPoolInfo = data.computePoolInfo;
        tickCache = data.tickData;
      }

      const inputAmount = new BN(params.inputAmount);
      const baseIn = params.inputMint === poolInfo.mintA.address;

      const { minAmountOut, remainingAccounts } = await PoolUtils.computeAmountOutFormat({
        poolInfo: clmmPoolInfo,
        tickArrayCache: tickCache[params.poolId],
        amountIn: inputAmount,
        tokenOut: poolInfo[baseIn ? 'mintB' : 'mintA'],
        slippage: params.slippage,
        epochInfo: await raydium.fetchEpochInfo(),
      });

      const { execute } = await raydium.clmm.swap({
        poolInfo,
        poolKeys,
        inputMint: poolInfo[baseIn ? 'mintA' : 'mintB'].address,
        amountIn: inputAmount,
        amountOutMin: minAmountOut.amount.raw,
        observationId: clmmPoolInfo.observationId,
        ownerInfo: {
          useSOLBalance: true,
        },
        remainingAccounts,
        txVersion: TxVersion.V0,
        computeBudgetConfig: {
          units: 600000,
          microLamports: 465915,
        },
      });

      const { txId } = await execute();

      const result: SwapResultDto = {
        txId,
        inputAmount: inputAmount.toString(),
        outputAmount: minAmountOut.amount.toExact(),
        minOutputAmount: minAmountOut.amount.toExact(),
        route: [params.poolId]
      };

      this.logger.log('CLMM swap completed');
      return result;

    } catch (error) {
      this.logger.error('CLMM swap failed', error);
      throw error;
    }
  }

  public async getPoolsForPair(mintA: string, mintB: string): Promise<PoolInfoDto[]> {
    try {
      const poolData = await this.getPoolData();
      const pools: PoolInfoDto[] = [];

      // Check CPMM pools
      for (const pool of poolData.cpmmPools) {
        if (
          (pool.mintA.address === mintA && pool.mintB.address === mintB) ||
          (pool.mintA.address === mintB && pool.mintB.address === mintA)
        ) {
          pools.push({
            id: pool.id,
            type: 'CPMM',
            mintA: pool.mintA.address,
            mintB: pool.mintB.address,
            liquidity: pool.tvl?.toString() || '0',
            price: pool.price || 0
          });
        }
      }

      // Check CLMM pools
      for (const pool of poolData.clmmPools) {
        if (
          (pool.mintA.address === mintA && pool.mintB.address === mintB) ||
          (pool.mintA.address === mintB && pool.mintB.address === mintA)
        ) {
          pools.push({
            id: pool.id,
            type: 'CLMM',
            mintA: pool.mintA.address,
            mintB: pool.mintB.address,
            liquidity: pool.tvl?.toString() || '0',
            price: pool.price || 0
          });
        }
      }

      // Check AMM pools
      for (const pool of poolData.ammPools) {
        if (
          (pool.mintA.address === mintA && pool.mintB.address === mintB) ||
          (pool.mintA.address === mintB && pool.mintB.address === mintA)
        ) {
          pools.push({
            id: pool.id,
            type: 'AMM',
            mintA: pool.mintA.address,
            mintB: pool.mintB.address,
            liquidity: pool.tvl?.toString() || '0',
            price: pool.price || 0
          });
        }
      }

      this.logger.log(`Found ${pools.length} pools for pair ${mintA}/${mintB}`);
      return pools;
    } catch (error) {
      this.logger.error('Failed to get pools for pair', error);
      throw error;
    }
  }

  public clearCache(): void {
    this.poolDataCache = null;
    this.cacheExpiry = null;
    this.raydium = null;
    this.logger.log('Raydium SDK cache cleared');
  }

  public async createCpmmPool(params: CreateCpmmPoolDto): Promise<CreatePoolResult> {
    try {
      const owner = Keypair.fromSecretKey(Buffer.from(params.walletPrivateKey, 'base64'));
      const raydium = await this.initSDK(owner);

      this.logger.log(`Creating CPMM pool - Mints: ${params.mintA}/${params.mintB}, Amounts: ${params.mintAAmount}/${params.mintBAmount}`);

      const mintA = await raydium.token.getTokenInfo(params.mintA);
      const mintB = await raydium.token.getTokenInfo(params.mintB);

      const feeConfigs = await raydium.api.getCpmmConfigs();
      
      if (this.cluster === 'devnet') {
        feeConfigs.forEach((config) => {
          config.id = getCpmmPdaAmmConfigId(DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM, config.index).publicKey.toBase58();
        });
      }

      const selectedFeeConfig = feeConfigs[params.feeConfigIndex || 0];
      if (!selectedFeeConfig) {
        throw new Error('Invalid fee config index');
      }

      const { execute, extInfo } = await raydium.cpmm.createPool({
        programId: this.cluster === 'devnet' ? DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM : CREATE_CPMM_POOL_PROGRAM,
        poolFeeAccount: this.cluster === 'devnet' ? DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_FEE_ACC : CREATE_CPMM_POOL_FEE_ACC,
        mintA,
        mintB,
        mintAAmount: new BN(params.mintAAmount),
        mintBAmount: new BN(params.mintBAmount),
        startTime: new BN(params.startTime || 0),
        feeConfig: selectedFeeConfig,
        associatedOnly: false,
        ownerInfo: {
          useSOLBalance: true,
        },
        txVersion: TxVersion.V0,
        computeBudgetConfig: {
          units: 600000,
          microLamports: 46591500,
        },
      });

      const { txId } = await execute({ sendAndConfirm: true });

      const poolKeys = Object.keys(extInfo.address).reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: extInfo.address[cur as keyof typeof extInfo.address].toString(),
        }),
        {} as Record<string, string>
      );

      const result: CreatePoolResult = {
        txId,
        poolId: (poolKeys as any).id || '',
        poolKeys
      };

      this.logger.log('CPMM pool created successfully');
      return result;

    } catch (error) {
      this.logger.error('Failed to create CPMM pool', error);
      throw error;
    }
  }

  public async createClmmPool(params: CreateClmmPoolDto): Promise<CreatePoolResult> {
    try {
      const owner = Keypair.fromSecretKey(Buffer.from(params.walletPrivateKey, 'base64'));
      const raydium = await this.initSDK(owner);

      this.logger.log(`Creating CLMM pool - Mints: ${params.mintA}/${params.mintB}, Initial price: ${params.initialPrice}`);

      const mint1 = await raydium.token.getTokenInfo(params.mintA);
      const mint2 = await raydium.token.getTokenInfo(params.mintB);

      const clmmConfigs = await raydium.api.getClmmConfigs();
      const selectedConfig = clmmConfigs[params.configIndex || 0];
      
      if (!selectedConfig) {
        throw new Error('Invalid config index');
      }

      const { execute, extInfo } = await raydium.clmm.createPool({
        programId: this.cluster === 'devnet' ? DEVNET_PROGRAM_ID.CLMM_PROGRAM_ID : CLMM_PROGRAM_ID,
        mint1,
        mint2,
        ammConfig: { 
          ...selectedConfig, 
          id: new PublicKey(selectedConfig.id), 
          fundOwner: '', 
          description: '' 
        },
        initialPrice: new Decimal(params.initialPrice),
        txVersion: TxVersion.V0,
        computeBudgetConfig: {
          units: 600000,
          microLamports: 46591500,
        },
      });

      const { txId } = await execute({ sendAndConfirm: true });

      const poolKeys = extInfo?.address ? Object.keys(extInfo.address).reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: extInfo.address![cur as keyof typeof extInfo.address]?.toString() || '',
        }),
        {} as Record<string, string>
      ) : {};

      const result: CreatePoolResult = {
        txId,
        poolId: (poolKeys as any).id || '',
        poolKeys
      };

      this.logger.log('CLMM pool created successfully');
      return result;

    } catch (error) {
      this.logger.error('Failed to create CLMM pool', error);
      throw error;
    }
  }

  public async createAmmPool(params: CreateAmmPoolDto): Promise<CreatePoolResult> {
    try {
      const owner = Keypair.fromSecretKey(Buffer.from(params.walletPrivateKey, 'base64'));
      const raydium = await this.initSDK(owner);

      this.logger.log(`Creating AMM pool - Market: ${params.marketId}, Amounts: ${params.mintAAmount}/${params.mintBAmount}`);

      const marketId = new PublicKey(params.marketId);
      const marketBufferInfo = await raydium.connection.getAccountInfo(marketId);
      if (!marketBufferInfo) {
        throw new Error('Market not found');
      }

      const { baseMint, quoteMint } = MARKET_STATE_LAYOUT_V3.decode(marketBufferInfo.data);
      const baseMintInfo = await raydium.token.getTokenInfo(baseMint);
      const quoteMintInfo = await raydium.token.getTokenInfo(quoteMint);

      if (
        baseMintInfo.programId !== TOKEN_PROGRAM_ID.toBase58() ||
        quoteMintInfo.programId !== TOKEN_PROGRAM_ID.toBase58()
      ) {
        throw new Error(
          'AMM pools with OpenBook market only support TOKEN_PROGRAM_ID mints. For Token2022, use CPMM pool instead.'
        );
      }

      const baseAmount = new BN(params.mintAAmount);
      const quoteAmount = new BN(params.mintBAmount);

      if (baseAmount.mul(quoteAmount).lte(new BN(1).mul(new BN(10 ** baseMintInfo.decimals)).pow(new BN(2)))) {
        throw new Error('Initial liquidity too low, try adding more baseAmount/quoteAmount');
      }

      const { execute, extInfo } = await raydium.liquidity.createPoolV4({
        programId: this.cluster === 'devnet' ? DEVNET_PROGRAM_ID.AMM_V4 : AMM_V4,
        marketInfo: {
          marketId,
          programId: this.cluster === 'devnet' ? DEVNET_PROGRAM_ID.OPEN_BOOK_PROGRAM : OPEN_BOOK_PROGRAM,
        },
        baseMintInfo: {
          mint: baseMint,
          decimals: baseMintInfo.decimals,
        },
        quoteMintInfo: {
          mint: quoteMint,
          decimals: quoteMintInfo.decimals,
        },
        baseAmount,
        quoteAmount,
        startTime: new BN(params.startTime || 0),
        ownerInfo: {
          useSOLBalance: true,
        },
        associatedOnly: false,
        txVersion: TxVersion.V0,
        feeDestinationId: this.cluster === 'devnet' ? DEVNET_PROGRAM_ID.FEE_DESTINATION_ID : FEE_DESTINATION_ID,
        computeBudgetConfig: {
          units: 600000,
          microLamports: 4659150,
        },
      });

      const { txId } = await execute({ sendAndConfirm: true });

      const poolKeys = Object.keys(extInfo.address).reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: extInfo.address[cur as keyof typeof extInfo.address].toBase58(),
        }),
        {} as Record<string, string>
      );

      const result: CreatePoolResult = {
        txId,
        poolId: (poolKeys as any).id || '',
        poolKeys
      };

      this.logger.log('AMM pool created successfully');
      return result;

    } catch (error) {
      this.logger.error('Failed to create AMM pool', error);
      throw error;
    }
  }

  public async getCpmmFeeConfigs(): Promise<FeeConfig[]> {
    try {
      const feeConfigs = await this.raydium!.api.getCpmmConfigs();
      
      if (this.cluster === 'devnet') {
        feeConfigs.forEach((config) => {
          config.id = getCpmmPdaAmmConfigId(DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM, config.index).publicKey.toBase58();
        });
      }

      return feeConfigs;
    } catch (error) {
      this.logger.error('Failed to get CPMM fee configs', error);
      throw error;
    }
  }

  public async getClmmConfigs(): Promise<any[]> {
    try {
      const clmmConfigs = await this.raydium!.api.getClmmConfigs();
      return clmmConfigs;
    } catch (error) {
      this.logger.error('Failed to get CLMM configs', error);
      throw error;
    }
  }
}