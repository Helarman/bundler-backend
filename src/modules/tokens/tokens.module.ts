import { Module } from '@nestjs/common';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';
import { JetonModule } from '../jeton/jeton.module';

@Module({
  imports: [JetonModule],
  controllers: [TokensController],
  providers: [TokensService]
})
export class TokensModule {}