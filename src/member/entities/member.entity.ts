import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MemberInterface } from '../interface/member';
import { IsDate, IsOptional, IsString } from 'class-validator';

@Entity('member')
export class Member implements MemberInterface {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column('varchar', {
    length: 100,
    unique: true,
    nullable: false,
  })
  @ApiProperty()
  @IsString()
  email: string;

  @Column('varchar', {
    length: 100,
    nullable: false,
  })
  @ApiProperty()
  @IsString()
  name: string;

  @Column('varchar', {
    length: 100,
    nullable: false,
  })
  @ApiProperty()
  @IsString()
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
  @IsOptional()
  @IsDate()
  birth?: Date;

  @Column('varchar', {
    nullable: true,
  })
  @ApiProperty()
  @IsOptional()
  @IsDate()
  profileImageURL?: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  constructor(data: Member) {
    Object.assign(this, data);
  }
}
