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

  @Column('varchar', {
    length: 100,
    nullable: true,
  })
  @ApiProperty()
  email: string;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @OneToMany(() => StudentEntity, (student) => student.department)
  students: StudentEntity[];

  @ApiProperty()
  @OneToMany(() => InstructorEntity, (instructor) => instructor.department)
  instructors: InstructorEntity[];

  constructor(data: DepartmentInterface) {
    Object.assign(this, data);
  }
}
