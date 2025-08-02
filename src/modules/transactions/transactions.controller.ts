import { Controller, Post, Body, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { SendTransactionsDto, SendTransactionsResponseDto, TransactionStatusDto } from './dto/transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('send')
  async send(@Body() sendData: SendTransactionsDto): Promise<SendTransactionsResponseDto> {
    try {
      return await this.transactionsService.sendTransactions(sendData);
    } catch (error) {
      throw new HttpException({
        success: false,
        error: 'Failed to send transactions'
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('status/:signature')
  async getStatus(@Param('signature') signature: string): Promise<TransactionStatusDto> {
    try {
      return await this.transactionsService.getTransactionStatus(signature);
    } catch (error) {
      throw new HttpException({
        success: false,
        error: 'Failed to get transaction status'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}