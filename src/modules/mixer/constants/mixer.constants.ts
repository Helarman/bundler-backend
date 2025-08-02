export const MIXER_ERRORS = {
  INVALID_CONFIG: 'INVALID_CONFIG',
  MIXING_ERROR: 'MIXING_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
};

export const DEFAULT_MIXER_CONFIG = {
  minAmount: 0.001,
  maxAmount: 0.1,
  minDelay: 1000,
  maxDelay: 5000,
  mixingRounds: 3,
  useRandomAmounts: true,
  enableTimingVariation: true
};