import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from 'src/database/typeorm-ex.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserRepository } from 'src/auth/user.repository';
import { JwtStrategy } from './jwt.strategy';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [TypeOrmModule.forCustomRepository([UserRepository]),
    PassportModule,
  JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async () => ({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' }
    })
  })],
  exports:[AuthService],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy
  ],
})
export class AuthModule { }
