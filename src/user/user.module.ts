import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from 'src/database/typeorm-ex.module';
import { UserRepository } from './user.repository';

@Module({
  imports:[TypeOrmModule.forCustomRepository([UserRepository])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
