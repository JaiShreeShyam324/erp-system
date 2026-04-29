import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLedgerDto } from './dto/create-ledger.dto';

@Injectable()
export class LedgerService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateLedgerDto, companyId: number) {
    return this.prisma.ledger.create({
      data: {
        partyId: data.partyId,
        amount: data.amount,
        type: data.type,
        companyId,
      },
    });
  }

  findAll(companyId: number) {
    return this.prisma.ledger.findMany({
      where: { companyId },
      include: { party: true },
    });
  }

  async getOutstanding(companyId: number) {
  const data = await this.prisma.ledger.findMany({
    where: { companyId },
    include: { party: true },
  });

  const result: any = {};

  data.forEach((item) => {
    if (!result[item.partyId]) {
      result[item.partyId] = {
        partyId: item.partyId,
        partyName: item.party.name,
        receivable: 0,
        payable: 0,
      };
    }

    if (item.type === 'RECEIVABLE') {
      result[item.partyId].receivable += item.amount;
    } else {
      result[item.partyId].payable += item.amount;
    }
  });

  return Object.values(result).map((item: any) => ({
    ...item,
    balance: item.receivable - item.payable,
  }));
}
}