import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MailValidationSchema,
  mailvalidation,
} from './schema/mail-validation.schema';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import mailConfig from '../config/config/mail.config';
import jwtConfig from '../config/config/jwt.config';

@Module({
  imports: [
    ConfigModule.forFeature(mailConfig),
    ConfigModule.forFeature(jwtConfig),
    MongooseModule.forFeature([
      {
        name: mailvalidation.name,
        schema: MailValidationSchema,
      },
    ]),
  ],
  providers: [MailService],
  controllers: [MailController],
})
export class MailModule { }
