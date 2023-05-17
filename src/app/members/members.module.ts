import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstructorEntity } from '@app/instructor/entities/instructor.entity';
import { StudentEntity } from '../student/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InstructorEntity, StudentEntity])],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule { }
