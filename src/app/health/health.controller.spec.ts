import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { HealthCheckResponse } from './types/health-check.response';
import { HealthCheckResult } from '@nestjs/terminus';
import { pingpong } from './types/ping.response';
import { HealthService } from './health.service';

const mockHealthCheckService = {
  check: jest.fn(() => {
    const someResult: HealthCheckResult = {} as HealthCheckResult;
    return someResult;
  }),
};
const mockHttpHealthIndicator = {
  pingCheck: jest.fn(),
};

describe('HealthController', () => {
  let healthController: HealthController;
  let healthService: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthService,
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
        {
          provide: HttpHealthIndicator,
          useValue: mockHttpHealthIndicator,
        },
      ],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
    healthService = module.get<HealthService>(HealthService);
  });

  it('controller should be defined', () => {
    expect(healthController).toBeDefined();
  });

  it('server health check controller', async () => {
    expect(await healthController.checkHealth()).toStrictEqual({});
  });

  it('server ping pong controller', async () => {
    const someResult: pingpong = {
      ok: true,
    };
    jest.spyOn(healthController, 'ping').mockImplementation(async () => {
      return someResult;
    });
    expect(await healthController.ping()).toBe(someResult);
  });
});
