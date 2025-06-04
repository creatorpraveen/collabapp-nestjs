import { IsString, IsEmail, IsEnum } from 'class-validator';

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
