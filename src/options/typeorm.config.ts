import { Inject } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import databaseConfig from 'src/config/config/database.config';
import { DataSource, DataSourceOptions } from 'typeorm';

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
