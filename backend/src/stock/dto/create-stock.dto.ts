import { IsNumber, IsString } from 'class-validator';

export class CreateStockDto {
  @IsNumber()
  productId!: number;

  @IsNumber()
  quantity!: number;

  @IsString()
  type!: string; // IN / OUT
}