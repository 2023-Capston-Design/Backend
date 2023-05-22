import { ApiProperty } from '@nestjs/swagger';
import { MemberInterface } from '@src/infrastructure/abstract-entities/member.interface';
import { Role } from '@src/infrastructure/enum/role.enum';
import { Sex } from '@src/infrastructure/enum/sex.enum';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ManagerCreateDto implements MemberInterface {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
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
  role: Role.MANAGER;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  birth?: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  profileImageURL?: string;

  constructor(data: ManagerCreateDto) {
    Object.assign(this, data);
  }
}
