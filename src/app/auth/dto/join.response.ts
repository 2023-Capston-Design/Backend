import { InstructorProfileRepsonse } from '@src/app/instructor/dto/instructor-profile.response';
import { StudentProfileResponse } from '@src/app/student/dto/student-profile.response';

export type JoinResponse = StudentProfileResponse | InstructorProfileRepsonse;
