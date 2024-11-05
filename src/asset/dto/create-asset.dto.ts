import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateAssetDto {
    @IsString()
    @ApiProperty()
    assetCode: string;

    @IsString()
    @ApiProperty()
    amount: string;

    @IsString()
    @ApiProperty()
    recipientPublicKey: string;
  }
  