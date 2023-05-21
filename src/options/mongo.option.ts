import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

export const mongooseConfig: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const user = configService.get<string>('MONGO_USER');
    const password = configService.get<string>('MONGO_PASSWORD');
    const host = configService.get<string>('MONGO_HOST');
    const port = configService.get<string>('MONGO_PORT');
    const uri = `mongodb://${user}:${password}@${host}:${port}`;
    return {
      uri,
    };
  },
};
