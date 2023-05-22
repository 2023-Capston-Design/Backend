import { Module } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstructorEntity } from '@app/instructor/entities/instructor.entity';
import { StudentEntity } from '../student/entities/student.entity';
import { MembersModule } from '../members/members.module';
import { DepartmentModule } from '../department/department.module';
import { DepartmentEntity } from '../department/entities/department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InstructorEntity, DepartmentEntity]),
    MembersModule,
  ],
  providers: [InstructorService],
  controllers: [InstructorController],
  exports: [InstructorService],
})
export class InstructorModule { }
