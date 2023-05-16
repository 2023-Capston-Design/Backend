import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { DepartmentInterface } from './department.interface';

@Entity()
export class Department implements DepartmentInterface {
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
  number?: string;

  @Column('varchar', {
    length: 100,
    nullable: true,
  })
  @ApiProperty()
  url?: string;

  @ApiProperty()
  email?: string;

  constructor(data: DepartmentInterface) {
    Object.assign(this, data);
  }
}
