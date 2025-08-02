import { Injectable, Logger } from '@nestjs/common';
import { Keypair, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as bs58 from 'bs58';
import { MixerWallet, MixerConfig, MixerResult, MixerStep, MixerStats } from './interfaces/mixer.interface';

@Injectable()
export class MixerService {
  private readonly logger = new Logger(MixerService.name);
  private dumpWallets: MixerWallet[] = [];
  private readonly defaultConfig: MixerConfig = {
    minAmount: 0.001,
    maxAmount: 0.1,
    minDelay: 1000,
    maxDelay: 5000,
    mixingRounds: 3,
    useRandomAmounts: true,
    enableTimingVariation: true
  };

  constructor() {
    this.initializeDumpWallets();
    this.logger.log(`SOL Mixer Service initialized with ${this.dumpWallets.length} dump wallets`);
  }

  private initializeDumpWallets(): void {
    for (let i = 1; i <= 20; i++) {
      const privateKey = process.env[`MIXER_DUMP_WALLET_${i}`];
      if (privateKey) {
        try {
          Keypair.fromSecretKey(bs58.decode(privateKey));
          this.dumpWallets.push({ privateKey });
        } catch (error) {
          this.logger.warn(`Invalid mixer dump wallet ${i}`);
        }
      }
    }

    if (this.dumpWallets.length === 0) {
      this.logger.warn('No mixer dump wallets configured, generating temporary ones');
      for (let i = 0; i < 10; i++) {
        const keypair = Keypair.generate();
        this.dumpWallets.push({ 
          privateKey: bs58.encode(keypair.secretKey) 
        });
      }
    }
  }

  private generateRandomAmount(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private generateRandomDelay(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }

  private selectRandomDumpWallets(count: number): MixerWallet[] {
    const shuffled = [...this.dumpWallets].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  private createMixingPath(
    sender: MixerWallet,
    recipient: MixerWallet,
    config: MixerConfig
  ): MixerStep[] {
    const steps: MixerStep[] = [];
    const intermediaryWallets = this.selectRandomDumpWallets(config.mixingRounds);
    
    let currentFrom = sender.privateKey;
    const totalAmount = parseFloat(sender.amount || '0');
    
    const amounts: number[] = [];
    let remainingAmount = totalAmount;
    
    for (let i = 0; i < config.mixingRounds; i++) {
      if (i === config.mixingRounds - 1) {
        amounts.push(remainingAmount);
      } else {
        const chunkSize = config.useRandomAmounts 
          ? this.generateRandomAmount(
              Math.min(config.minAmount, remainingAmount * 0.1),
              Math.min(config.maxAmount, remainingAmount * 0.8)
            )
          : remainingAmount / config.mixingRounds;
        amounts.push(chunkSize);
        remainingAmount -= chunkSize;
      }
    }

    for (let round = 0; round < config.mixingRounds; round++) {
      const isLastRound = round === config.mixingRounds - 1;
      const targetWallet = isLastRound 
        ? recipient.privateKey 
        : intermediaryWallets[round]?.privateKey;

      if (!targetWallet) continue;

      const delay = config.enableTimingVariation
        ? this.generateRandomDelay(config.minDelay, config.maxDelay)
        : config.minDelay;

      steps.push({
        from: currentFrom,
        to: targetWallet,
        amount: amounts[round],
        delay,
        round: round + 1
      });

      currentFrom = targetWallet;
    }

    return steps;
  }

  async mixSOLSingle(
    sender: MixerWallet,
    recipient: MixerWallet,
    config?: Partial<MixerConfig>
  ): Promise<MixerResult> {
    const mixerConfig = { ...this.defaultConfig, ...config };
    
    try {
      this.logger.log(`Starting single SOL mix operation for ${sender.privateKey.slice(0, 8)}...`);

      const steps = this.createMixingPath(sender, recipient, mixerConfig);
      
      if (steps.length === 0) {
        throw new Error('Failed to create mixing path');
      }

      let totalMixed = 0;
      for (const step of steps) {
        this.logger.debug(`Executing mixing step ${step.round}/${mixerConfig.mixingRounds}`);
        
        await this.simulateMixingStep(step);
        totalMixed += step.amount;

        if (step.round < mixerConfig.mixingRounds) {
          await new Promise(resolve => setTimeout(resolve, step.delay));
        }
      }

      this.logger.log(`SOL mix operation completed successfully. Total mixed: ${totalMixed}`);

      return {
        success: true,
        steps,
        totalMixed
      };

    } catch (error) {
      this.logger.error(`SOL mix operation failed`);
      return {
        success: false,
        steps: [],
        totalMixed: 0,
      };
    }
  }

  async mixSOLBatch(
    senderWallet: MixerWallet,
    recipientWallets: MixerWallet[],
    config?: Partial<MixerConfig>
  ): Promise<MixerResult[]> {
    const mixerConfig = { ...this.defaultConfig, ...config };
    
    this.logger.log(`Starting batch SOL mix operation for ${recipientWallets.length} recipients`);

    const results: MixerResult[] = [];
    const totalAmount = parseFloat(senderWallet.amount || '0');
    const amountPerRecipient = totalAmount / recipientWallets.length;

    for (let i = 0; i < recipientWallets.length; i++) {
      const recipient = recipientWallets[i];
      const senderForThisRound = {
        ...senderWallet,
        amount: amountPerRecipient.toString()
      };

      if (i > 0 && mixerConfig.enableTimingVariation) {
        const batchDelay = this.generateRandomDelay(2000, 8000);
        await new Promise(resolve => setTimeout(resolve, batchDelay));
      }

      const result = await this.mixSOLSingle(senderForThisRound, recipient, mixerConfig);
      results.push(result);
    }

    return results;
  }

  private async simulateMixingStep(step: MixerStep): Promise<void> {
    this.logger.debug(`Simulating mix step ${step.round}`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  validateMixerConfig(config: Partial<MixerConfig>): { valid: boolean; error?: string } {
    if (config.minAmount && config.maxAmount && config.minAmount >= config.maxAmount) {
      return { valid: false, error: 'minAmount must be less than maxAmount' };
    }

    if (config.mixingRounds && (config.mixingRounds < 1 || config.mixingRounds > 10)) {
      return { valid: false, error: 'mixingRounds must be between 1 and 10' };
    }

    if (config.minDelay && config.maxDelay && config.minDelay >= config.maxDelay) {
      return { valid: false, error: 'minDelay must be less than maxDelay' };
    }

    return { valid: true };
  }

  getMixerStats(): MixerStats {
    return {
      availableDumpWallets: this.dumpWallets.length,
      defaultConfig: this.defaultConfig,
      supportedFeatures: [
        'Single wallet mixing',
        'Batch wallet mixing',
        'Random amount distribution',
        'Timing variation',
        'Multi-round mixing',
        'Configurable parameters'
      ]
    };
  }
}