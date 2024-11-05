import { AssetEntity } from 'src/asset/entities/asset.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({nullable:true})
  phonenumber:string

  @Column()
  publicKey:string

  @Column()
  secretKey:string

  @Column()
  password: string;

  @OneToMany(()=>AssetEntity, asset=>asset.user)
  assets:AssetEntity[]

  @OneToMany(()=>Transaction, transaction=>transaction.recipient)
  transactions:Transaction[]

  @CreateDateColumn({type:'timestamptz'})
  createdAt:Date
}
