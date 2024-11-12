import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { UserRepository } from 'src/auth/user.repository';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import * as argon2 from 'argon2'
import { LoginDto } from './dto/login.dto';
import StellarSdk,{ Keypair } from '@stellar/stellar-sdk';


@Injectable()
export class AuthService {

  constructor(@InjectRepository(UserRepository) private readonly userRepository: UserRepository, private jwtService: JwtService) { }

  async signUp(signUpDto: SignUpDto) {
    const { email, firstname, lastname, phonenumber, password } = signUpDto;
    const userExist=await this.userRepository.findOne({where:{email}});
    if(userExist)throw new BadRequestException('User with this email already exist');

    const pair=Keypair.random();
    const publicKey=pair.publicKey()
    const secretKey=pair.secret()
    // console.log("Secret Key",secretKey)

    // const hashedSecretKey = await argon2.hash(secretKey);

    const user=this.userRepository.create({
      email,firstname,lastname,phonenumber,publicKey,secretKey,password
    });
    return await this.userRepository.save(user)

  }

  async fundWallet(publicKey:string){
    const friendBotUrl=`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`;
    try {
      await fetch(friendBotUrl)
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

  async validateUser(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } })
    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }
    const isPasswordValid = await argon2.verify(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials")
    }
    return user
  }


  // async login(loginDto: LoginDto): Promise<any> {
  //   const user = await this.validateUser(loginDto)
  //   return this.createToken(user)
  // }

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

   
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    
    return { message: 'Login successful', token };
  }

  private async createToken(user: User): Promise<any> {
    const payload = { sub: user.id, email: user.email }
    const token = this.jwtService.sign(payload)
    
    return {
      accessToken: token
    }
  }

  async findOne(id:string){
    return this.userRepository.findOne({where:{id}})
  }

  async findUserWalletBy(publicKey:string){
    return this.userRepository.findOne({where:{publicKey}})
  }

}
