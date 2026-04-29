import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockDto } from './dto/create-stock.dto';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateStockDto, companyId: number) {
    return this.prisma.stock.create({
      data: {
        productId: data.productId,
        quantity: data.quantity,
        type: data.type,
        companyId,
      },
    });
  }

  findAll(companyId: number) {
    return this.prisma.stock.findMany({
      where: { companyId },
      include: { product: true },
      orderBy: { id: 'asc' },
    });
  }

  async getStockReport(companyId: number) {
    const data = await this.prisma.stock.findMany({
      where: { companyId },
      include: { product: true },
    });

    const result: any = {};

    data.forEach((item) => {
      if (!result[item.productId]) {
        result[item.productId] = {
          productId: item.productId,
          productName: item.product.name,
          design: item.product.design,
          stockIn: 0,
          stockOut: 0,
        };
      }

      if (item.type === 'IN') {
        result[item.productId].stockIn += item.quantity;
      } else {
        result[item.productId].stockOut += item.quantity;
      }
    });

    return Object.values(result).map((item: any) => ({
      ...item,
      balance: item.stockIn - item.stockOut,
    }));
  }

  async getOrderStockReport(companyId: number) {
    const stockReport: any[] = await this.getStockReport(companyId);

    const orders = await this.prisma.order.findMany({
      where: { companyId },
      include: { product: true },
    });

    const result: any = {};

    stockReport.forEach((item) => {
      result[item.productId] = {
        productId: item.productId,
        productName: item.productName,
        design: item.design,
        stockIn: item.stockIn,
        stockOut: item.stockOut,
        stockBalance: item.balance,
        orderQty: 0,
        soldQty: 0,
      };
    });

    orders.forEach((item) => {
      if (!result[item.productId]) {
        result[item.productId] = {
          productId: item.productId,
          productName: item.product?.name,
          design: item.product?.design,
          stockIn: 0,
          stockOut: 0,
          stockBalance: 0,
          orderQty: 0,
          soldQty: 0,
        };
      }

      result[item.productId].orderQty += item.quantity;
      result[item.productId].soldQty += item.soldQty;
    });

    return Object.values(result).map((item: any) => ({
      ...item,
      pendingQty: item.orderQty - item.soldQty,
      stockAfterOrder: item.stockBalance - (item.orderQty - item.soldQty),
    }));
  }

  remove(id: number, companyId: number) {
    return this.prisma.stock.deleteMany({
      where: { id, companyId },
    });
  }
}