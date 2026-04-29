import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ✅ SEED (NO GUARD)
  @Get('seed')
  async seed() {
    const prisma = (this.authService as any).prisma;
    const hash = await bcrypt.hash('123456', 10);

    await prisma.company.upsert({
      where: { code: 'DEMO' },
      update: {},
      create: {
        name: 'Demo Company',
        code: 'DEMO',
      },
    });

    await prisma.user.upsert({
      where: { email: 'erpdemo@test.com' },
      update: { password: hash },
      create: {
        name: 'Demo User',
        email: 'erpdemo@test.com',
        password: hash,
        role: 'ADMIN',
        isActive: true,
        companyId: 1,
      },
    });

    return { message: 'Seed data inserted' };
  }

  @Post('login')
  login(@Body() body: any) {
    console.log('LOGIN BODY =>', body);

    if (!body) {
      return { message: 'Body not received' };
    }

    return this.authService.login(body.email, body.password);
  }

  // ❌ GUARD ONLY HERE
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return {
      message: 'Protected route working',
      user: req.user,
    };
  }
}