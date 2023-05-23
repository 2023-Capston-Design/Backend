import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class DepartmentModifyDto {
  @ApiProperty()
  @IsNotEmpty()
  departmentId: number;

  @ApiProperty()
  phonenumber: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  email: string;
}
