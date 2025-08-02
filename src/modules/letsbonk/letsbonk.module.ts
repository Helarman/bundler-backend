import { Module } from '@nestjs/common';
import { LetsBonkController } from './letsbonk.controller';
import { LetsBonkService } from './letsbonk.service';

@Module({
  controllers: [LetsBonkController],
  providers: [LetsBonkService],
  exports: [LetsBonkService],
})
export class LetsBonkModule {}