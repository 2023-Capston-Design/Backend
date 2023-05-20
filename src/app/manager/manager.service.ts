import { Injectable } from '@nestjs/common';
import { ManagerCreateDto } from './dto/manager-create.request';
import { ManagerEntity } from './entities/manager.entity';
import { MembersService } from '../members/members.service';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ManagerProfileResponse } from './dto/manager-profile.response';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberNotFound } from '@src/infrastructure/errors/members.errors';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(ManagerEntity)
    private readonly managerRepository: Repository<ManagerEntity>,
    private readonly memberService: MembersService,
    private readonly dataSource: DataSource,
  ) { }

  public async getAllManager(
    page: number,
    pagesize: number,
  ): Promise<ManagerProfileResponse[]> {
    const managers = await this.managerRepository.find({
      skip: page - 1,
      take: pagesize,
    });
    return managers;
  }

  public async getManagerById(id: number): Promise<ManagerProfileResponse> {
    const manager = await this.managerRepository.findOneBy({ id });
    if (!manager) {
      throw new MemberNotFound();
    }
    return manager;
  }

  public async getManagerByEmail(
    email: string,
  ): Promise<ManagerProfileResponse> {
    const manager = await this.managerRepository.findOneBy({ email });
    if (!manager) {
      throw new MemberNotFound();
    }
    return manager;
  }

  public async createManager(
    data: ManagerCreateDto,
  ): Promise<ManagerProfileResponse> {
    const { email } = data;
    await this.memberService.validateEmail(email);
    const newManager = await this.dataSource.transaction(
      async (manager: EntityManager) => {
        const newManager = new ManagerEntity(data);
        const repository = manager.getRepository(ManagerEntity);
        return await repository.save(newManager);
      },
    );
    return new ManagerProfileResponse(newManager);
  }
}
