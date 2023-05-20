import { InstructorCreateDto } from '@src/app/instructor/dto/instructor-create.request';
import { ManagerCreateDto } from '@src/app/manager/dto/manager-create.request';
import { StudentCreateDto } from '@src/app/student/dto/student-create.request';

export type JoinRequest =
  | StudentCreateDto
  | InstructorCreateDto
  | ManagerCreateDto;
