import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsOptional()
  @IsInt()
  companyId?: number;
}