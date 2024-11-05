import { Controller, Post, Body, Param } from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { CreateTrustlineDto } from './dto/create-trustline.dto';
import { ApiTags } from '@nestjs/swagger';
import { spec } from 'node:test/reporters';

@Controller('assets')
@ApiTags('Asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) { }

  @Post('trustline')
  async createTrustline(@Body() createTrustlineDto: CreateTrustlineDto) {
    const { assetCode, recipientPublicKey, recipientSecretKey } = createTrustlineDto;
    return await this.assetService.createTrustline(assetCode, recipientPublicKey, recipientSecretKey);
  }

  @Post('issue')
  async issueAsset(@Body() createAssetDto: CreateAssetDto) {
    const { assetCode, amount, recipientPublicKey } = createAssetDto;
    return await this.assetService.issueAsset(assetCode, amount, recipientPublicKey);
  }
}
