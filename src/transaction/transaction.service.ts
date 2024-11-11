import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Asset, Keypair } from '@stellar/stellar-sdk';
import StellarSdk from '@stellar/stellar-sdk'
import { TransactionRepository } from './transaction.repository';


const fetch = require('node-fetch')

@Injectable()
export class TransactionService {

  constructor(@InjectRepository(TransactionRepository) private transactionRepo: TransactionRepository) { }



  async sendPayment(destinationPublicKey: string, amount: string, assetCode:string) {
   // const secret = 'SD3EKFNGV44N5TZV746RHTPRJKMFR57NEX7KETYZ4RCYBM7F3YOUAWUG';
    const secret='SB7COVHVX4VCGULLN66GTDNSIRHUGH5MVEL5NK56BXUW355BMHPEY4ZL';
    const sourcePair = Keypair.fromSecret(secret);

    const server = new StellarSdk.Horizon.Server(
      "https://horizon-testnet.stellar.org",
      
    );

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      throw new BadRequestException('Amount must be a positive number');
    }

  
    const amountString = parseFloat(amount).toFixed(7);

    let asset;

    // Check if the asset is native or custom
    if (assetCode === 'native') {
        asset = StellarSdk.Asset.native(); // Use native XLM
    } else {
        if (!sourcePair.publicKey()) {
            throw new BadRequestException('Issuing account must be provided for custom assets.');
        }
        asset = new StellarSdk.Asset(assetCode, sourcePair.publicKey());
    }

    try {
      const sourceAccount = await server.loadAccount(sourcePair.publicKey());
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: 'Test SDF Network ; September 2015',
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: destinationPublicKey,
            asset: asset,
            amount: amountString,
          })
        )
        .setTimeout(30)
        .build();

      transaction.sign(sourcePair);
      const result = await server.submitTransaction(transaction);
      return result;
  
    } catch (error) {
      throw new BadRequestException(`Error sending payment: ${error.message}`);
    }
  }


  // async intiateDeposit(assetCode:string, account:string){

  //   try {

  //   const server = new StellarSdk.Horizon.Server(
  //     "https://horizon-testnet.stellar.org",
      
  //   );
  //     await server.loadAccount(account);
  //     const assetIssuer="";
  //     const asset=new Asset(assetCode,assetIssuer);
  //   }
  //   catch(error){
  //     console.log(error)
  //   }
  // }

}