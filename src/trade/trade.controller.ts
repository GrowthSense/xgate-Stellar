import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TradeService } from './trade.service';
import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';

@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Post('create-offer')
  async createOffer(@Body() createOfferDto: CreateTradeDto) {
    const { sellingAssetCode, buyingAssetCode, amount, price } = createOfferDto;
    return this.tradeService.createOffer(sellingAssetCode, buyingAssetCode, amount, price);
  }

  // @Get('orderbook')
  // async getOrderBook(@Query() getOrderBookDto: GetOrderBookDto) {
  //   const { sellingAssetCode, issuingAccountSecret } = getOrderBookDto;
  //   return this.tradeService.getOrderBook(sellingAssetCode, issuingAccountSecret);
  // }
}
