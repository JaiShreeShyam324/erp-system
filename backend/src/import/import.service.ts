import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as XLSX from 'xlsx';

@Injectable()
export class ImportService {
  constructor(private prisma: PrismaService) {}

  async importProductsFromExcel(filePath: string, companyId: number) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    const result: any[] = [];

    for (const row of rows) {
      if (!row.name) continue;

      const product = await this.prisma.product.create({
        data: {
          name: String(row.name),
          design: row.design ? String(row.design) : null,
          companyId,
        },
      });

      result.push(product);
    }

    return {
      message: 'Products imported successfully',
      count: result.length,
      data: result,
    };
  }
}