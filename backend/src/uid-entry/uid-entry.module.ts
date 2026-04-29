import { Module } from '@nestjs/common';
import { UidEntryController } from './uid-entry.controller';
import { UidEntryService } from './uid-entry.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UidEntryController],
  providers: [UidEntryService],
})
export class UidEntryModule {}