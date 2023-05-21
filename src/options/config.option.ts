import { ConfigModuleOptions } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { envValidator } from '@app/config/validater/env.validater';
import databaseConfig from '@app/config/config/database.config';
import jwtConfig from '@app/config/config/jwt.config';
import mongoConfig from '@src/app/config/config/mongo.config';
import mailConfig from '@src/app/config/config/mail.config';

dotenv.config({
  path: `${__dirname}/../app/config/env/${process.env.API_MODE || 'development'
    }.env`,
});

/**
 * cache : use process.env as memeory cached. Improve application performance
 * envFilePath: set env file path
 * isGlobal: Set config module as global, so it can use it as globally
 * load: Load configuration namespaces
 * validationSchema: check required field of process.env
 */

export const configOptions: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: [
    `${__dirname}/../config/env/${process.env.API_MODE || 'development'}.env`,
  ],
  cache: true,
  load: [databaseConfig, jwtConfig, mongoConfig, mailConfig],
  validationSchema: envValidator,
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
};
