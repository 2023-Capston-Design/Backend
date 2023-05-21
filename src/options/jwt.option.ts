import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const jwtOptions: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  global: true,
  useFactory: (configService: ConfigService) => {
    const issuer = configService.get<string>('ISSUER', 'hoplin');
    return {
      secret: configService.get<string>('TOKEN_SECRET', ''),
      verifyOptions: {
        issuer,
      },
      signOptions: {
        issuer,
      },
    };
  },
};
