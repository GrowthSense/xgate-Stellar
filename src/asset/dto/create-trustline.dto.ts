import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateTrustlineDto {
    @IsString()
    @ApiProperty()
    assetCode: string;

    @IsString()
    @ApiProperty()
    recipientPublicKey: string;

    @IsString()
    @ApiProperty()
    recipientSecretKey:string
  }
  