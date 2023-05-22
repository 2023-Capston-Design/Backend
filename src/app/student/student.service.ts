import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from '@app/student/entities/student.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { StudentProfileResponse } from '@app/student/dto/student-profile.response';
import { MemberNotFound } from '@infrastructure/errors/members.errors';
import { StudentCreateDto } from './dto/student-create.request';
import { Role } from '@src/infrastructure/enum/role.enum';
import { MembersService } from '../members/members.service';
import {
  DEPARTMENT_ERROR,
  DepartmentNotFound,
} from '@src/infrastructure/errors/department.error';
import { DepartmentEntity } from '../department/entities/department.entity';
import { ModifyRequestDto } from '../auth/dto/modify.request';
import { JwtPayload } from '@src/infrastructure/types/jwt.types';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
    private readonly memberService: MembersService,
    private readonly dataSource: DataSource,
  ) { }

  public async getStudentInformationById(
    id: number,
  ): Promise<StudentProfileResponse> {
    const student = await this.studentRepository.findOne({
      where: {
        id,
      },
      relations: {
        department: true,
      },
    });
    if (!student) {
      throw new MemberNotFound();
    }
    return new StudentProfileResponse(student);
  }

  public async getStudentByEmail(
    email: string,
  ): Promise<StudentProfileResponse> {
    const student = await this.studentRepository.findOneBy({
      email,
    });
    if (!student) {
      throw new MemberNotFound();
    }
    return new StudentProfileResponse(student);
  }

  public async getAllStudents(
    page: number,
    pagesize: number,
  ): Promise<StudentProfileResponse[]> {
    const students = await this.studentRepository.find({
      skip: page - 1,
      take: pagesize,
      relations: {
        department: true,
      },
    });
    return students.map((x) => new StudentProfileResponse(x));
  }

  public async createStudent(
    data: StudentCreateDto,
  ): Promise<StudentProfileResponse> {
    const { email, studentId, departmentId } = data;
    await this.memberService.validateStudentId(studentId);
    await this.memberService.validateEmail(email);
    const department = await this.departmentRepository.findOneBy({
      id: departmentId,
    });
    if (!department) {
      throw new DepartmentNotFound();
    }

    data.department = department;
    // Apply transaction while saving
    const newStudent = await this.dataSource.transaction(
      async (manager: EntityManager) => {
        const newStudent = new StudentEntity(data);
        const repository = manager.getRepository(StudentEntity);
        return await repository.save(newStudent);
      },
    );

    return new StudentProfileResponse(newStudent);
  }

  public async modifyStudent(
    body: ModifyRequestDto,
    req,
  ): Promise<StudentEntity> {
    const { user_id }: JwtPayload = req.user;
    const { password, changedpassword, name } = body;
    const changedStudent = await this.dataSource.transaction(
      async (manager: EntityManager) => {
        const repository = manager.getRepository(StudentEntity);

        const getMember = await repository.findOneBy({
          id: user_id,
        });

        await this.memberService.validatePassword(password, getMember.password);
        return await repository.save({
          id: user_id,
          password: changedpassword
            ? await this.memberService.hashPassword(changedpassword)
            : password,
          name: name ? name : getMember.name,
        });
      },
    );
    return changedStudent;
  }
}
