import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import {
  NeedToken,
  UnconfirmedRole,
  InvalidToken,
} from '@infrastructure/errors/auth.error';
import jwtConfig from '@app/config/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import {
  JwtPayload,
  FilteredJwtPayload,
} from '@src/infrastructure/types/jwt.types';
import { StudentService } from '../student/student.service';
import { InstructorService } from '../instructor/instructor.service';
import { Role } from '@src/infrastructure/enum/role.enum';
import { StudentProfileResponse } from '../student/dto/student-profile.response';
import { InstructorProfileRepsonse } from '../instructor/dto/instructor-profile.response';
import { MemberNotFound } from '@src/infrastructure/errors/members.errors';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtSettings: ConfigType<typeof jwtConfig>,
    private readonly studentService: StudentService,
    private readonly instructorService: InstructorService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = await this.extractBearerToken(request);
    if (!token) {
      throw new NeedToken();
    }
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSettings.secret,
      });
    } catch (err) {
      /**
       * TODO
       *
       * 1. Apply redis cache
       *
       * 2. Make exception filter
       *
       * -> If TokenExpiredError -> check redis
       *
       */
      return false;
    }
    const id: number = payload.user_id;
    let user: StudentProfileResponse | InstructorProfileRepsonse | null;
    switch (payload.user_role) {
      case Role.STUDENT:
        user = await this.studentService.getStudentInformationById(id);
        break;
      case Role.INSTRUCTOR:
        user = await this.instructorService.getInstructorById(id);
        break;
      default:
        return false;
    }
    // If user not found
    if (!user) {
      return false;
    }

    // If user found
    const requser: FilteredJwtPayload = {
      user_id: user.id,
      user_role: user.role,
    };
    request.user = requser;
    return true;
  }

  private async extractBearerToken(req: Request): Promise<string> | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
