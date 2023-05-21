import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

export const typeORMConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService): DataSourceOptions => ({
    type: 'mysql',
    host: configService.get('DATABASE_HOST'),
    port: +configService.get('DATABASE_PORT'),
    username: configService.get('DATABASE_USER'),
    password: configService.get('DATABASE_PASSWORD') as string,
    entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
    synchronize: process.env.API_MODE === 'development',
    database: configService.get('DATABASE_DEFAULT'),
  }),
  inject: [ConfigService],
};
