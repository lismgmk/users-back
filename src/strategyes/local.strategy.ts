import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from '../entities/user.entity';
import { JwtPassService } from '../modules/jwt-pass-service/jwt-pass.service';
import { UsersQueryRepository } from '../modules/users/users.queryRepository';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private jwtPassService: JwtPassService,
  ) {
    super({
      usernameField: 'login',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = (await this.usersQueryRepository.getUserByName(
      username,
    )) as User;
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
