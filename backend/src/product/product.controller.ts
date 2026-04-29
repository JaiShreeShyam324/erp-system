import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() body: CreateProductDto, @Req() req: any) {
    return this.productService.create(body, req.user.companyId);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.productService.findAll(req.user.companyId);
  }
}