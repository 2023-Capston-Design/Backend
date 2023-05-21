import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InstructorService } from '../instructor/instructor.service';
import { StudentService } from '../student/student.service';
import jwtConfig from '../config/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { TokenResponse } from './dto/token.response';
import { LoginRequest } from './dto/login.request';
import { Role } from '@src/infrastructure/enum/role.enum';
import {
  InvalidToken,
  TokenExpired,
  UnconfirmedRole,
} from '@src/infrastructure/errors/auth.error';
import { MembersService } from '../members/members.service';
import { StudentProfileResponse } from '../student/dto/student-profile.response';
import { InstructorProfileRepsonse } from '../instructor/dto/instructor-profile.response';
import {
  JwtDecodedPayload,
  JwtPayload,
  JwtSubjectType,
} from '@src/infrastructure/types/jwt.types';
import { JoinResponse } from './dto/join.response';
import { JoinRequest } from './dto/join.request';
import { ManagerService } from '../manager/manager.service';
import { ManagerProfileResponse } from '../manager/dto/manager-profile.response';
import { CookieOptions, Request, Response } from 'express';

@Injectable()
export class AuthService {
  /**
   * Cookie Option Setting
   *
   * 참고 : https://velog.io/@sms8377/Network-%EC%BF%A0%ED%82%A4-%EC%98%B5%EC%85%98%EC%9D%98-%EC%97%AD%ED%95%A0
   *
   * path: 특정 리소스에서만 쿠키헤더를 보낼 수 있도록 지정한다.(특정 경로에서만 쿠키 활성화)
   * httpOnly: 웹서버와 통신할때만 쿠키를 발급한다. Client Side JavaScript를 통한 쿠키 탈취 방지
   */

  private readonly cookieRefreshKey = 'refresh_token';
  private readonly refreshCookieOption: CookieOptions = {
    path: '/auth',
    httpOnly: true,
  };

  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtSetting: ConfigType<typeof jwtConfig>,
    private readonly instructorService: InstructorService,
    private readonly studentService: StudentService,
    private readonly memberService: MembersService,
    private readonly managerService: ManagerService,
  ) { }

  public async login(
    body: LoginRequest,
    res: Response,
  ): Promise<TokenResponse> {
    const { email, password, role } = body;

    let selectiveServiceResult:
      | StudentProfileResponse
      | InstructorProfileRepsonse
      | ManagerProfileResponse;
    if (role === Role.STUDENT) {
      selectiveServiceResult = await this.studentService.getStudentByEmail(
        email,
      );
    } else if (role === Role.INSTRUCTOR) {
      selectiveServiceResult =
        await this.instructorService.getInstructorByEmail(email);
    } else if (role === Role.MANAGER) {
      selectiveServiceResult = await this.managerService.getManagerByEmail(
        email,
      );
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

    res.cookie(this.cookieRefreshKey, refreshToken, this.refreshCookieOption);

    return new TokenResponse(accessToken);
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

  public async refreshAccessToken(req: Request) {
    const refreshToken = req.cookies[this.cookieRefreshKey];
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    let payload: JwtDecodedPayload;
    try {
      payload = <JwtDecodedPayload>this.jwtService.verify(refreshToken, {
        secret: this.jwtSetting.secret,
      });
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        throw new InvalidToken();
      } else if (err.name === 'TokenExpiredError') {
        throw new TokenExpired();
      }
    }

    // If token type is not refresh token
    if (payload.sub !== JwtSubjectType.REFRESH) {
      throw new InvalidToken();
    }

    const { user_id, user_role } = payload;
    // Check if it's existing role
    switch (user_role) {
      case Role.STUDENT:
        await this.studentService.getStudentInformationById(user_id);
        break;
      case Role.MANAGER:
        await this.managerService.getManagerById(user_id);
        break;
      case Role.INSTRUCTOR:
        await this.managerService.getManagerById(user_id);
        break;
      default:
        throw new UnconfirmedRole();
    }

    const accessToken = await this.generateAccessToken({
      user_id: payload.user_id,
      user_role: payload.user_role,
    });
    return new TokenResponse(accessToken);
  }

  public async logout(req: Request, res: Response) {
    const refreshToken = req.cookies[this.cookieRefreshKey];
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    /**
     * 동일한 옵션을 가진 쿠키를 삭제한다
     */
    res.clearCookie(this.cookieRefreshKey, this.refreshCookieOption);
    return true;
  }

  private async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.jwtSetting.accessToken.expire,
      subject: JwtSubjectType.ACCESS,
    });
  }

  private async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.jwtSetting.refreshToken.expire,
      subject: JwtSubjectType.REFRESH,
    });
  }
}
