import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PartyService } from './party.service';
import { CreatePartyDto } from './dto/create-party.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('party')
@UseGuards(JwtAuthGuard)
export class PartyController {
  constructor(private readonly partyService: PartyService) {}

  @Post()
  create(@Body() body: CreatePartyDto, @Req() req: any) {
    return this.partyService.create(body, req.user.companyId);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.partyService.findAll(req.user.companyId);
  }
}