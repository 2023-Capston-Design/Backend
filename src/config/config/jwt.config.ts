import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessToken: {
    expire: process.env.ACCESS_TOKEN_EXPIRE,
    subject: process.env.ACCESS_SUBJECT,
  },
  refreshToken: {
    expire: process.env.REFRESH_TOKEN_EXPIRE,
    subject: process.env.REFRESH_SUBJECT,
  },
  secret: process.env.TOKEN_SECRET,
  issuer: process.env.ISSUER,
}));
