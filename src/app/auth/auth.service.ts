import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InstructorService } from '../instructor/instructor.service';
import { StudentService } from '../student/student.service';
import jwtConfig from '../config/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { TokenResponse } from './dto/token.response';
import { Request } from 'express';
import { LoginRequest } from './dto/login.request';
import { Role } from '@src/infrastructure/enum/role.enum';
import { UnconfirmedRole } from '@src/infrastructure/errors/auth.error';
import { MembersService } from '../members/members.service';
import { StudentProfileResponse } from '../student/dto/student-profile.response';
import { InstructorProfileRepsonse } from '../instructor/dto/instructor-profile.response';
import { JwtPayload } from '@src/infrastructure/types/jwt.types';
import { JoinResponse } from './dto/join.response';
import { JoinRequest } from './dto/join.request';
import { StudentCreateDto } from '../student/dto/student-create.request';
import { InstructorCreateDto } from '../instructor/dto/instructor-create.request';
import { ManagerService } from '../manager/manager.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtSetting: ConfigType<typeof jwtConfig>,
    private readonly instructorService: InstructorService,
    private readonly studentService: StudentService,
    private readonly memberService: MembersService,
    private readonly managerService: ManagerService,
  ) { }

  public async login(body: LoginRequest): Promise<TokenResponse> {
    const { email, password, role } = body;

    let selectiveServiceResult:
      | StudentProfileResponse
      | InstructorProfileRepsonse;
    if (role === Role.STUDENT) {
      selectiveServiceResult = await this.studentService.getStudentByEmail(
        email,
      );
    } else if (role === Role.INSTRUCTOR) {
      selectiveServiceResult =
        await this.instructorService.getInstructorByEmail(email);
    } else {
      throw new UnconfirmedRole();
    }

    // Varaibles for payload and password
    const memberPassword = selectiveServiceResult.password;
    const memberId = selectiveServiceResult.id;
    const memberRole = selectiveServiceResult.role;

    // Password validation
    await this.memberService.validatePassword(password, memberPassword);

    const payload: JwtPayload = {
      user_id: memberId,
      user_role: memberRole,
    };
    // Token generation
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);
    return new TokenResponse(accessToken, refreshToken);
  }

  public async join(body: JoinRequest): Promise<JoinResponse> {
    // Check Role of Body
    const { role } = body;
    body.password = await this.memberService.hashPassword(body.password);
    let result: JoinResponse;
    if (role === Role.STUDENT) {
      result = await this.studentService.createStudent(body);
    } else if (role === Role.INSTRUCTOR) {
      result = await this.instructorService.createInstructor(body);
    } else if (role === Role.MANAGER) {
      result = await this.managerService.createManager(body);
    } else {
      throw new UnconfirmedRole();
    }
    return result;
  }

  private async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.jwtSetting.accessToken.expire,
      subject: this.jwtSetting.accessToken.subject,
    });
  }

  private async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.jwtSetting.refreshToken.expire,
      subject: this.jwtSetting.refreshToken.subject,
    });
  }
}
