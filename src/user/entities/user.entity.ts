import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({nullable:true})
  phonenumber:string

  @Column()
  password: string;

  @Column({nullable:true})
  pin:string

  @Column({ unique: true })
  cashtag: string;

  @CreateDateColumn({type:'timestamptz'})
  createdAt:Date
}
