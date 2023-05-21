import { Request } from 'express';

declare global {
  type FieldOptional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

  interface SwaggerTag {
    tag: string;
    description: string;
  }

  interface Request extends Request {
    user; // JWT Payload field
    token_subject; // JWT Token subject. One of value in enum 'JWTSubjectType'
  }
}
