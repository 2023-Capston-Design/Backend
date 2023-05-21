import { registerAs } from '@nestjs/config';

export default registerAs('mongo', () => ({
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT,
  user: process.env.MONGO_USER,
  password: process.env.MONGO_PASSWORD,
}));
