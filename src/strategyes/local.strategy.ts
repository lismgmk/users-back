import { UsersService } from './../modules/users/users.service';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPassService } from '../modules/jwt-pass-service/jwt-pass.service';
import { User } from '../entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private jwtPassService: JwtPassService,
  ) {
    super({
      usernameField: 'login',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = (await this.usersService.getUserByName(username)) as User;
    let isMatchPass;

    if (user) {
      isMatchPass = await this.jwtPassService.checkPassBcrypt(
        password,
        user.passwordHash,
      );
    }

    if (!user || !isMatchPass) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
