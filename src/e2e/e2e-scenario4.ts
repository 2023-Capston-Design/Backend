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
import { StudentEntity } from '@src/app/student/entities/student.entity';
import { StudentCreateDto } from '@src/app/student/dto/student-create.request';
import { InstructorCreateDto } from '@src/app/instructor/dto/instructor-create.request';
import { DepartmentEntity } from '@src/app/department/entities/department.entity';
import { DepartmentCreateDto } from '@src/app/department/dto/department-create.request';

describe('E2E Scenario4 : Enroll new Manager, generate department, enroll new Instructor', () => {
  let app: INestApplication;

  // Mocked Manager
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

  // Mocked Student
  let newInstructor: StudentEntity;
  const mockInstructor: Omit<InstructorCreateDto, 'department'> = {
    email: 'jsnbs@naver.com',
    name: '김병서',
    password: 'password',
    sex: Sex.MALE,
    role: Role.INSTRUCTOR,
    departmentId: 0,
    birth: new Date(),
    profileImageURL: 'URL',
  };
  const changedInstructorName = 'changedStudentName';
  const changedInstructorPassword = 'changedpassword';

  // Mocked Department
  let newDepartment: DepartmentEntity;
  const mockDepartment: DepartmentCreateDto = {
    name: 'Hongik DSC2',
    email: 'dschongik@gmail.com',
    phonenumber: '02-1234-5678',
    url: 'URL',
  };

  // Bearer authorization token
  let mockManagerToken: string;
  let mockStudentToken: string;

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
      mockStudentToken = response.body.accessToken;
    });
  });

  describe('Create new department', () => {
    it('POST /department', async () => {
      const response = await request(app.getHttpServer())
        .post('/department')
        .set('Authorization', bearerFormat(mockManagerToken))
        .set('Accept', 'application/json')
        .send(mockDepartment);

      expect(response.status).toEqual(201);
      newDepartment = response.body;
    });

    it('GET /department/:id', async () => {
      const response = await request(app.getHttpServer()).get(
        `/department/${newDepartment.id}`,
      );
      expect(response.status).toEqual(200);
      expect(response.body.name).toEqual(newDepartment.name);
    });
  });

  describe('Withdraw Manager and login', () => {
    it('DELETE /auth/withdraw', async () => {
      const withdrawReq: WithdrawRequest = {
        password: mockManager.password,
      };
      const response = await request(app.getHttpServer())
        .delete('/auth/withdraw')
        .set('Authorization', bearerFormat(mockManagerToken))
        .send(withdrawReq);
      expect(response.status).toEqual(200);
    });
  });
});
