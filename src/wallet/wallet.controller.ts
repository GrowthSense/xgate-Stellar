import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('wallet')
@ApiTags('Wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('fundwallet/:publicKey')
  async fundWallet(@Param('publicKey') publicKey: string) {
    return this.walletService.fundWallet(publicKey);
  }

  @Get('getBalance/:publicKey')
  getBalance(@Param('publicKey') publicKey: string) {
    return this.walletService.getBalance(publicKey);
  }
  
}
