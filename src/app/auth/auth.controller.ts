import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
  Patch,
  Res,
  Delete,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
  refs,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequest } from './dto/login.request';
import { TokenResponse } from './dto/token.response';
import { Request, Response } from 'express';
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
import { AuthGuard } from './auth.guard';
import { WithdrawRequest } from './dto/withdraw.request';
import { ModifyRequestDto } from './dto/modify.request';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @UseGuards(RoleGuard)
  @AllowedRole('any')
  @ApiOperation({
    summary:
      '로그인 API. JWT 토큰을 발급합니다. Refresh Token은 cookie에 저장됩니다.',
  })
  @ApiOkResponse({ type: TokenResponse })
  @ApiBadRequestResponse({
    description: [
      AUTH_ERROR.INVALID_PASSWORD,
      AUTH_ERROR.UNCONFIRMED_ROLE,
      MEMBER_ERROR.MEMBER_NOT_FOUND,
    ].join(', '),
  })
  public async login(
    @Body() body: LoginRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TokenResponse> {
    return await this.authService.login(body, res);
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

  @Patch('modify')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '회원정보를 수정합니다' })
  @ApiUnauthorizedResponse({
    description: [AUTH_ERROR.INVALID_TOKEN, AUTH_ERROR.TOKEN_EXPIRED].join(
      ', ',
    ),
  })
  @ApiBadRequestResponse({
    description: [
      AUTH_ERROR.INVALID_PASSWORD,
      AUTH_ERROR.UNCONFIRMED_ROLE,
      MEMBER_ERROR.MEMBER_NOT_FOUND,
    ].join(', '),
  })
  @ApiBearerAuth()
  public async modifyInformation(
    @Body() body: ModifyRequestDto,
    @Req() req: Request,
  ) {
    return this.authService.modify(body, req);
  }

  @Patch('refresh')
  @ApiOkResponse({ type: TokenResponse })
  @ApiUnauthorizedResponse({
    description: [AUTH_ERROR.INVALID_TOKEN, AUTH_ERROR.TOKEN_EXPIRED].join(
      ', ',
    ),
  })
  @ApiBadRequestResponse({
    description: [AUTH_ERROR.UNCONFIRMED_ROLE].join(', '),
  })
  @ApiOperation({
    summary:
      'Access Token 재발급. Cookie에 저장된 refresh token을 통해 재발급합니다.',
  })
  public async refreshAccessToken(@Req() req: Request) {
    return await this.authService.refreshAccessToken(req);
  }

  @Delete('logout')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '로그아웃. 쿠키에서 refresh token을 삭제합니다.',
  })
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.logout(req, res);
  }

  @Delete('withdraw')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '회원탈퇴' })
  @ApiBearerAuth()
  @ApiBadRequestResponse({
    description: [
      AUTH_ERROR.INVALID_PASSWORD,
      AUTH_ERROR.UNCONFIRMED_ROLE,
      MEMBER_ERROR.MEMBER_NOT_FOUND,
    ].join(', '),
  })
  @ApiUnauthorizedResponse({
    description: [AUTH_ERROR.NEED_TOKEN].join(', '),
  })
  public async withdraw(
    @Body() body: WithdrawRequest,
    @Req() req: Request,
  ): Promise<boolean> {
    return await this.authService.withdraw(body, req);
  }
}
