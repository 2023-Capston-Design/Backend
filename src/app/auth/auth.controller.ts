import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
  refs,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequest } from './dto/login.request';
import { TokenResponse } from './dto/token.response';
import { Request } from 'express';
import { AUTH_ERROR } from '@src/infrastructure/errors/auth.error';
import {
  MEMBER_ERROR,
  MemberNotFound,
} from '@src/infrastructure/errors/members.errors';
import { RoleGuard } from '@src/infrastructure/rbac/role/role.guard';
import { Role } from '@src/infrastructure/enum/role.enum';
import { AllowedRole } from '@src/infrastructure/rbac/decorator/role.decorator';
import { JoinRequest } from './dto/join.request';
import { JoinResponse } from './dto/join.response';
import { StudentCreateDto } from '../student/dto/student-create.request';
import { InstructorCreateDto } from '../instructor/dto/instructor-create.request';
import { StudentProfileResponse } from '../student/dto/student-profile.response';
import { InstructorProfileRepsonse } from '../instructor/dto/instructor-profile.response';
import { Sex } from '@src/infrastructure/enum/sex.enum';
import { ManagerProfileResponse } from '../manager/dto/manager-profile.response';
import { ManagerCreateDto } from '../manager/dto/manager-create.request';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @UseGuards(RoleGuard)
  @AllowedRole('any')
  @ApiOperation({ summary: '로그인 API. JWT 토큰을 발급합니다' })
  @ApiOkResponse({ type: TokenResponse })
  @ApiBadRequestResponse({
    description: [
      AUTH_ERROR.INVALID_PASSWORD,
      AUTH_ERROR.UNCONFIRMED_ROLE,
      MEMBER_ERROR.MEMBER_NOT_FOUND,
    ].join(', '),
  })
  public async login(@Body() body: LoginRequest): Promise<TokenResponse> {
    return await this.authService.login(body);
  }

  @Post('join')
  @UseGuards(RoleGuard)
  @AllowedRole('any')
  @ApiOperation({ summary: '회원가입 API.' })
  @ApiExtraModels(
    StudentCreateDto,
    InstructorCreateDto,
    ManagerCreateDto,
    StudentProfileResponse,
    InstructorProfileRepsonse,
    ManagerProfileResponse,
  )
  @ApiBody({
    schema: {
      anyOf: [
        {
          $ref: getSchemaPath(StudentCreateDto),
        },
        {
          $ref: getSchemaPath(InstructorCreateDto),
        },
        {
          $ref: getSchemaPath(ManagerCreateDto),
        },
      ],
    },
    examples: {
      Student: {
        value: {
          studentId: 'B889047',
          email: 'jhoplin7259@gmail.com',
          name: '윤준호',
          password: 'password',
          sex: Sex.MALE,
          role: Role.STUDENT,
          departmentId: 1,
          birth: new Date(),
          profileImageURL: 'URL',
        } as StudentCreateDto,
        description: "'birth', 'profileImageURL' is Optional",
      },
      Instructor: {
        value: {
          email: 'jsnbs@naver.com',
          name: '김병서',
          password: 'password',
          sex: Sex.MALE,
          role: Role.INSTRUCTOR,
          departmentId: 1,
          birth: new Date(),
          profileImageURL: 'URL',
        } as InstructorCreateDto,
        description: "'birth', 'profileImageURL' is Optional",
      },
      Manager: {
        value: {
          email: 'manager@gmail.com',
          name: 'manager',
          password: 'password',
          sex: Sex.MALE,
          role: Role.MANAGER,
          birth: new Date(),
          profileImageURL: 'URL',
        } as ManagerCreateDto,
        description: "'birth', 'profileImageURL' is Optional",
      },
    },
  })
  @ApiOkResponse({
    schema: {
      anyOf: [
        {
          $ref: getSchemaPath(StudentProfileResponse),
        },
        {
          $ref: getSchemaPath(InstructorProfileRepsonse),
        },
        {
          $ref: getSchemaPath(ManagerProfileResponse),
        },
      ],
    },
  })
  @ApiConflictResponse({
    description: [
      MEMBER_ERROR.DUPLICATED_STUDENT_ID,
      MEMBER_ERROR.DUPLIcATED_EMAIL,
    ].join(', '),
  })
  @ApiBadRequestResponse({
    description: [AUTH_ERROR.UNCONFIRMED_ROLE].join(', '),
  })
  public async join(@Body() body: JoinRequest): Promise<JoinResponse> {
    return await this.authService.join(body);
  }
}
