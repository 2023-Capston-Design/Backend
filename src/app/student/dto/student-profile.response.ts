import { StudentEntity } from '@app/student/entities/student.entity';
import { StudentInterface } from '@app/student/interface/student.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@src/infrastructure/enum/role.enum';
import { Sex } from '@src/infrastructure/enum/sex.enum';

export class StudentProfileResponse implements StudentInterface {
  @ApiProperty()
  id: number;

  @ApiProperty()
  studentId: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty({
    enum: Sex,
  })
  sex: Sex;

  @ApiProperty({
    enum: Role,
  })
  role: Role;

  @ApiProperty()
  birth: Date;

  @ApiProperty({
    nullable: true,
  })
  profileImageURL?: string;

  @ApiProperty({
    nullable: true,
  })
  departmentId?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({
    nullable: true,
  })
  updatedAt?: Date;

  public getStudentID() {
    return this.id;
  }

  constructor(student: StudentEntity) {
    Object.assign(this, student);
  }
  password: string;
}
