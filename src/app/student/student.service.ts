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

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    private readonly memberService: MembersService,
    private readonly dataSource: DataSource,
  ) { }

  public async getStudentInformationById(
    id: number,
  ): Promise<StudentProfileResponse> {
    const student = await this.studentRepository.findOneBy({ id });
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
    });
    return students.map((x) => new StudentProfileResponse(x));
  }

  public async createStudent(
    data: StudentCreateDto,
  ): Promise<StudentProfileResponse> {
    const { email, studentId } = data;
    await this.memberService.validateStudentId(studentId);
    await this.memberService.validateEmail(email);

    // Apply transaction while saving
    const newStudent = await this.dataSource.transaction(
      async (manager: EntityManager) => {
        return await this.studentRepository.save({
          ...data,
          role: Role.STUDENT,
        });
      },
    );

    return new StudentProfileResponse(newStudent);
  }
}
