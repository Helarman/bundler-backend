import { Module } from '@nestjs/common';
import { RaydiumSdkController } from './raydium-sdk.controller';
import { RaydiumSdkService } from './raydium-sdk.service';

@Module({
  controllers: [RaydiumSdkController],
  providers: [RaydiumSdkService],
  exports: [RaydiumSdkService],
})
export class RaydiumSdkModule {}