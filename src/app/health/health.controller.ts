import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckResult } from '@nestjs/terminus';
import databaseConfig from '@app/config/config/database.config';
import { pingpong } from './types/ping.response';
import { HealthService } from './health.service';

@ApiTags('Health Checker')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) { }

  @Get('server')
  @HealthCheck() // It add swagger option automatically : https://github.com/nestjs/terminus/blob/master/lib/health-check/health-check.decorator.ts
  public async checkHealth(): Promise<Promise<HealthCheckResult>> {
    return await this.healthService.checkHealth();
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
