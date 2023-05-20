import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from '@app/student/entities/student.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { StudentProfileResponse } from '@app/student/dto/student-profile.response';
import {
  MemberNotFound,
  DuplicatedStudentId,
  DuplicatedEmail,
} from '@infrastructure/errors/members.errors';
import { StudentCreateDto } from './dto/student-create.request';
import { Role } from '@src/infrastructure/enum/role.enum';
import { MembersService } from '../members/members.service';
import { DepartmentService } from '../department/department.service';
import { DEPARTMENT_ERROR } from '@src/infrastructure/errors/department.error';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    private readonly memberService: MembersService,
    private readonly dataSource: DataSource,
    private readonly departmentService: DepartmentService,
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
    const department = await this.departmentService.getDepartmentById(
      departmentId,
    );
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
}
