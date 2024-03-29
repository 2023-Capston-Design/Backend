import { Member } from '@infrastructure/abstract-entities/member.abstract';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { InstructorInterface } from '../interface/instructor.interface';
import { ApiProperty } from '@nestjs/swagger';
import { DepartmentEntity } from '@app/department/entities/department.entity';

@Entity('instructor')
export class InstructorEntity
  extends Member
  implements Omit<InstructorInterface, 'departmentId'>
{
  @Column('varchar', {
    nullable: true,
  })
  @ApiProperty()
  laboratory?: string;

  @ApiProperty()
  @ManyToOne(() => DepartmentEntity, (department) => department.instructors, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'department_id',
  })
  department: DepartmentEntity;

  constructor(
    datas: Omit<InstructorInterface, 'id' | 'createdAt' | 'updatedAt' | 'role'>,
  ) {
    super();
    Object.assign(this, datas);
  }
}
