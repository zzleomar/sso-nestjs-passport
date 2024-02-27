import { IsEmail, IsString } from 'class-validator';

export class AuthVericatedUserDto {
  @IsString()
  code: string;
  @IsEmail()
  email: string;
}
