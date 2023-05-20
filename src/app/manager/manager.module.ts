import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerEntity } from './entities/manager.entity';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [TypeOrmModule.forFeature([ManagerEntity]), MembersModule],
  providers: [ManagerService],
  controllers: [ManagerController],
  exports: [ManagerService],
})
export class ManagerModule { }
