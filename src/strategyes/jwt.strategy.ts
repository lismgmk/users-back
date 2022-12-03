import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { INVALID_TOKEN } from '../consts/ad-validation-const';
import { UsersQueryRepository } from '../modules/users/users.queryRepository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private usersQueryRepository: UsersQueryRepository,
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
      throw new BadRequestException(INVALID_TOKEN);
    }
    const user = await this.usersQueryRepository.getUserById(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
