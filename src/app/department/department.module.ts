import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentEntity } from './entities/department.entity';
import { StudentEntity } from '../student/entities/student.entity';
import { ManagerEntity } from '../manager/entities/manager.entity';
import { InstructorEntity } from '../instructor/entities/instructor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DepartmentEntity,
      StudentEntity,
      ManagerEntity,
      InstructorEntity,
    ]),
  ],
  providers: [DepartmentService],
  exports: [DepartmentService],
  controllers: [DepartmentController],
})
export class DepartmentModule { }
