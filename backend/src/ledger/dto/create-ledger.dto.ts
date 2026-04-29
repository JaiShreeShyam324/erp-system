import { IsNumber, IsString } from 'class-validator';

export class CreateLedgerDto {
  @IsNumber()
  partyId!: number;

  @IsNumber()
  amount!: number;

  @IsString()
  type!: string; // RECEIVABLE / PAYABLE
}