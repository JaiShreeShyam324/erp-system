import { IsString } from 'class-validator';

export class CreateUidEntryDto {
  @IsString()
  uid!: string;

  @IsString()
  machineNumber!: string;
}