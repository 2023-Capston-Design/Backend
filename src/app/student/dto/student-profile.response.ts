import { StudentEntity } from '@app/student/entities/student.entity';
import { StudentInterface } from '@app/student/interface/student.interface';
import { ApiProperty } from '@nestjs/swagger';
import { DepartmentEntity } from '@src/app/department/entities/department.entity';
import { Role } from '@src/infrastructure/enum/role.enum';
import { Sex } from '@src/infrastructure/enum/sex.enum';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class StudentProfileResponse implements StudentInterface {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  studentId: string;

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
  role: Role;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  birth: Date;

  @ApiProperty({
    type: DepartmentEntity,
  })
  department: DepartmentEntity;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  profileImageURL?: string;

  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  departmentId: number;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  public getStudentID() {
    return this.id;
  }

  constructor(student: StudentEntity) {
    Object.assign(this, student);
  }
}
