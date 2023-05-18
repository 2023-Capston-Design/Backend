import { ApiProperty } from '@nestjs/swagger';
import { Member } from '@src/infrastructure/abstract-entities/member.abstract';
import { MemberInterface } from '@src/infrastructure/abstract-entities/member.interface';
import { Role } from '@src/infrastructure/enum/role.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest
  implements Pick<Member, 'email' | 'password' | 'role'>
{
  @ApiProperty({
    description: '계정 이메일',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: '계정 비밀번호',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    enum: Role,
    description: '회원 권한',
  })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
