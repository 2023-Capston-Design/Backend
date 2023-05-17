import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from '../student/entities/student.entity';
import { Repository } from 'typeorm';
import { InstructorEntity } from '../instructor/entities/instructor.entity';
import {
  DuplicatedEmail,
  DuplicatedStudentId,
} from '@src/infrastructure/errors/members.errors';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    @InjectRepository(InstructorEntity)
    private readonly instructorRepository: Repository<InstructorEntity>,
  ) { }

  public async validateStudentId(studentId: string): Promise<void> {
    const countStudentId = await this.studentRepository.count({
      where: {
        studentId,
      },
    });
    if (countStudentId > 0) {
      throw new DuplicatedStudentId();
    }
  }
  public async validateEmail(email: string): Promise<void> {
    const studentValidate = await this.studentRepository.count({
      where: {
        email,
      },
    });

    const instructorValidate = await this.instructorRepository.count({
      where: {
        email,
      },
    });

    if (studentValidate > 0 && instructorValidate > 0) {
      throw new DuplicatedEmail();
    }
  }
}
