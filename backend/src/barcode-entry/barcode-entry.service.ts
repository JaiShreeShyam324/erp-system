import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBarcodeEntryDto } from './dto/create-barcode-entry.dto';

@Injectable()
export class BarcodeEntryService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateBarcodeEntryDto, companyId: number) {
    return this.prisma.barcodeCheckEntry.create({
      data: {
        barcode: data.barcode,
        checkingDate: new Date(data.checkingDate),
        checkingRemark: data.checkingRemark ?? null,
        checkerName: data.checkerName,
        companyId,
      },
    });
  }

  findAll(companyId: number) {
    return this.prisma.barcodeCheckEntry.findMany({
      where: { companyId },
      orderBy: { id: 'asc' },
    });
  }

  update(id: number, data: any, companyId: number) {
    return this.prisma.barcodeCheckEntry.updateMany({
      where: { id, companyId },
      data: {
        barcode: data.barcode,
        checkingDate: new Date(data.checkingDate),
        checkingRemark: data.checkingRemark ?? null,
        checkerName: data.checkerName,
      },
    });
  }

  remove(id: number, companyId: number) {
    return this.prisma.barcodeCheckEntry.deleteMany({
      where: { id, companyId },
    });
  }

  findByBarcode(barcode: string, companyId: number) {
    return this.prisma.barcodeCheckEntry.findFirst({
      where: { barcode, companyId },
      orderBy: { id: 'desc' },
    });
  }

  async upsert(data: any, companyId: number) {
    const existing = await this.prisma.barcodeCheckEntry.findFirst({
      where: { barcode: data.barcode, companyId },
      orderBy: { id: 'desc' },
    });

    if (existing) {
      return this.prisma.barcodeCheckEntry.update({
        where: { id: existing.id },
        data: {
          checkingDate: new Date(data.checkingDate),
          checkingRemark: data.checkingRemark ?? null,
          checkerName: data.checkerName,
        },
      });
    }

    return this.prisma.barcodeCheckEntry.create({
      data: {
        barcode: data.barcode,
        checkingDate: new Date(data.checkingDate),
        checkingRemark: data.checkingRemark ?? null,
        checkerName: data.checkerName,
        companyId,
      },
    });
  }
}