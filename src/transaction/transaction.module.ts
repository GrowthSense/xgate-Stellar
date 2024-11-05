import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from 'src/database/typeorm-ex.module';
import { TransactionRepository } from './transaction.repository';
import { UserRepository } from 'src/auth/user.repository';

@Module({
  imports:[TypeOrmModule.forCustomRepository([TransactionRepository, UserRepository])],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
