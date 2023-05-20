import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MembersModule } from '../members/members.module';
import { InstructorModule } from '../instructor/instructor.module';
import { StudentModule } from '../student/student.module';
import jwtConfig from '../config/config/jwt.config';
import { ManagerModule } from '../manager/manager.module';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    MembersModule,
    InstructorModule,
    StudentModule,
    ManagerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => {
        const issuer = configService.get<string>('ISSUER', 'hoplin');
        return {
          secret: configService.get<string>('TOKEN_SECRET', ''),
          verifyOptions: {
            issuer,
          },
          signOptions: {
            issuer,
          },
        };
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule { }
