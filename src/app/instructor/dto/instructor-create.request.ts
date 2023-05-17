import { Role } from '@src/infrastructure/enum/role.enum';
import { Sex } from '@src/infrastructure/enum/sex.enum';
import { InstructorInterface } from '../interface/instructor.interface';
import { ApiProperty } from '@nestjs/swagger';

export class InstructorCreateDto implements InstructorInterface {
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  password: string;

  @ApiProperty({
    enum: Sex,
  })
  sex: Sex;

  @ApiProperty({
    enum: Role,
  })
  role: Role;

  @ApiProperty({
    nullable: true,
  })
  birth?: Date;

  @ApiProperty({
    nullable: true,
  })
  profileImageURL?: string;

  @ApiProperty({
    nullable: true,
  })
  laboratory?: string;

  constructor(data: InstructorCreateDto) {
    Object.assign(this, data);
  }
}
