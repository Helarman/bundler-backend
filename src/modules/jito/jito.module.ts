import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JitoController } from './jito.controller';
import { JitoService } from './jito.service';

@Module({
  imports: [HttpModule],
  controllers: [JitoController],
  providers: [JitoService],
  exports: [JitoService],
})
export class JitoModule {}