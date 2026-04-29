import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() body: CreateOrderDto, @Req() req: any) {
    return this.orderService.create(body, req.user.companyId);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.orderService.findAll(req.user.companyId);
  }

  @Get('pending')
  getPendingReport(@Req() req: any) {
    return this.orderService.getPendingReport(req.user.companyId);
  }

  @Patch(':id/sell')
  updateSoldQty(
    @Param('id') id: string,
    @Body() body: { soldQty: number },
    @Req() req: any,
  ) {
    return this.orderService.updateSoldQty(
      +id,
      body.soldQty,
      req.user.companyId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.orderService.remove(+id, req.user.companyId);
  }
}