import { Injectable } from '@nestjs/common';
import {
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@Injectable()
export class HealthService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) { }

  public async checkHealth(): Promise<HealthCheckResult> {
    return this.health.check([
      () =>
        this.http.pingCheck(
          'google.com',
          'https://www.google.co.kr/?client=safari',
        ),
    ]);
  }
}
