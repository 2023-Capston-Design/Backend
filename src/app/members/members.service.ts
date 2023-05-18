import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from '../student/entities/student.entity';
import { Repository } from 'typeorm';
import { InstructorEntity } from '../instructor/entities/instructor.entity';
import {
  DuplicatedEmail,
  DuplicatedStudentId,
} from '@src/infrastructure/errors/members.errors';
import { InvalidPassword } from '@infrastructure/errors/auth.error';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class MembersService {
  private readonly hashCycle: number = 12;
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

    if (studentValidate > 0 || instructorValidate > 0) {
      throw new DuplicatedEmail();
    }
  }

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.hashCycle);
  }

  public async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    const result = await bcrypt.compare(password, hashedPassword);
    if (!result) {
      throw new InvalidPassword();
    }
  }
}
