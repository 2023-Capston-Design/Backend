import { Module } from '@nestjs/common';
import { InstructorService } from './instructor.service';

@Module({
  providers: [InstructorService]
})
export class InstructorModule {}
