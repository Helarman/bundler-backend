export interface MixerWallet {
  privateKey: string;
  amount?: string;
}

export interface MixerStep {
  from: string;
  to: string;
  amount: number;
  delay: number;
  round: number;
}

export interface MixerResult {
  success: boolean;
  steps: MixerStep[];
  totalMixed: number;
  error?: string;
}

export interface MixerConfig {
  minAmount: number;
  maxAmount: number;
  minDelay: number;
  maxDelay: number;
  mixingRounds: number;
  useRandomAmounts: boolean;
  enableTimingVariation: boolean;
}

export interface MixerStats {
  availableDumpWallets: number;
  defaultConfig: MixerConfig;
  supportedFeatures: string[];
}