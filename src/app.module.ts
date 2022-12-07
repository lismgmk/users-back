import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configRoot } from './config/configuration';
import { typeOrmConfigAsync } from './config/ormconfig';
import { AuthModule } from './modules/auth/auth.module';
import { BlackListModule } from './modules/black-list/black-list.module';
import { JwtPassModule } from './modules/jwt-pass-service/jwt-pass.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(configRoot),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    UsersModule,
    AuthModule,
    JwtPassModule,
    BlackListModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
