import { IsEmail, IsString } from 'class-validator';

export class AuthConfirmPasswordUserDto {
  @IsEmail()
  email: string;

  @IsString()
  confirmationCode: string;

  @IsString()
  newPassword: string;
}
