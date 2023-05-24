import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { pingpong } from '@src/app/health/types/ping.response';
import { DEPARTMENT_ERROR } from '@src/infrastructure/errors/department.error';
import { MEMBER_ERROR } from '@src/infrastructure/errors/members.errors';
import * as request from 'supertest';

describe("E2E Scenario1 : Check basic getter API and it's exceptions", () => {
  let app: INestApplication;

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

  describe('Health API', () => {
    it('GET /health/ping', () => {
      return request(app.getHttpServer())
        .get('/health/ping')
        .expect(200)
        .expect({
          ok: true,
        } as pingpong);
    });
  });

  describe('Department API', () => {
    it('GET /department', async () => {
      return await request(app.getHttpServer())
        .get('/department')
        .expect(200)
        .expect([]);
    });

    it('GET /department/:id', async () => {
      const response = await request(app.getHttpServer()).get(
        '/department/10000',
      );
      expect(response.status).toBe(400);
      expect(response.body.error).toBe(DEPARTMENT_ERROR.DEPARTMENT_NOT_FOUND);
    });
  });

  describe('Student API', () => {
    it('GET /student', async () => {
      return await request(app.getHttpServer())
        .get('/student')
        .expect(200)
        .expect([]);
    });

    it('GET /student/:id', async () => {
      const response = await request(app.getHttpServer()).get('/student/10000');
      expect(response.status).toBe(400);
      expect(response.body.error).toBe(MEMBER_ERROR.MEMBER_NOT_FOUND);
    });
  });

  describe('Instructor API', () => {
    it('GET /instructor', async () => {
      return await request(app.getHttpServer())
        .get('/instructor')
        .expect(200)
        .expect([]);
    });

    it('GET /instructor/:id', async () => {
      const response = await request(app.getHttpServer()).get(
        '/instructor/10000',
      );
      expect(response.status).toBe(400);
      expect(response.body.error).toBe(MEMBER_ERROR.MEMBER_NOT_FOUND);
    });
  });

  describe('Manager API', () => {
    it('GET /manager', async () => {
      return await request(app.getHttpServer())
        .get('/manager')
        .expect(200)
        .expect([]);
    });
    it('GET /manager/:id', async () => {
      const response = await request(app.getHttpServer()).get('/manager/10000');
      expect(response.status).toBe(400);
      expect(response.body.error).toBe(MEMBER_ERROR.MEMBER_NOT_FOUND);
    });
  });
});
