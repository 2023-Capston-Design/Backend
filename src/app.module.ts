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

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    TypeOrmModule.forRootAsync(typeORMConfig),
    HealthModule,
    StudentModule,
    InstructorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
