import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DepartmentDeleteRequest {
  @ApiProperty()
  @IsNotEmpty()
  departmentId: number;
}
