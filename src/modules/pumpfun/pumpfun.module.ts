import { Module } from '@nestjs/common';
import { PumpfunController } from './pumpfun.controller';
import { PumpfunService } from './pumpfun.service';
import { JetonModule } from '../jeton/jeton.module';

@Module({
  imports: [JetonModule],
  controllers: [PumpfunController],
  providers: [PumpfunService],
})
export class PumpfunModule {}