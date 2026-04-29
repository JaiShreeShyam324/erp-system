import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateProductDto, companyId: number) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        design: data.design,
        companyId,
      },
    });
  }

  findAll(companyId: number) {
    return this.prisma.product.findMany({
      where: { companyId },
      orderBy: { id: 'asc' },
    });
  }
}