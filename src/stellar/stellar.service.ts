import { Injectable } from '@nestjs/common';
import StellarSdk, { Keypair } from '@stellar/stellar-sdk'

var server=new StellarSdk.Server('https://horizon-testnet.stellar.org')

@Injectable()
export class StellarService {
    
 async createAccount(){
    const pair=Keypair.random();
    return {
        publicKey:pair.publicKey(),
        secret:pair.secret()
    }
 }   
}
