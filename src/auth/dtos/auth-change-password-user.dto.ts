import { IsEmail, IsString } from 'class-validator';

export class AuthChangePasswordUserDto {
  @IsEmail()
  @IsString()
  email: string;
  @IsString()
  currentPassword: string;
  @IsString()
  newPassword: string;
}
