import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import * as dotenv from 'dotenv';
import { UsersService } from 'src/users/users.service';
import { UserSchema } from 'src/users/entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { EmailService } from 'src/email/email.service';
import { CommonService } from 'src/common/common.service';
dotenv.config();

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Replace with your own secret key
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    UsersService,
    EmailService,
    CommonService,
  ],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
