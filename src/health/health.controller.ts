import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import databaseConfig from 'src/config/config/database.config';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) { }

  @Get()
  @HealthCheck()
  public async checkHealth() {
    return this.health.check([
      () =>
        this.http.pingCheck(
          'google.com',
          'https://www.google.co.kr/?client=safari',
        ),
    ]);
  }
}
