import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateUserDto) {
    const hashedPassword = bcrypt.hashSync(data.password, 10);

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        companyId: data.companyId,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      orderBy: { id: 'asc' },
    });
  }
}