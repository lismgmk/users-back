import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { JwtPassService } from '../jwt-pass-service/jwt-pass.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    // private jwtPassService: JwtPassService,
    // private configService: ConfigService,
    private usersService: UsersService,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  async registration(dto: CreateUserDto) {
    const checkExistUser = await this.usersService.getUserByEmaiFirstName({
      firstName: dto.firstName,
      email: dto.firstName,
    });
    if (checkExistUser) {
      throw new NotFoundException();
    }
    await this.usersService.createUser(dto);
  }
}
