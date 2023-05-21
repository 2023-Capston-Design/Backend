import { DepartmentEntity } from '@src/app/department/entities/department.entity';

export interface DepartmentInfoInterface {
  departmentId: number;
  department: DepartmentEntity;
}
