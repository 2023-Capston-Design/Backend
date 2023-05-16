import { Member } from '@infrastructure/abstract-entities/member.abstract';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { StudentInterface } from '../interface/student.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Department } from '@app/department/entities/department.entity';

@Entity('student')
export class Student extends Member implements StudentInterface {
  @Column('varchar', {
    nullable: false,
  })
  @ApiProperty()
  studentId: string;

  @ManyToOne(
    () => Department,
    (department) => {
      department.students;
    },
    {
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  )
  @JoinColumn({
    name: 'department_id',
  })
  @ApiProperty()
  departmentId: number;

  constructor(
    datas: Omit<StudentInterface, 'id' | 'createdAt' | 'updatedAt' | 'role'>,
  ) {
    super();
    Object.assign(this, datas);
  }
}
