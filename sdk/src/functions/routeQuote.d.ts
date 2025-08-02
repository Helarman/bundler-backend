import { ApiResponse } from '../types';
export type SupportedProtocol = 'boopfun' | 'pumpfun' | 'moonshot' | 'raydium' | 'jupiter' | 'orca';
export type QuoteAction = 'buy' | 'sell';
export interface RouteQuoteConfig {
    /** The action to perform - buy or sell */
    action: QuoteAction;
    /** The token mint address to get quotes for */
    tokenMintAddress: string;
    /** The amount to buy/sell (SOL for buy, tokens for sell) */
    amount: number;
    /** Optional RPC URL override */
    rpcUrl?: string;
}
export interface RouteQuoteResponse {
    success: boolean;
    action: QuoteAction;
    protocol: SupportedProtocol;
    tokenMintAddress: string;
    inputAmount: number;
    outputAmount: string;
}
export interface RouteQuoteResult extends RouteQuoteResponse {
    /** Get the output amount as a number */
    getOutputAmountAsNumber(): number;
    /** Get the exchange rate (output/input) */
    getExchangeRate(): number;
    /** Check if this is a buy operation */
    isBuyOperation(): boolean;
    /** Check if this is a sell operation */
    isSellOperation(): boolean;
    /** Get a human-readable summary */
    getSummary(): string;
}
/**
 * Get route quote from the API with enhanced result
 */
export declare const getRouteQuote: (config: RouteQuoteConfig) => Promise<ApiResponse<RouteQuoteResult>>;
/**
 * Convenience method to get a buy quote
 */
export declare const getBuyQuote: (tokenMintAddress: string, solAmount: number, rpcUrl?: string) => Promise<ApiResponse<RouteQuoteResult>>;
/**
 * Convenience method to get a sell quote
 */
export declare const getSellQuote: (tokenMintAddress: string, tokenAmount: number, rpcUrl?: string) => Promise<ApiResponse<RouteQuoteResult>>;
/**
 * Compare buy and sell quotes for the same token
 */
export declare const compareQuotes: (tokenMintAddress: string, solAmount: number, tokenAmount: number, rpcUrl?: string) => Promise<{
    buyQuote?: RouteQuoteResult;
    sellQuote?: RouteQuoteResult;
    buySuccess: boolean;
    sellSuccess: boolean;
    comparison?: string;
}>;
/**
 * Validate route quote inputs
 */
export declare const validateRouteQuoteInputs: (config: RouteQuoteConfig) => {
    valid: boolean;
    error?: string;
};
//# sourceMappingURL=routeQuote.d.ts.map