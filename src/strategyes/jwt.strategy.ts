import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
    });
  }

  async validate(payload: any) {
    if (!payload) {
      throw new BadRequestException('invalid jwt token');
    }
    const user = await this.usersService.getUserById(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
