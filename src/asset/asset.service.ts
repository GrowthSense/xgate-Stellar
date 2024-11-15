import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/user.repository';
import { TransactionRepository } from 'src/transaction/transaction.repository';
import { Asset, BASE_FEE, Horizon, Keypair, Networks, Operation, TransactionBuilder } from '@stellar/stellar-sdk';
import { ConfigService } from '@nestjs/config';
import { AssetRepository } from './asset.repository';
import { AssetEntity } from './entities/asset.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import * as argon2 from 'argon2';

@Injectable()
export class AssetService {

  private server: Horizon.Server;
  private issuerKeypair: Keypair;

  constructor(@InjectRepository(AssetRepository) private assetRepo:AssetRepository, @InjectRepository(UserRepository) private userRepo: UserRepository, @InjectRepository(TransactionRepository) private transctionRepo: TransactionRepository, private configService: ConfigService) {
    //const stellarNetwork = this.configService.get<string>('STELLAR_NETWORK') === 'TESTNEST'? Networks.PUBLIC: Networks.TESTNET;

    this.server = new Horizon.Server('https://horizon-testnet.stellar.org');
    const issuerSecret = this.configService.get<string>('STELLAR_ISSUER_SECRET');
    this.issuerKeypair = Keypair.fromSecret(issuerSecret);
  }

  async createTrustline(assetCode: string, recipientPublicKey: string, recipientSecretKey: string): Promise<AssetEntity> {

    const recipientUser = await this.userRepo.findOne({ where: { publicKey: recipientPublicKey } });
    if (!recipientUser) {
      throw new Error('Recipient user not found');

    }

    // const hashedSecretKey = recipientUser.secretKey;

    // const isValidSecret = await argon2.verify(hashedSecretKey, recipientSecretKey);
    // if (!isValidSecret) {
    //     throw new BadRequestException('Invalid secret key provided');
    // }

    const recipientAccount = await this.server.loadAccount(recipientPublicKey);
    //  const issuerSecret = 'SDWHSSNOCPKF2W6HVRNO7L26FYP44EYY3EUIB7EB3V5ZL7TBKNQY6LIW'
    // const issuerKeypair = Keypair.fromSecret(issuerSecret);

    const asset = new Asset(assetCode, this.issuerKeypair.publicKey());
   // const asset=new Asset(assetCode)

    const transaction = new TransactionBuilder(recipientAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(Operation.changeTrust({ asset }))
      .setTimeout(30)
      .build();

    transaction.sign(Keypair.fromSecret(recipientSecretKey));
    await this.server.submitTransaction(transaction);

    const assetRecord = this.assetRepo.create({
      user: recipientUser,
      assetCode: assetCode,
      issuer:this.issuerKeypair.publicKey()
    })

    return await this.assetRepo.save(assetRecord)

  }


  async issueAsset(assetCode: string, amount: string, recipientPublicKey: string): Promise<Transaction> {
    const recipientUser = await this.userRepo.findOne({ where: { publicKey: recipientPublicKey } });
    if (!recipientUser) {
      throw new Error('Recipient user not found');

    }

  //  const issuerSecret = 'SCZ5UDK4ZIMSFZPJ5FKEA7LSIGN6V4DUHV4OPFMG5JP6G2VJGC5M5TMQ'
  //   const issuerKeypair = Keypair.fromSecret(issuerSecret)

    const issuerAccount = await this.server.loadAccount(this.issuerKeypair.publicKey());
    const asset = new Asset(assetCode, this.issuerKeypair.publicKey());

    const transaction = new TransactionBuilder(issuerAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(Operation.payment({
        destination: recipientUser.publicKey,
        asset: asset,
        amount: amount,
      }))
      .setTimeout(5000)
      .build();

    transaction.sign(this.issuerKeypair);
    const result = await this.server.submitTransaction(transaction);
    const transactionRecord = this.transctionRepo.create({
      recipient: recipientUser,
      assetCode: assetCode,
      amount,
      transactionHash: result.hash,
      issuer:this.issuerKeypair.publicKey()
    })

    return await this.transctionRepo.save(transactionRecord)
  }
}
