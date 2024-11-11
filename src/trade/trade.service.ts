import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import StellarSdk, { Asset, BASE_FEE, Horizon, Keypair, Networks, Operation, TransactionBuilder } from '@stellar/stellar-sdk';
import axios from 'axios';

@Injectable()
export class TradeService {

  private readonly logger = new Logger(TradeService.name);
  private server: Horizon.Server;
  private issuerKeypair: Keypair;

  constructor() {
    //const stellarNetwork = this.configService.get<string>('STELLAR_NETWORK') === 'TESTNEST'? Networks.PUBLIC: Networks.TESTNET;

    this.server = new Horizon.Server('https://horizon-testnet.stellar.org');

  }

  async createOffer(
    sellingAssetCode: string,
    buyingAssetCode: string,
    amount: string,
    price: string
  ) {
    const issuingKeypair = Keypair.fromSecret("SAV3HHGMB3HDNCPOL3VZMADHLHBYHRMAILNP2BWGDCFMHGQGNZILWC3C");
    const traderKeypair = Keypair.fromSecret("SC2TSSTKURAWUDVGRPKKXLLCE4NUQFWQJ3GTAMQE7IFCCKW6VNB2GSZR");

    // Define assets
    const sellingAsset = sellingAssetCode === 'native'
      ? Asset.native()
      : new Asset(sellingAssetCode, issuingKeypair.publicKey());
    const buyingAsset = buyingAssetCode === 'native'
      ? Asset.native()
      : new Asset(buyingAssetCode, issuingKeypair.publicKey());

    this.logger.log(`Selling Asset: Code - ${sellingAsset.getCode()}, Issuer - ${sellingAsset.getIssuer()}`);
    this.logger.log(`Buying Asset: Code - ${buyingAsset.getCode()}, Issuer - ${buyingAsset.getIssuer()}`);

    try {
      // Load trader account from the Stellar network
      const traderAccount = await this.server.loadAccount(traderKeypair.publicKey());

      // Build the transaction
      const transaction = new TransactionBuilder(traderAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(Operation.manageSellOffer({
          selling: sellingAsset,
          buying: buyingAsset,
          amount: amount,
          price: price,
        }))
        .setTimeout(100)
        .build();

      // Sign transaction with the trader's keypair
      transaction.sign(traderKeypair);

      // Submit the transaction to the Stellar network
      const result = await this.server.submitTransaction(transaction);

      this.logger.log('Offer created successfully', result);
      return result;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Log Stellar's response error data for more details
        this.logger.error('Failed to create offer', error.response.data);
      } else {
        this.logger.error('Failed to create offer', error.message);
      }
      throw error;
    }
  }
}