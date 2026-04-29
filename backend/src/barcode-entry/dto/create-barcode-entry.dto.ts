import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateBarcodeEntryDto {
  @IsString()
  barcode!: string;

  @IsDateString()
  checkingDate!: string;

  @IsOptional()
  @IsString()
  checkingRemark?: string;

  @IsString()
  checkerName!: string;
}