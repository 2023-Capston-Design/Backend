import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { LoginRequest } from '@src/app/auth/dto/login.request';
import { WithdrawRequest } from '@src/app/auth/dto/withdraw.request';
import { ManagerCreateDto } from '@src/app/manager/dto/manager-create.request';
import { ManagerEntity } from '@src/app/manager/entities/manager.entity';
import { Role } from '@src/infrastructure/enum/role.enum';
import { Sex } from '@src/infrastructure/enum/sex.enum';
import * as request from 'supertest';
import { bearerFormat } from './util';
import { ModifyRequestDto } from '@src/app/auth/dto/modify.request';

describe('E2E Scenario2 : Enroll new Manager', () => {
  let app: INestApplication;
  let newManager: ManagerEntity;
  const mockManager: ManagerCreateDto = {
    email: 'manager2@gmail.com',
    name: 'manager',
    password: 'password',
    sex: Sex.MALE,
    role: Role.MANAGER,
    birth: new Date(),
    profileImageURL: 'URL',
  };
  const changedManagerName = 'changedManagerName';
  const changedManagerPassword = 'changedpassword';
  let mockManagerToken: string;

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

  describe('Create Manager', () => {
    it('POST /auth/join', async () => {
      /**
       * Set header : Accept, application/json
       *
       */
      const response = await request(app.getHttpServer())
        .post('/auth/join')
        .set('Accept', 'application/json')
        .send(mockManager);
      expect(response.status).toEqual(201);
      expect(response.body.email).toEqual(mockManager.email);
      newManager = response.body;
    });
  });

  describe('Get Manager', () => {
    it('GET /manager/:id', async () => {
      const response = await request(app.getHttpServer()).get(
        `/manager/${newManager.id}`,
      );
      expect(response.status).toEqual(200);
      expect(response.body.email).toEqual(newManager.email);
    });
  });

  describe('Modify Manager', () => {
    it('POST /auth/login', async () => {
      const loginReq: LoginRequest = {
        email: mockManager.email,
        password: mockManager.password,
        role: Role.MANAGER,
      };
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send(loginReq);
      expect(response.status).toEqual(201);
      expect(response.body.accessToken).not.toBeUndefined();
      mockManagerToken = response.body.accessToken;
    });

    it('PATCH /auth/modify', async () => {
      const modifyReq: ModifyRequestDto = {
        password: mockManager.password,
        changedpassword: changedManagerPassword,
        name: changedManagerName,
      };
      const response = await request(app.getHttpServer())
        .patch('/auth/modify')
        .set('Accept', 'application/json')
        .set('Authorization', bearerFormat(mockManagerToken))
        .send(modifyReq);
      expect(response.status).toEqual(200);
    });

    it('GET /manager/:id', async () => {
      const response = await request(app.getHttpServer()).get(
        `/manager/${newManager.id}`,
      );
      expect(response.status).toEqual(200);
      expect(response.body.name).toEqual(changedManagerName);
    });
  });

  describe('Withdraw Manager', () => {
    it('DELETE /auth/withdraw', async () => {
      const withdrawReq: WithdrawRequest = {
        password: changedManagerPassword,
      };
      const response = await request(app.getHttpServer())
        .delete('/auth/withdraw')
        .set('Authorization', bearerFormat(mockManagerToken))
        .send(withdrawReq);
      expect(response.status).toEqual(200);
    });
  });
});
