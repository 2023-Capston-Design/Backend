import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstructorEntity } from '@app/instructor/entities/instructor.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InstructorProfileRepsonse } from './dto/instructor-profile.response';
import {
  DuplicatedEmail,
  MemberNotFound,
} from '@infrastructure/errors/members.errors';
import { StudentEntity } from '../student/entities/student.entity';
import { MembersService } from '../members/members.service';
import { InstructorCreateDto } from './dto/instructor-create.request';
import { Role } from '@src/infrastructure/enum/role.enum';

@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(InstructorEntity)
    private readonly instructorRepository: Repository<InstructorEntity>,
    private readonly memberService: MembersService,
    private readonly dataSource: DataSource,
  ) { }

  public async getInstructorById(
    id: number,
  ): Promise<InstructorProfileRepsonse> {
    const instructor = await this.instructorRepository.findOneBy({ id });
    if (!instructor) {
      throw new MemberNotFound();
    }
    return new InstructorProfileRepsonse(instructor);
  }

  public async getAllInstructors(
    page: number,
    pagesize: number,
  ): Promise<InstructorProfileRepsonse[]> {
    const student = await this.instructorRepository.find({
      skip: page - 1,
      take: pagesize,
    });
    return student.map((x) => new InstructorProfileRepsonse(x));
  }

  public async createInstructor(
    data: InstructorCreateDto,
  ): Promise<InstructorProfileRepsonse> {
    const { email } = data;
    await this.memberService.validateEmail(email);

    // Apply transaction while saving
    const newInstructor = await this.dataSource.transaction(
      async (manager: EntityManager) => {
        return await this.instructorRepository.save({
          ...data,
          role: Role.INSTRUCTOR,
        });
      },
    );
    return new InstructorProfileRepsonse(newInstructor);
  }
}
