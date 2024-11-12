import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetOrderBookDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  sellingAssetCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  issuingAccountSecret: string;
}
