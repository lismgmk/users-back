import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { BlackListService } from '../modules/black-list/black-list.service';
import { JwtPassService } from '../modules/jwt-pass-service/jwt-pass.service';
import { UsersQueryRepository } from '../modules/users/users.queryRepository';

@Injectable()
export class CookieGuard implements CanActivate {
  constructor(
    private blackListService: BlackListService,
    private jwtPassService: JwtPassService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const isChecked = await this.blackListService.getToken(refreshToken);
    const payload = await this.jwtPassService.decodeJwt(refreshToken);
    const user = await this.usersQueryRepository.getUserById(payload.id);
    const verify = await this.jwtPassService.verifyJwt(refreshToken);
    if (isChecked.length > 0 || !verify || !user) {
      throw new UnauthorizedException();
    }

    request.deviceId = payload.deviceId;
    request.user = user;
    return true;
  }
}
