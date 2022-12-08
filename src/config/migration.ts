import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { BlackList } from '../entities/black-list.entity';
import { User } from '../entities/user.entity';

import { config } from 'dotenv';
// import * as path from 'path';
import * as dotenv from 'dotenv';
import { path } from 'app-root-path';
config();

const env = process.env.NODE_ENV;
const dotenv_path = `${path}/env/.env.${env}`;
console.log('!!!!!!!', dotenv_path);

const result = dotenv.config({ path: dotenv_path });
if (result.error) {
  /* do nothing */
}

// const configService = new ConfigService();
export const migrationTypeOrmConfig = new DataSource({
  //  const migrationTypeOrmConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  // type: 'postgres',
  // host: configService.get('POSTGRES_HOST'),
  // port: parseInt(configService.get('POSTGRES_PORT')),
  // username: configService.get('POSTGRES_USER'),
  // password: process.env.POSTGRES_PASSWORD,
  // database: configService.get('POSTGRES_DB'),
  // // entities: ['dist/**/*.entity{.ts,.js}'],
  entities: [BlackList, User],
  // synchronize: false,
  // migrations: [__dirname, '/src/migrations/**/*{.ts,.js}'],
  // migrationsTableName: 'custom_migration_table',
  // };
});
