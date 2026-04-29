import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateCompanyDto) {
    return this.prisma.company.create({
      data: {
        name: data.name,
        code: data.code,
      },
    });
  }

  findById(companyId: number) {
    return this.prisma.company.findUnique({
      where: { id: companyId },
    });
  }
}