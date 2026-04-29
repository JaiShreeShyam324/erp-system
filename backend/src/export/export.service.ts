import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  private writeExcel(rows: any[], fileName: string, sheetName: string) {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const exportDir = path.join(process.cwd(), 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    const filePath = path.join(exportDir, fileName);
    XLSX.writeFile(workbook, filePath);

    return {
      message: 'Export successful',
      filePath,
    };
  }

  async exportProducts(companyId: number) {
    const products = await this.prisma.product.findMany({
      where: { companyId },
      orderBy: { id: 'asc' },
    });

    return this.writeExcel(products, `products-${companyId}.xlsx`, 'Products');
  }

  async exportParties(companyId: number) {
    const parties = await this.prisma.party.findMany({
      where: { companyId },
      orderBy: { id: 'asc' },
    });

    return this.writeExcel(parties, `parties-${companyId}.xlsx`, 'Parties');
  }

  async exportLedger(companyId: number) {
    const ledger = await this.prisma.ledger.findMany({
      where: { companyId },
      include: { party: true },
      orderBy: { id: 'asc' },
    });

    const finalData = ledger.map((item) => ({
      id: item.id,
      partyId: item.partyId,
      partyName: item.party.name,
      amount: item.amount,
      type: item.type,
      companyId: item.companyId,
      createdAt: item.createdAt,
    }));

    return this.writeExcel(finalData, `ledger-${companyId}.xlsx`, 'Ledger');
  }

  async exportUidEntries(companyId: number) {
    const data = await this.prisma.uidMachineEntry.findMany({
      where: { companyId },
      orderBy: { id: 'asc' },
    });

    return this.writeExcel(data, `uid-entries-${companyId}.xlsx`, 'UID Entries');
  }

  async exportBarcodeEntries(companyId: number) {
    const data = await this.prisma.barcodeCheckEntry.findMany({
      where: { companyId },
      orderBy: { id: 'asc' },
    });

    return this.writeExcel(
      data,
      `barcode-entries-${companyId}.xlsx`,
      'Barcode Entries',
    );
  }

  async exportOrderStock(companyId: number) {
    const stocks = await this.prisma.stock.findMany({
      where: { companyId },
      include: { product: true },
    });

    const orders = await this.prisma.order.findMany({
      where: { companyId },
      include: { product: true },
    });

    const map: any = {};

    stocks.forEach((item) => {
      if (!map[item.productId]) {
        map[item.productId] = {
          product: item.product.name,
          design: item.product.design,
          stockIn: 0,
          stockOut: 0,
          orderQty: 0,
          soldQty: 0,
        };
      }

      if (item.type === 'IN') {
        map[item.productId].stockIn += item.quantity;
      } else {
        map[item.productId].stockOut += item.quantity;
      }
    });

    orders.forEach((item) => {
      if (!map[item.productId]) {
        map[item.productId] = {
          product: item.product.name,
          design: item.product.design,
          stockIn: 0,
          stockOut: 0,
          orderQty: 0,
          soldQty: 0,
        };
      }

      map[item.productId].orderQty += item.quantity;
      map[item.productId].soldQty += item.soldQty;
    });

    const finalData = Object.values(map).map((item: any) => ({
      ...item,
      stockBalance: item.stockIn - item.stockOut,
      pendingQty: item.orderQty - item.soldQty,
      stockAfterOrder:
        item.stockIn - item.stockOut - (item.orderQty - item.soldQty),
    }));

    return this.writeExcel(
      finalData,
      `order-stock-${companyId}.xlsx`,
      'Order Stock Report',
    );
  }
}