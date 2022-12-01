import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { JwtStrategy } from '../../strategyes/jwt.strategy';
import { JwtPassService } from '../jwt-pass-service/jwt-pass.service';
import { UsersController } from './users.controller';
import { UsersQueryRepository } from './users.queryRepository';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtPassService,
    JwtService,
    JwtStrategy,
    UsersQueryRepository,
  ],
})
export class UsersModule {}
