import { INestApplication } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthCheckResult } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';
import { HealthModule } from './health.module';
import * as request from 'supertest';
import { pingpong } from './types/ping.response';

describe('Health Check', () => {
  let app: INestApplication;
  const healthService = {
    checkHealth: async () => {
      return {
        status: 'ok',
        info: {
          'google.com': {
            status: 'up',
          },
        },
        error: {},
        details: {
          'google.com': {
            status: 'up',
          },
        },
      };
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HealthModule],
    })
      .overrideProvider(HealthService)
      .useValue(healthService)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('GET /health/server', async () => {
    return request(app.getHttpServer())
      .get('/health/server')
      .expect(200)
      .expect(await healthService.checkHealth());
  });

  it('GET /health/ping', async () => {
    return request(app.getHttpServer())
      .get('/health/ping')
      .expect(200)
      .expect({
        ok: true,
      } as pingpong);
  });

  afterAll(async () => {
    await app.close();
  });
});
