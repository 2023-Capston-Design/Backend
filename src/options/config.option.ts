import { ConfigModuleOptions } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { envValidator } from 'src/config/validaotr/env.validaotr';
import databaseConfig from 'src/config/config/database.config';
import jwtConfig from 'src/config/config/jwt.config';

dotenv.config({
  path: `${__dirname}/../config/env/${process.env.API_MODE || 'development'
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
  load: [databaseConfig, jwtConfig],
  validationSchema: envValidator,
};
