import { Role } from '@infrastructure/enum/role.enum';
import { Sex } from '@infrastructure/enum/sex.enum';
import { DepartmentEntity } from '@src/app/department/entities/department.entity';

export interface MemberInterface {
  email: string;
  name: string;
  password: string;
  sex: Sex;
  role: Role;
  birth?: Date;
  profileImageURL?: string;
  departmentId: number;
  department: DepartmentEntity;
}
