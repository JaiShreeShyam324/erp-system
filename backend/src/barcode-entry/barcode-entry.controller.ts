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
import { BarcodeEntryService } from './barcode-entry.service';
import { CreateBarcodeEntryDto } from './dto/create-barcode-entry.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('barcode-entry')
@UseGuards(JwtAuthGuard)
export class BarcodeEntryController {
  constructor(private readonly barcodeEntryService: BarcodeEntryService) {}

  @Post()
  create(@Body() body: CreateBarcodeEntryDto, @Req() req: any) {
    return this.barcodeEntryService.create(body, req.user.companyId);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.barcodeEntryService.findAll(req.user.companyId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.barcodeEntryService.update(+id, body, req.user.companyId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.barcodeEntryService.remove(+id, req.user.companyId);
  }

  @Get('search/:barcode')
  findByBarcode(@Param('barcode') barcode: string, @Req() req: any) {
    return this.barcodeEntryService.findByBarcode(barcode, req.user.companyId);
  }

  @Post('upsert')
  upsert(@Body() body: any, @Req() req: any) {
    return this.barcodeEntryService.upsert(body, req.user.companyId);
  }
}