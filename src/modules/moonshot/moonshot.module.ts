import { Module } from '@nestjs/common';
import { MoonshotController } from './moonshot.controller';
import { MoonshotService } from './moonshot.service';

@Module({
  controllers: [MoonshotController],
  providers: [MoonshotService],
})
export class MoonshotModule {}