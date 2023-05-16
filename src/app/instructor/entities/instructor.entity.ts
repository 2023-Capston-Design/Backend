import { Member } from '@infrastructure/abstract-entities/member.abstract';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { InstructorInterface } from '../interface/instructor.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Department } from '@app/department/entities/department.entity';

@Entity('instructor')
export class Instructor extends Member implements InstructorInterface {
  @Column('varchar', {
    nullable: true,
  })
  @ApiProperty()
  laboratory?: string;

  @ManyToOne(() => Department)
  @JoinColumn({
    name: 'department_id',
  })
  departmentId: number;

  constructor(
    datas: Omit<InstructorInterface, 'id' | 'createdAt' | 'updatedAt' | 'role'>,
  ) {
    super();
    Object.assign(this, datas);
  }
}
