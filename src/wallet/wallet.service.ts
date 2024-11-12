
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import StellarSdk,{ Keypair } from '@stellar/stellar-sdk';


@Injectable()
export class WalletService {
  constructor() {}


  async fundWallet(publicKey:string){
    const friendBotUrl=`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`;
    try {
      await fetch(friendBotUrl)
      return "Wallet funded sucessfully"
    } catch (error) {
      throw new BadRequestException('Unable to fund the wallet')
    }
  }
  
  async getBalance(publicKey: string) {
    try {
      const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
      const account = await server.loadAccount(publicKey);
      const balances = account.balances.map(balance => ({
        assetCode: balance.asset_code || 'XLM',
        balance: balance.balance,
        issuer: balance.issuer || 'N/A',
      }));
      return balances
    } catch (error) {
      throw new Error('Failed to fetch balance')
    }
  }

  // async findUserWalletBy(publicKey:string){
  //   return this.walletRepo.findOne({where:{publicKey}})
  // }

}
