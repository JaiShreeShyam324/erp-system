import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { CreateLedgerDto } from './dto/create-ledger.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('ledger')
@UseGuards(JwtAuthGuard)
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Post()
  create(@Body() body: CreateLedgerDto, @Req() req: any) {
    return this.ledgerService.create(body, req.user.companyId);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.ledgerService.findAll(req.user.companyId);
  }

  @Get('outstanding')
  getOutstanding(@Req() req: any) {
    return this.ledgerService.getOutstanding(req.user.companyId);
  }
}