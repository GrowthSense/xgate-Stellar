import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { HttpException, InternalServerErrorException } from "@nestjs/common";

@CustomRepository(User)
export class UserRepository extends Repository<User>{

    async createUser(createUserDto:CreateUserDto, pin:string):Promise<User>{
        const user=this.create({...createUserDto,pin});
        try {
            await this.save(user)
            return user
        } catch (error) {
            throw new InternalServerErrorException("User already exist")
        }
    }
}