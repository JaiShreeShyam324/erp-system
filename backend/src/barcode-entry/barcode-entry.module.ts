import { Module } from '@nestjs/common';
import { BarcodeEntryController } from './barcode-entry.controller';
import { BarcodeEntryService } from './barcode-entry.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BarcodeEntryController],
  providers: [BarcodeEntryService],
})
export class BarcodeEntryModule {}