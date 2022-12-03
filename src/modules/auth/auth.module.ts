import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlackList } from '../../entities/black-list.entity';
import { User } from '../../entities/user.entity';
import { LocalStrategy } from '../../strategyes/local.strategy';
import { BlackListService } from '../black-list/black-list.service';
import { JwtPassService } from '../jwt-pass-service/jwt-pass.service';
import { CompileService } from '../users/compile.service';
import { UsersQueryRepository } from '../users/users.queryRepository';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlackList, User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtPassService,
    JwtService,
    UsersService,
    BlackListService,
    LocalStrategy,
    UsersQueryRepository,
    CompileService,
  ],
})
export class AuthModule {}
