import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTradeDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    sellingAssetCode: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    buyingAssetCode: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    amount: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    price: string;
}
