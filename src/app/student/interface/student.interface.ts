import { MemberInterface } from '@infrastructure/abstract-entities/member.interface';
import { DepartmentInfoInterface } from '@src/infrastructure/abstract-entities/department-info.interface';

export interface StudentInterface
  extends MemberInterface,
  DepartmentInfoInterface {
  studentId: string;
}
