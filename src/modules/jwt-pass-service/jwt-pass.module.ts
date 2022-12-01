import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPassService } from './jwt-pass.service';

@Module({
  controllers: [],
  providers: [JwtPassService, JwtService],
})
export class JwtPassModule {}
