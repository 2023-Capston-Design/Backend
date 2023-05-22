import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstructorEntity } from '@app/instructor/entities/instructor.entity';
import { DataSource, EntityManager, Repository, UpdateResult } from 'typeorm';
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
import { DepartmentEntity } from '../department/entities/department.entity';
import { DepartmentNotFound } from '@src/infrastructure/errors/department.error';
import { ModifyRequestDto } from '../auth/dto/modify.request';
import { JwtPayload } from '@src/infrastructure/types/jwt.types';

@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(InstructorEntity)
    private readonly instructorRepository: Repository<InstructorEntity>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
    private readonly memberService: MembersService,
    private readonly dataSource: DataSource,
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

    const department = await this.departmentRepository.findOneBy({
      id: departmentId,
    });

    if (!department) {
      throw new DepartmentNotFound();
    }

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

  public async modifyInstructor(
    body: ModifyRequestDto,
    req,
  ): Promise<InstructorEntity> {
    const { user_id }: JwtPayload = req.user;
    const { password, changedpassword, name } = body;

    const changedInstructor = await this.dataSource.transaction(
      async (manager: EntityManager) => {
        const repository = manager.getRepository(InstructorEntity);

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
    return changedInstructor;
  }
}
