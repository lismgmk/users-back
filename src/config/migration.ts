import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { path } from 'app-root-path';
import dotenv from 'dotenv';
config();

const env = process.env.NODE_ENV;
const dotenv_path = `${path}/env/.env.${env}`;

const result = dotenv.config({ path: dotenv_path });
if (result.error) {
  /* do nothing */
}
export const migrationTypeOrmConfig = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [`${path}/src/migrations/**/*{.ts,.js}`],
  migrationsTableName: 'custom_migration_table',
});
