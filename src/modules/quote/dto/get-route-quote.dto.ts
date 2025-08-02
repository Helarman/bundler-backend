import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum TradeAction {
  BUY = 'buy',
  SELL = 'sell',
}

export class GetRouteQuoteDto {
  @IsString()
  tokenMintAddress: string;

  @IsNumber()
  amount: number;

  @IsEnum(TradeAction)
  action: TradeAction = TradeAction.BUY;

  @IsString()
  @IsOptional()
  rpcUrl?: string;
}