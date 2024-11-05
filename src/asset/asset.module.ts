import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { TypeOrmModule } from 'src/database/typeorm-ex.module';
import { UserRepository } from 'src/auth/user.repository';
import { TransactionRepository } from 'src/transaction/transaction.repository';
import { ConfigService } from '@nestjs/config';
import { AssetRepository } from './asset.repository';

@Module({
  imports:[TypeOrmModule.forCustomRepository([AssetRepository,UserRepository,TransactionRepository])],
  controllers: [AssetController],
  providers: [AssetService, ConfigService],
})
export class AssetModule {}
