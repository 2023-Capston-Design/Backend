import { MemberInterface } from '@infrastructure/abstract-entities/member.interface';
import { DepartmentInfoInterface } from '@src/infrastructure/abstract-entities/department-info.interface';
import { Column } from 'typeorm';

export interface InstructorInterface
  extends MemberInterface,
  DepartmentInfoInterface {
  laboratory?: string;
}
