import { User } from 'src/auth/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.transactions)
  recipient: User;

  @Column({nullable:true})
  issuer:string

  @Column()
  assetCode:string

  @Column()
  amount: string;

  @Column()
  transactionHash: string; 

  @CreateDateColumn({type:'timestamptz'})
  createdAt:string
}
