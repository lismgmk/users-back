import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { JwtPassService } from '../jwt-pass-service/jwt-pass.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtPassService: JwtPassService,
    private configService: ConfigService,
    private usersService: UsersService,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  async registration(dto: CreateUserDto) {
    await this.usersService.createUser(dto);
  }

  async getRefreshAccessToken(userId: string) {
    const expiredAccess = this.configService.get<string>('EXPIRED_ACCESS');
    const expiredRefresh = this.configService.get<string>('EXPIRED_REFRESH');

    const accessToken = await this.jwtPassService.createJwt(
      userId,
      expiredAccess,
    );
    const refreshToken = await this.jwtPassService.createJwt(
      userId,
      expiredRefresh,
    );
    return { accessToken, refreshToken };
  }
}
