import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { HealthCheckResult } from '@nestjs/terminus';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

const mockHealthCheckService = {
  check: jest.fn(() => {
    const someResult: HealthCheckResult = {} as HealthCheckResult;
    return someResult;
  }),
};
const mockHttpHealthIndicator = {
  pingCheck: jest.fn(),
};

describe('HealthService', () => {
  let healthService: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    healthService = module.get<HealthService>(HealthService);
  });

  it('service should be defined', () => {
    expect(healthService).toBeDefined();
  });

  it('server health check service', async () => {
    expect(await healthService.checkHealth()).toStrictEqual({});
  });
});
