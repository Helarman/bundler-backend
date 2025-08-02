import { Module } from '@nestjs/common';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { JetonModule } from '../jeton/jeton.module';

@Module({
  imports: [JetonModule],
  controllers: [QuoteController],
  providers: [QuoteService],
})
export class QuoteModule {}