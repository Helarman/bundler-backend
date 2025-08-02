import { Module } from '@nestjs/common';
import { BoopFunController } from './boopfun.controller';
import { BoopFunService } from './boopfun.service';

@Module({
  controllers: [BoopFunController],
  providers: [BoopFunService],
})
export class BoopFunModule {}