import { Module } from '@nestjs/common';
import { MixerController } from './mixer.controller';
import { MixerService } from './mixer.service';

@Module({
  controllers: [MixerController],
  providers: [MixerService],
  exports: [MixerService]
})
export class SolMixerModule {}