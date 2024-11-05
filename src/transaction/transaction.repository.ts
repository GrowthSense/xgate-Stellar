import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { Transaction } from "./entities/transaction.entity";


@CustomRepository(Transaction)
export class TransactionRepository extends Repository<Transaction>{
}