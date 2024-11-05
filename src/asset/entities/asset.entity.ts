import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AssetEntity {
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    assetCode: string;
  
    @Column()
    issuer: string;

    @ManyToOne(()=>User, user=>user.assets)
    user:User
    
    @CreateDateColumn({type:'timestamptz'})
    issuedAt:Date
}
