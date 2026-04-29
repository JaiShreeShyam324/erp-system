import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartyDto } from './dto/create-party.dto';

@Injectable()
export class PartyService {
  constructor(private prisma: PrismaService) {}

  create(data: CreatePartyDto, companyId: number) {
    return this.prisma.party.create({
      data: {
        name: data.name,
        type: data.type,
        companyId,
      },
    });
  }

  findAll(companyId: number) {
    return this.prisma.party.findMany({
      where: { companyId },
      orderBy: { id: 'asc' },
    });
  }
}