import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() body: CreateCompanyDto) {
    return this.companyService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findMyCompany(@Req() req: any) {
    return this.companyService.findById(req.user.companyId);
  }
}