import { Injectable, InternalServerErrorException, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as twilio from 'twilio';
import { ConfigService } from '@nestjs/config';

const generator = require('generate-password');

@Injectable()
export class UserService {
    private twilioClient:twilio.Twilio;

    constructor(@InjectRepository(UserRepository) private userRepo: UserRepository, private readonly configService: ConfigService) {
        const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
        const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

        this.twilioClient= twilio(accountSid,authToken)
    }
    async createUser(createUserDo: CreateUserDto): Promise<User> {
        try {
        const pin = this.generatePin();
        const user= await this.userRepo.createUser(createUserDo,pin)
        await this.sendPinSms(createUserDo.phonenumber, pin);
        return user
        }catch (error){
            console.error('Error creating user or sending PIN:', error);
            throw new InternalServerErrorException('Failed to create user or send PIN via SMS');
         
        }
    }

    generatePin() {
        const pin = generator.generate({
          length: 4,
          numbers: true,
          symbols: false,
          uppercase: false,
          lowercase: false,
          excludeSimilarCharacters: true,
        });
        return pin;
      }
    async sendPinSms(phoneNumber: string, pin: string): Promise<void> {
        try {
            const formattedPhoneNumber = this.formatPhoneNumber(phoneNumber);
    
            const message = await this.twilioClient.messages.create({
                body: `Macmillan Playground:  Your verification PIN is: ${pin}`,
                from: process.env.TWILIO_PHONE_NUMBER, 
                
                to: formattedPhoneNumber,  
            });
    
            console.log('SMS sent:', message.sid);
        } catch (error) {
            console.error('Error sending SMS:', error);
            throw new Error('Failed to send PIN via SMS');
        }
    }
    
    private formatPhoneNumber(phoneNumber: string): string {
        if (!phoneNumber.startsWith('+')) {
            return `+${phoneNumber}`;
        }
        return phoneNumber;
    }
    
}
