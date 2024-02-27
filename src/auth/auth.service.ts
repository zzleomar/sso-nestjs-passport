import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthLoginUserDto } from './dtos/auth-login-user.dto';
import { AuthRegisterUserDto } from './dtos/auth-register-user.dto';
import { AuthVericatedUserDto } from './dtos/auth-verificated-user.dto copy';
import { faker } from '@faker-js/faker';
import { EmailService } from 'src/email/email.service';
import { AuthChangePasswordUserDto } from './dtos/auth-change-password-user.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthForgotPasswordUserDto } from './dtos/auth-forgot-password-user.dto';
import { AuthConfirmPasswordUserDto } from './dtos/auth-confirm-password-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async login(userData: AuthLoginUserDto): Promise<{ accessToken: string }> {
    const user = await this.authenticated(userData);
    const payload = user.toObject();
    delete payload.password;
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async authenticated(userData: AuthLoginUserDto): Promise<User> {
    const user = await this.usersService.findOneByEmail(userData.email, false);

    if (!user || !user.status) {
      throw new UnauthorizedException();
    }

    const isAuthenticated = await this.comparePasswords(
      user?.password,
      userData.password,
    );
    if (!isAuthenticated) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async register(authRegisterUserDto: AuthRegisterUserDto) {
    const { email, password } = authRegisterUserDto;
    const code = faker.string.alphanumeric(6).toUpperCase();
    const body = {
      email,
      code,
      password: await this.hashPassword(password),
    };
    const data = await this.usersService.registerUser(body);

    await this.emailService.findAndSend('sendCodeVerificated', {
      email: email,
      code,
    });
    return data;
  }

  async comparePasswords(
    hashedPassword: string = '',
    plainPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.SALTROUNDS);
    return bcrypt.hash(password, saltRounds);
  }

  async vericatedUser(authVericatedUserDto: AuthVericatedUserDto) {
    const { code, email } = authVericatedUserDto;
    await this.usersService.verificatedFindByCodeAndEmail(code, email);
  }

  async changeUserPassword(
    authChangePasswordUserDto: AuthChangePasswordUserDto,
  ): Promise<User> {
    const user = await this.authenticated({
      email: authChangePasswordUserDto.email,
      password: authChangePasswordUserDto.currentPassword,
    });
    user.password = await this.hashPassword(
      authChangePasswordUserDto.newPassword,
    );
    return await user.save();
  }

  async forgotUserPassword(
    authForgotPasswordUserDto: AuthForgotPasswordUserDto,
  ) {
    const user = await this.usersService.findOneByEmail(
      authForgotPasswordUserDto.email,
      true,
    );
    const { email } = authForgotPasswordUserDto;
    const code = faker.string.alphanumeric(6).toUpperCase();
    user.code = code;
    await user.save();
    await this.emailService.findAndSend('sendCodeResetPassword', {
      email: email,
      code,
    });
  }

  async confirmUserPassword(
    authConfirmPasswordUserDto: AuthConfirmPasswordUserDto,
  ) {
    const { email, confirmationCode, newPassword } = authConfirmPasswordUserDto;
    const user = await this.usersService.verificatedFindByCodeAndEmail(
      confirmationCode,
      email,
      false,
    );
    user.code = null;
    user.password = await this.hashPassword(newPassword);
    await user.save();
  }
}
