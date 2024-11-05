import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, IsString, Min } from "class-validator";

export class CreateTransactionDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    amount:string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    assetCode:string
  }
  