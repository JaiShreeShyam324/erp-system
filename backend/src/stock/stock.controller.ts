import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('stock')
@UseGuards(JwtAuthGuard)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  create(@Body() body: CreateStockDto, @Req() req: any) {
    return this.stockService.create(body, req.user.companyId);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.stockService.findAll(req.user.companyId);
  }

  @Get('report')
  getStockReport(@Req() req: any) {
    return this.stockService.getStockReport(req.user.companyId);
  }

  @Get('order-report')
  getOrderStockReport(@Req() req: any) {
    return this.stockService.getOrderStockReport(req.user.companyId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.stockService.remove(+id, req.user.companyId);
  }
}