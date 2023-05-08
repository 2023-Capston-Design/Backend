import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import databaseConfig from 'src/config/config/database.config';
import { pingpong } from './types/ping.response';
@ApiTags('Health Checker')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) { }

  @Get('server')
  @HealthCheck() // It add swagger option automatically : https://github.com/nestjs/terminus/blob/master/lib/health-check/health-check.decorator.ts
  public async checkHealth(): Promise<HealthCheckResult> {
    return this.health.check([
      () =>
        this.http.pingCheck(
          'google.com',
          'https://www.google.co.kr/?client=safari',
        ),
    ]);
  }

  @Get('ping')
  @ApiOkResponse({
    description: 'Ping pong',
    type: pingpong,
  })
  public async ping(): Promise<pingpong> {
    return {
      ok: true,
    };
  }
}
