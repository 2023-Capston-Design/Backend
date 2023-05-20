import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import {
  NeedToken,
  UnconfirmedRole,
  InvalidToken,
  AuthenticationRequired,
} from '@infrastructure/errors/auth.error';
import jwtConfig from '@app/config/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import {
  JwtPayload,
  JwtDecodedPayload,
  JwtSubjectType,
} from '@src/infrastructure/types/jwt.types';
import { StudentService } from '../student/student.service';
import { InstructorService } from '../instructor/instructor.service';
import { Role } from '@src/infrastructure/enum/role.enum';
import { StudentProfileResponse } from '../student/dto/student-profile.response';
import { InstructorProfileRepsonse } from '../instructor/dto/instructor-profile.response';
import { MemberNotFound } from '@src/infrastructure/errors/members.errors';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from '../student/entities/student.entity';
import { Repository } from 'typeorm';
import { InstructorEntity } from '../instructor/entities/instructor.entity';
import { ManagerEntity } from '../manager/entities/manager.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtSettings: ConfigType<typeof jwtConfig>,
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    @InjectRepository(InstructorEntity)
    private readonly instructorRepository: Repository<InstructorEntity>,
    @InjectRepository(ManagerEntity)
    private readonly managerRepository: Repository<ManagerEntity>,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = await this.extractBearerToken(request);
    if (!token) {
      throw new NeedToken();
    }
    let payload: JwtDecodedPayload;
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

    // If token is not access token
    if (payload.sub !== JwtSubjectType.ACCESS) {
      throw new AuthenticationRequired();
    }
    const id: number = payload.user_id;
    let repository: Repository<
      StudentEntity | ManagerEntity | InstructorEntity
    >;
    switch (payload.user_role) {
      case Role.STUDENT:
        repository = this.studentRepository;
        break;
      case Role.INSTRUCTOR:
        repository = this.instructorRepository;
        break;
      case Role.MANAGER:
        repository = this.managerRepository;
        break;
      default:
        throw new UnconfirmedRole();
    }
    const user = await repository.findOne({
      where: {
        id,
      },
    });
    // If user not found
    if (!user) {
      throw new MemberNotFound();
    }

    // If user found
    const requser: JwtPayload = {
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
