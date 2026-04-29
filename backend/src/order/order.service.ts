import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateOrderDto, companyId: number) {
    return this.prisma.order.create({
      data: {
        productId: data.productId,
        quantity: data.quantity,
        soldQty: data.soldQty ?? 0,
        companyId,
      },
    });
  }

  async findAll(companyId: number) {
    return this.prisma.order.findMany({
      where: { companyId },
      include: {
        product: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  async getPendingReport(companyId: number) {
    const data = await this.prisma.order.findMany({
      where: { companyId },
      include: { product: true },
    });

    return data.map((item) => ({
      orderId: item.id,
      productId: item.productId,
      productName: item.product.name,
      design: item.product.design,
      orderQty: item.quantity,
      soldQty: item.soldQty,
      pendingQty: item.quantity - item.soldQty,
    }));
  }

  updateSoldQty(id: number, soldQty: number, companyId: number) {
    return this.prisma.order.updateMany({
      where: { id, companyId },
      data: { soldQty },
    });
  }

  remove(id: number, companyId: number) {
    return this.prisma.order.deleteMany({
      where: { id, companyId },
    });
  }
}