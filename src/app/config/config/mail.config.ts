import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  id: process.env.MAIL_ID,
  pw: process.env.MAIL_PASSWORD,
  api_gw: process.env.MAIL_API_GATEWAY,
}));
