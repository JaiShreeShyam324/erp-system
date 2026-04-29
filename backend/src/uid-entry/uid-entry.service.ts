import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUidEntryDto } from './dto/create-uid-entry.dto';

@Injectable()
export class UidEntryService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateUidEntryDto, companyId: number) {
    return this.prisma.uidMachineEntry.create({
      data: {
        uid: data.uid,
        machineNumber: data.machineNumber,
        companyId,
      },
    });
  }

  findAll(companyId: number) {
    return this.prisma.uidMachineEntry.findMany({
      where: { companyId },
      orderBy: { id: 'asc' },
    });
  }

  update(id: number, machineNumber: string, companyId: number) {
    return this.prisma.uidMachineEntry.updateMany({
      where: { id, companyId },
      data: { machineNumber },
    });
  }

  findByUid(uid: string, companyId: number) {
    return this.prisma.uidMachineEntry.findFirst({
      where: { uid, companyId },
      orderBy: { id: 'desc' },
    });
  }

  async upsert(data: any, companyId: number) {
    const existing = await this.prisma.uidMachineEntry.findFirst({
      where: { uid: data.uid, companyId },
      orderBy: { id: 'desc' },
    });

    if (existing) {
      return this.prisma.uidMachineEntry.update({
        where: { id: existing.id },
        data: {
          machineNumber: data.machineNumber,
        },
      });
    }

    return this.prisma.uidMachineEntry.create({
      data: {
        uid: data.uid,
        machineNumber: data.machineNumber,
        companyId,
      },
    });
  }

  remove(id: number, companyId: number) {
    return this.prisma.uidMachineEntry.deleteMany({
      where: { id, companyId },
    });
  }
}