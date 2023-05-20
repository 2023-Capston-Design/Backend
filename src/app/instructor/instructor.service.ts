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
import { DepartmentService } from '../department/department.service';

@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(InstructorEntity)
    private readonly instructorRepository: Repository<InstructorEntity>,
    private readonly memberService: MembersService,
    private readonly dataSource: DataSource,
    private readonly departmentService: DepartmentService,
  ) { }

  public async getInstructorById(
    id: number,
  ): Promise<InstructorProfileRepsonse> {
    const instructor = await this.instructorRepository.findOne({
      where: {
        id,
      },
      relations: {
        department: true,
      },
    });
    if (!instructor) {
      throw new MemberNotFound();
    }
    return new InstructorProfileRepsonse(instructor);
  }

  public async getInstructorByEmail(
    email: string,
  ): Promise<InstructorProfileRepsonse> {
    const instructor = await this.instructorRepository.findOneBy({ email });
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
      relations: {
        department: true,
      },
    });
    return student.map((x) => new InstructorProfileRepsonse(x));
  }

  public async createInstructor(
    data: InstructorCreateDto,
  ): Promise<InstructorProfileRepsonse> {
    const { email, departmentId } = data;
    await this.memberService.validateEmail(email);
    const department = await this.departmentService.getDepartmentById(
      departmentId,
    );
    data.department = department;
    // Apply transaction while saving
    const newInstructor = await this.dataSource.transaction(
      async (manager: EntityManager) => {
        const newInstructor = new InstructorEntity(data);
        const repository = manager.getRepository(InstructorEntity);
        return await repository.save(newInstructor);
      },
    );
    return new InstructorProfileRepsonse(newInstructor);
  }
}
