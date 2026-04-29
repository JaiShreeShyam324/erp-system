import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CompanyModule } from './company/company.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PartyModule } from './party/party.module';
import { LedgerModule } from './ledger/ledger.module';
import { ProductModule } from './product/product.module';
import { StockModule } from './stock/stock.module';
import { OrderModule } from './order/order.module';
import { ImportModule } from './import/import.module';
import { ExportModule } from './export/export.module';
import { UidEntryModule } from './uid-entry/uid-entry.module';
import { BarcodeEntryModule } from './barcode-entry/barcode-entry.module';

@Module({
  imports: [PrismaModule, CompanyModule, UserModule, AuthModule, PartyModule, LedgerModule, ProductModule, StockModule, OrderModule, ImportModule, ExportModule, UidEntryModule, BarcodeEntryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
