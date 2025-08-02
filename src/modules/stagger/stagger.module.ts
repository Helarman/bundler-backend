import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JetonModule } from '../jeton/jeton.module';
import { StaggerService } from './stagger.service';
import { StaggerController } from './stagger.controller';

@Module({
  imports: [EventEmitterModule.forRoot(), JetonModule],
  providers: [StaggerService],
  controllers: [StaggerController],
  exports: [StaggerService]
})
export class StaggerModule {}