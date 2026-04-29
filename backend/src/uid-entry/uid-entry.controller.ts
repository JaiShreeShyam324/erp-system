import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UidEntryService } from './uid-entry.service';
import { CreateUidEntryDto } from './dto/create-uid-entry.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('uid-entry')
@UseGuards(JwtAuthGuard)
export class UidEntryController {
  constructor(private readonly uidEntryService: UidEntryService) {}

  @Post()
  create(@Body() body: CreateUidEntryDto, @Req() req: any) {
    return this.uidEntryService.create(body, req.user.companyId);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.uidEntryService.findAll(req.user.companyId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { machineNumber: string },
    @Req() req: any,
  ) {
    return this.uidEntryService.update(
      +id,
      body.machineNumber,
      req.user.companyId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.uidEntryService.remove(+id, req.user.companyId);
  }

  @Get('search/:uid')
  findByUid(@Param('uid') uid: string, @Req() req: any) {
    return this.uidEntryService.findByUid(uid, req.user.companyId);
  }

  @Post('upsert')
  upsert(@Body() body: any, @Req() req: any) {
    return this.uidEntryService.upsert(body, req.user.companyId);
  }
}