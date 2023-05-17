import { Role } from '@src/infrastructure/enum/role.enum';
import { Sex } from '@src/infrastructure/enum/sex.enum';
import { InstructorInterface } from '../interface/instructor.interface';
import { ApiProperty } from '@nestjs/swagger';
import { InstructorEntity } from '../entities/instructor.entity';

export class InstructorProfileRepsonse implements InstructorInterface {
  password: string;
  @ApiProperty()
  id: number;

  @ApiProperty()
  laboratory?: string;

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

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({
    nullable: true,
  })
  updatedAt?: Date;

  public getInstructorId() {
    return this.id;
  }

  constructor(instructor: InstructorEntity) {
    Object.assign(this, instructor);
  }
}
