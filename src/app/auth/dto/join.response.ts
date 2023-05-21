import { InstructorProfileRepsonse } from '@src/app/instructor/dto/instructor-profile.response';
import { ManagerProfileResponse } from '@src/app/manager/dto/manager-profile.response';
import { ManagerEntity } from '@src/app/manager/entities/manager.entity';
import { StudentProfileResponse } from '@src/app/student/dto/student-profile.response';

export type JoinResponse =
  | StudentProfileResponse
  | InstructorProfileRepsonse
  | ManagerProfileResponse;
