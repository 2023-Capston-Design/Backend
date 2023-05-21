import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AppService } from '@app/app.service';
import { HealthModule } from '@app/health/health.module';
import { ConfigModule } from '@nestjs/config';
import { configOptions } from '@src/options/config.option';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from '@src/options/typeorm.config';
import { StudentModule } from '@app/student/student.module';
import { InstructorModule } from '@app/instructor/instructor.module';
import { DepartmentModule } from './app/department/department.module';
import { MembersModule } from './app/members/members.module';
import { AuthModule } from './app/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfig } from './options/mongo.option';
import { JwtModule } from '@nestjs/jwt';
import { jwtOptions } from './options/jwt.option';
import { MailModule } from './app/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    TypeOrmModule.forRootAsync(typeORMConfig),
    MongooseModule.forRootAsync(mongooseConfig),
    JwtModule.registerAsync(jwtOptions),
    MailModule,
    HealthModule,
    StudentModule,
    InstructorModule,
    DepartmentModule,
    AuthModule,
    MembersModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
