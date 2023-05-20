import { Injectable } from '@nestjs/common';
import { ManagerCreateDto } from './dto/manager-create.request';
import { ManagerEntity } from './entities/manager.entity';
import { MembersService } from '../members/members.service';
import { DataSource, EntityManager } from 'typeorm';
import { ManagerProfileResponse } from './dto/manager-profile.response';

@Injectable()
export class ManagerService {
  constructor(
    private readonly memberService: MembersService,
    private readonly dataSource: DataSource,
  ) { }

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
