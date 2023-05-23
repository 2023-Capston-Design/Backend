import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentEntity } from './entities/department.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { DepartmentCreateDto } from './dto/department-create.request';
import {
  DepartmentNotFound,
  DuplicatedDepartmentName,
  MemberStillBelongsToDepartment,
} from '@src/infrastructure/errors/department.error';
import { DepartmentDeleteRequest } from './dto/department-delete.request';
import { DepartmentModifyDto } from './dto/department-modify.request';

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
    const departments = await this.departmentRepository.find({
      skip: page - 1,
      take: pagesize,
      relations: {
        instructors: true,
        students: true,
      },
    });
    return departments;
  }

  public async getDepartmentById(id: number): Promise<DepartmentEntity> {
    const department = await this.departmentRepository.findOne({
      where: {
        id,
      },
      relations: {
        instructors: true,
        students: true,
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

  public async modifyDepartment(body: DepartmentModifyDto): Promise<boolean> {
    const getDepartment = await this.departmentRepository.findOne({
      where: {
        id: body.departmentId,
      },
    });
    if (!getDepartment) {
      throw new DepartmentNotFound();
    }

    await this.dataSource.transaction(async (manager: EntityManager) => {
      const repository = manager.getRepository(DepartmentEntity);
      await repository.save({
        id: body.departmentId,
        phonenumber: body.phonenumber
          ? body.phonenumber
          : getDepartment.phonenumber,
        url: body.url ? body.url : getDepartment.url,
        email: body.email ? body.email : getDepartment.email,
      });
    });
    return true;
  }

  public async withdrawDepartment(
    body: DepartmentDeleteRequest,
  ): Promise<boolean> {
    const getDepartment = await this.departmentRepository.findOne({
      where: {
        id: body.departmentId,
      },
      relations: {
        students: true,
        instructors: true,
      },
    });

    if (!getDepartment) {
      throw new DepartmentNotFound();
    }

    if (
      getDepartment.students.length > 0 ||
      getDepartment.instructors.length > 0
    ) {
      throw new MemberStillBelongsToDepartment();
    }
    await this.departmentRepository.delete({
      id: body.departmentId,
    });
    return true;
  }
}
