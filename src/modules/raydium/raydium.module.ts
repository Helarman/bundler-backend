import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { RaydiumService } from './raydium.service';
import { RaydiumController } from './raydium.controller';

@Module({
  imports: [
    HttpModule,
    CacheModule.register({
      ttl: 60 * 1000,
      max: 1000 
    })
  ],
  providers: [RaydiumService],
  controllers: [RaydiumController],
  exports: [RaydiumService]
})
export class RaydiumModule {}