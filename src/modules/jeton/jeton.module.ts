import { Module } from '@nestjs/common';
import { JetonService } from './jeton.service';

@Module({
  providers: [JetonService],
  exports: [JetonService],
})
export class JetonModule {}