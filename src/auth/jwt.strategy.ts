import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET, // Replace with your own secret key
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.userService.findById(payload._id);
    if (!user) {
      throw new UnauthorizedException();
    }

    const data = user.toObject();
    delete data.password;
    return data;
  }
}
