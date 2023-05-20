import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerEntity } from './entities/manager.entity';
import { MembersModule } from '../members/members.module';
import { InstructorEntity } from '../instructor/entities/instructor.entity';
import { StudentEntity } from '../student/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentEntity, ManagerEntity, InstructorEntity]),
    MembersModule,
  ],
  providers: [ManagerService],
  controllers: [ManagerController],
  exports: [ManagerService],
})
export class ManagerModule { }
