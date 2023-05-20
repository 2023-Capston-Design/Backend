import { ApiProperty } from '@nestjs/swagger';
import { DepartmentInterface } from '../interface/department.interface';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class DepartmentCreateDto implements DepartmentInterface {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phonenumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  constructor(data: DepartmentCreateDto) {
    Object.assign(this, data);
  }
}
