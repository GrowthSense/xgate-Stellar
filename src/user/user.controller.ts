import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
export class UserController {

    constructor(private userService:UserService){}

    @Post()
    async createUser(@Body() createUserDto:CreateUserDto):Promise<User>{
        return this.userService.createUser(createUserDto)
    }
}
