import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstructorEntity } from '@app/instructor/entities/instructor.entity';
import { StudentEntity } from '../student/entities/student.entity';
import { ManagerEntity } from '../manager/entities/manager.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InstructorEntity, StudentEntity, ManagerEntity]),
  ],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule { }
