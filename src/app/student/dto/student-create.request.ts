import { StudentInterface } from '@app/student/interface/student.interface';
import { ApiProperty } from '@nestjs/swagger';
import { DepartmentEntity } from '@src/app/department/entities/department.entity';
import { Role } from '@src/infrastructure/enum/role.enum';
import { Sex } from '@src/infrastructure/enum/sex.enum';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class StudentCreateDto implements StudentInterface {
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

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

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
  role: Role.STUDENT;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Transform((params) => {
    return +params.value;
  })
  departmentId: number;

  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  birth?: Date;

  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  profileImageURL?: string;

  constructor(data: StudentCreateDto) {
    Object.assign(this, data);
  }

  // Department entity save property
  department: DepartmentEntity;
}
