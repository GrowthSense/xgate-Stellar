import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignUpDto {
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    @ApiProperty()
    email: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    firstname: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    lastname: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    phonenumber: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    zipcode: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    cashtag: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    password: string
}