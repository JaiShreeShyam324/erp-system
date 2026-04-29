import { IsIn, IsString } from 'class-validator';

export class CreatePartyDto {
  @IsString()
  name!: string;

  @IsString()
  @IsIn(['CUSTOMER', 'SUPPLIER'])
  type!: string;
}