import { Role } from '@src/infrastructure/enum/role.enum';
import { Sex } from '@src/infrastructure/enum/sex.enum';
import { InstructorInterface } from '../interface/instructor.interface';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class InstructorCreateDto implements InstructorInterface {
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
  role: Role.INSTRUCTOR;

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

  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  laboratory?: string;

  constructor(data: InstructorCreateDto) {
    Object.assign(this, data);
  }
}
