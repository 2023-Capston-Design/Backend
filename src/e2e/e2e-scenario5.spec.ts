import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { LoginRequest } from '@src/app/auth/dto/login.request';
import { ManagerCreateDto } from '@src/app/manager/dto/manager-create.request';
import { ManagerEntity } from '@src/app/manager/entities/manager.entity';
import { Role } from '@src/infrastructure/enum/role.enum';
import { Sex } from '@src/infrastructure/enum/sex.enum';
import { AUTH_ERROR } from '@src/infrastructure/errors/auth.error';
import * as request from 'supertest';
import { bearerFormat } from './util';
import { WithdrawRequest } from '@src/app/auth/dto/withdraw.request';
import { pingpong } from '@src/app/health/types/ping.response';

describe('E2E Scenario5 : Health Check and Send Mail', () => {
  let app: INestApplication;
  const testEamil = 'jhoplin7259@gmail.com';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    app.close();
  });

  describe('Health Check', () => {
    it('GET /health/server', async () => {
      const response = await request(app.getHttpServer()).get('/health/server');
      expect(response.status).toEqual(200);
    });

    it('GET /health/ping', async () => {
      const estimateRes: pingpong = {
        ok: true,
      };
      const response = await request(app.getHttpServer()).get('/health/ping');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(estimateRes);
    });
  });

  describe('Send Mail', () => {
    it('GET /mail/validate-request', async () => {
      const response = await request(app.getHttpServer()).get(
        `/mail/validate-request?to=${testEamil}`,
      );
      expect(response.status).toEqual(200);
    });
  });
});
