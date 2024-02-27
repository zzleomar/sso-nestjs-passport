import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthLoginUserDto } from './dtos/auth-login-user.dto';
import { AuthRegisterUserDto } from './dtos/auth-register-user.dto';
import { AuthVericatedUserDto } from './dtos/auth-verificated-user.dto copy';
import { AuthChangePasswordUserDto } from './dtos/auth-change-password-user.dto';
import { AuthForgotPasswordUserDto } from './dtos/auth-forgot-password-user.dto';
import { AuthConfirmPasswordUserDto } from './dtos/auth-confirm-password-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CommonService } from 'src/common/common.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body() authRegisterUserDto: AuthRegisterUserDto) {
    try {
      const data = await this.authService.register(authRegisterUserDto);
      return CommonService.responseFormate('Register successfully', data);
    } catch (err) {
      return CommonService.responseFormate('error', null, err);
    }
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() authLoginUserDto: AuthLoginUserDto) {
    try {
      const token = await this.authService.login(authLoginUserDto);
      return CommonService.responseFormate('login successfully', token);
    } catch (err) {
      return CommonService.responseFormate('error', null, err);
    }
  }

  @Post('/vericated')
  async vericated(@Body() authVericatedUserDto: AuthVericatedUserDto) {
    try {
      await this.authService.vericatedUser(authVericatedUserDto);
      return CommonService.responseFormate('Vericated successfully', null);
    } catch (err) {
      return CommonService.responseFormate('error', null, err);
    }
  }

  @Post('/change-password')
  @UsePipes(ValidationPipe)
  async changePassword(
    @Body() authChangePasswordUserDto: AuthChangePasswordUserDto,
  ) {
    try {
      await this.authService.changeUserPassword(authChangePasswordUserDto);
      return CommonService.responseFormate('change successfully', null);
    } catch (err) {
      return CommonService.responseFormate('error', null, err);
    }
  }

  @Post('/forgot-password')
  @UsePipes(ValidationPipe)
  async forgotPassword(
    @Body() authForgotPasswordUserDto: AuthForgotPasswordUserDto,
  ) {
    try {
      await this.authService.forgotUserPassword(authForgotPasswordUserDto);
      return CommonService.responseFormate(
        'code sent to recover password',
        null,
      );
    } catch (err) {
      return CommonService.responseFormate('error', null, err);
    }
  }

  @Post('/confirm-password')
  @UsePipes(ValidationPipe)
  async confirmPassword(
    @Body() authConfirmPasswordUserDto: AuthConfirmPasswordUserDto,
  ) {
    try {
      await this.authService.confirmUserPassword(authConfirmPasswordUserDto);
      return CommonService.responseFormate('change successfully', null);
    } catch (err) {
      return CommonService.responseFormate('error', null, err);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  @UsePipes(ValidationPipe)
  async me(@Req() req: any) {
    try {
      const user = req.user;
      return user;
    } catch (err) {
      return { success: false, error: err };
    }
  }
}
