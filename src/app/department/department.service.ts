import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentEntity } from './entities/department.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { DepartmentCreateDto } from './dto/department-create.request';
import {
  DepartmentNotFound,
  DuplicatedDepartmentName,
} from '@src/infrastructure/errors/department.error';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
    private readonly dataSource: DataSource,
  ) { }

  public async getAllDepartment(
    page: number,
    pagesize: number,
  ): Promise<DepartmentEntity[]> {
    const departments = await this.departmentRepository.find();
    return departments;
  }

  public async getDepartmentById(id: number): Promise<DepartmentEntity> {
    const department = await this.departmentRepository.findOne({
      where: {
        id,
      },
    });
    if (!department) {
      throw new DepartmentNotFound();
    }
    return department;
  }

  public async createDepartment(
    data: DepartmentCreateDto,
  ): Promise<DepartmentEntity> {
    const department = await this.departmentRepository.findOne({
      where: {
        name: data.name,
      },
    });
    if (department) {
      throw new DuplicatedDepartmentName();
    }
    const newDepartment = await this.dataSource.transaction(
      async (manager: EntityManager) => {
        const repository = manager.getRepository(DepartmentEntity);
        return await repository.save({
          ...data,
        });
      },
    );
    return newDepartment;
  }
}
