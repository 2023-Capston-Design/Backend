import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { DepartmentInterface } from '../interface/department.interface';
import { StudentEntity } from '@app/student/entities/student.entity';
import { InstructorEntity } from '@app/instructor/entities/instructor.entity';

@Entity('department')
export class DepartmentEntity implements DepartmentInterface {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column('varchar', {
    length: 100,
    unique: true,
    nullable: false,
  })
  @ApiProperty()
  name: string;

  @Column('varchar', {
    length: 100,
    nullable: true,
  })
  @ApiProperty()
  phonenumber: string;

  @Column('varchar', {
    length: 100,
    nullable: true,
  })
  @ApiProperty()
  url: string;

  @ApiProperty()
  email: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => StudentEntity, (student) => student.department)
  students: StudentEntity[];

  @OneToMany(() => InstructorEntity, (instructor) => instructor.department)
  instructors: InstructorEntity[];

  constructor(data: DepartmentInterface) {
    Object.assign(this, data);
  }
}
