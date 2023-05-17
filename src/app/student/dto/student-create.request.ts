import { StudentInterface } from '@app/student/interface/student.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@src/infrastructure/enum/role.enum';
import { Sex } from '@src/infrastructure/enum/sex.enum';

export class StudentCreateDto implements StudentInterface {
  @ApiProperty()
  studentId: string;

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

  constructor(data: StudentCreateDto) {
    Object.assign(this, data);
  }
}
