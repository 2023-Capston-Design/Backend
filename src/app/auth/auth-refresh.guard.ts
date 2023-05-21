import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import {
  AuthenticationRequired,
  InvalidToken,
  NeedToken,
  TokenExpired,
  UnconfirmedRole,
} from '@src/infrastructure/errors/auth.error';
import {
  JwtDecodedPayload,
  JwtPayload,
  JwtSubjectType,
} from '@src/infrastructure/types/jwt.types';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from '../student/entities/student.entity';
import { InstructorEntity } from '../instructor/entities/instructor.entity';
import { ManagerEntity } from '../manager/entities/manager.entity';
import { Repository } from 'typeorm';
import { Role } from '@src/infrastructure/enum/role.enum';
import { MemberNotFound } from '@src/infrastructure/errors/members.errors';

@Injectable()
export class AuthRefreshGuard implements CanActivate {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtSetting: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
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
        secret: this.jwtSetting.secret,
      });
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        throw new InvalidToken();
      } else if (err.name === 'TokenExpiredError') {
        throw new TokenExpired();
      }
      return false;
    }

    if (payload.sub !== JwtSubjectType.REFRESH) {
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

    if (!user) {
      throw new MemberNotFound();
    }

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
