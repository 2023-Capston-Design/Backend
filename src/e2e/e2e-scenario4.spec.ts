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
import { DepartmentDeleteRequest } from '@src/app/department/dto/department-delete.request';

describe('E2E Scenario4 : Enroll new Manager, generate department, enroll new Instructor', () => {
  let app: INestApplication;

  // Mocked Manager
  let newManager: ManagerEntity;
  const mockManager: ManagerCreateDto = {
    email: 'manager3@gmail.com',
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
  let mockInstructorToken: string;

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
      mockManagerToken = response.body.accessToken;
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
      // Change mockInstructor's departmentId
      mockInstructor.departmentId = newDepartment.id;
    });

    it('GET /department/:id', async () => {
      const response = await request(app.getHttpServer()).get(
        `/department/${newDepartment.id}`,
      );
      expect(response.status).toEqual(200);
      expect(response.body.name).toEqual(newDepartment.name);
    });
  });

  describe('Create new student and attempt to login, get access token', () => {
    it('POST /auth/join', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/join')
        .set('Accept', 'application/json')
        .send(mockInstructor);
      expect(response.status).toEqual(201);
      expect(response.body.email).toEqual(mockInstructor.email);
      newInstructor = response.body;
    });

    it('GET /instructor/:id', async () => {
      const response = await request(app.getHttpServer()).get(
        `/instructor/${newInstructor.id}`,
      );
      expect(response.status).toEqual(200);
      expect(response.body.email).toEqual(newInstructor.email);
    });

    it('POST /auth/login', async () => {
      const loginReq: LoginRequest = {
        email: newInstructor.email,
        password: mockInstructor.password,
        role: newInstructor.role,
      };
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send(loginReq);
      expect(response.status).toEqual(201);
      expect(response.body.accessToken).not.toBeUndefined();
      mockInstructorToken = response.body.accessToken;
    });
  });

  describe('Modify Instructor', () => {
    it('PATCH /auth/modify', async () => {
      const modifyReq: ModifyRequestDto = {
        password: mockInstructor.password,
        changedpassword: changedInstructorPassword,
        name: changedInstructorName,
      };
      const response = await request(app.getHttpServer())
        .patch('/auth/modify')
        .set('Accept', 'application/json')
        .set('Authorization', bearerFormat(mockInstructorToken))
        .send(modifyReq);
      expect(response.status).toEqual(200);
    });

    it('GET /student/:id', async () => {
      const response = await request(app.getHttpServer()).get(
        `/instructor/${newInstructor.id}`,
      );
      expect(response.status).toEqual(200);
      expect(response.body.name).toEqual(changedInstructorName);
    });
  });

  describe('Delete mock manager, instructor, department', () => {
    it('DELETE /auth/withdraw - instructor', async () => {
      const withdrawReq: WithdrawRequest = {
        password: changedInstructorPassword,
      };
      const response = await request(app.getHttpServer())
        .delete('/auth/withdraw')
        .set('Authorization', bearerFormat(mockInstructorToken))
        .send(withdrawReq);
      expect(response.status).toEqual(200);
    });

    // Department에 지정된 사람이 아무도 없어야 하므로 뒤로
    it('DELETE /department/withdraw - department', async () => {
      const withdrawReq: DepartmentDeleteRequest = {
        departmentId: newDepartment.id,
      };
      const response = await request(app.getHttpServer())
        .delete('/department/withdraw')
        .set('Authorization', bearerFormat(mockManagerToken))
        .send(withdrawReq);
      expect(response.status).toEqual(200);
    });

    it('DELETE /auth/withdraw - manager', async () => {
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
