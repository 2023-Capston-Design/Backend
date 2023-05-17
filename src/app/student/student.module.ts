import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentEntity } from '@app/student/entities/student.entity';
import { StudentController } from './student.controller';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [TypeOrmModule.forFeature([StudentEntity]), MembersModule],
  providers: [StudentService],
  controllers: [StudentController],
  exports: [StudentService],
})
export class StudentModule { }
