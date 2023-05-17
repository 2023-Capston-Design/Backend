import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';

@Module({
  providers: [DepartmentService],
  exports: [DepartmentService],
  controllers: [DepartmentController],
})
export class DepartmentModule { }
