import { Controller, Get, Req, Res, UseGuards, Param } from '@nestjs/common';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import type { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('export')
@UseGuards(JwtAuthGuard)
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('products')
  exportProducts(@Req() req: any) {
    return this.exportService.exportProducts(req.user.companyId);
  }

  @Get('parties')
  exportParties(@Req() req: any) {
    return this.exportService.exportParties(req.user.companyId);
  }

  @Get('ledger')
  exportLedger(@Req() req: any) {
    return this.exportService.exportLedger(req.user.companyId);
  }

  @Get('uid-entries')
  exportUidEntries(@Req() req: any) {
    return this.exportService.exportUidEntries(req.user.companyId);
  }

  @Get('barcode-entries')
  exportBarcodeEntries(@Req() req: any) {
    return this.exportService.exportBarcodeEntries(req.user.companyId);
  }

  @Get('order-stock')
  exportOrderStock(@Req() req: any) {
    return this.exportService.exportOrderStock(req.user.companyId);
  }

  @Get('download/:fileName')
  downloadFile(@Param('fileName') fileName: string, @Res() res: Response) {
    const filePath = path.join(process.cwd(), 'exports', fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    return res.download(filePath);
  }
}