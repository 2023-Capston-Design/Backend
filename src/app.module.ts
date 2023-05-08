import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { configOptions } from './options/config.option';

@Module({
  imports: [ConfigModule.forRoot(configOptions), HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
