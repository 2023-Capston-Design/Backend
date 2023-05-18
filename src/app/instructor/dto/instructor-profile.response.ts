import { Role } from '@src/infrastructure/enum/role.enum';
import { Sex } from '@src/infrastructure/enum/sex.enum';
import { InstructorInterface } from '../interface/instructor.interface';
import { ApiProperty } from '@nestjs/swagger';
import { InstructorEntity } from '../entities/instructor.entity';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class InstructorProfileRepsonse implements InstructorInterface {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  laboratory?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    enum: Sex,
  })
  @IsNotEmpty()
  @IsEnum(Sex)
  sex: Sex;

  @ApiProperty({
    enum: Role,
  })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role.INSTRUCTOR;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  birth: Date;

  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  profileImageURL?: string;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  public getInstructorId() {
    return this.id;
  }

  constructor(instructor: InstructorEntity) {
    Object.assign(this, instructor);
  }
  password: string;
}
