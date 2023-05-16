import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MemberInterface } from './member.interface';
import { Role } from '@infrastructure/enum/role.enum';
import { Sex } from '@infrastructure/enum/sex.enum';

export abstract class Member implements MemberInterface {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column('varchar', {
    length: 100,
    unique: true,
    nullable: false,
  })
  @ApiProperty()
  email: string;

  @Column('varchar', {
    length: 100,
    nullable: false,
  })
  @ApiProperty()
  name: string;

  @Column('varchar', {
    length: 100,
    nullable: false,
  })
  @ApiProperty()
  password: string;

  @Column('enum', {
    enum: Sex,
    nullable: false,
  })
  @ApiProperty()
  sex: Sex;

  @Column('enum', {
    enum: Role,
    nullable: false,
  })
  @ApiProperty()
  role: Role;

  @Column('date', {
    nullable: true,
  })
  @ApiProperty()
  birth?: Date;

  @Column('varchar', {
    nullable: true,
  })
  @ApiProperty()
  profileImageURL?: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
