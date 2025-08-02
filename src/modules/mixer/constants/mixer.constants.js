"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MIXER_CONFIG = exports.MIXER_ERRORS = void 0;
exports.MIXER_ERRORS = {
    INVALID_CONFIG: 'INVALID_CONFIG',
    MIXING_ERROR: 'MIXING_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INTERNAL_ERROR: 'INTERNAL_ERROR'
};
exports.DEFAULT_MIXER_CONFIG = {
    minAmount: 0.001,
    maxAmount: 0.1,
    minDelay: 1000,
    maxDelay: 5000,
    mixingRounds: 3,
    useRandomAmounts: true,
    enableTimingVariation: true
};
