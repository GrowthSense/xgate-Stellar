import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('transaction')
@ApiTags('Transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Post('payment/:publicKey')
  async sendPayment(@Param('publicKey') publicKey: string, @Body() createTransactionDto: CreateTransactionDto) {
    const {amount, assetCode}=createTransactionDto;
    try {
      const result = await this.transactionService.sendPayment(publicKey, amount, assetCode);
      return {
        message: 'Funds sent successfully',
        result,
      };
    } catch (error) {
      return {
        message: 'Error sending funds',
        error: error.message,
      };
    }
  }
}
